import os
import json
import traceback
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)

def generate_root_cause(
    bug_report,
    log_analysis,
    historical_bugs,
):
    prompt = f"""
You are an expert Software Debugging Engineer.

Your task is to determine the MOST PROBABLE root cause of the submitted bug.

Use:
1. The current bug report.
2. The parsed log analysis.
3. Historical bug reports retrieved using semantic search.

Current Bug Report:
{bug_report}

Log Analysis:
{json.dumps(log_analysis, indent=2)}

Historical Bugs:
{json.dumps(historical_bugs, indent=2)}

Instructions:

- Compare the current bug with historical bugs.
- Use the historical resolutions as supporting evidence.
- Explain why you believe this is the most probable root cause.
- Estimate your confidence.
- Return ONLY valid JSON.

Return exactly:

{{
  "hypothesis": "",
  "confidence": 0.95,
  "reasoning": "",
  "supporting_evidence":[
      {{
          "bug_id":"",
          "similarity":0.95,
          "resolution":""
      }}
  ]
}}
"""

    try:

        print("\n========== ROOT CAUSE ==========")
        print("Calling Gemini API...")

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        print("Gemini response received.")

        text = response.text

        if not text:
            raise ValueError("Gemini returned an empty response.")

        text = text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)

        print("Root Cause JSON parsed.")
        print("================================\n")

        return result

    except Exception:
        print("\n========== ROOT CAUSE ERROR ==========")
        traceback.print_exc()
        print("======================================")

        return {
            "hypothesis": "Unable to determine the root cause.",
            "confidence": 0.50,
            "reasoning": "Gemini analysis failed.",
            "supporting_evidence": historical_bugs,
        }
    ...

def generate_fix_recommendation(
    bug_report,
    triage,
    log_analysis,
    root_cause,
    similar_bugs,
):
    prompt = f"""
You are an expert Software Debugging Engineer and Code Fix Assistant.

Your job is to analyze the submitted bug/problem and provide a corrected
version of the user's input.

IMPORTANT:
- The user may submit source code, an error message, a sentence, a typo,
  configuration, SQL query, stack trace, or other text.
- Identify the actual problem.
- If the submitted input contains code, preserve the original programming
  language and provide corrected code.
- If the submitted input contains a simple text mistake such as a spelling
  mistake, correct the text directly.
- DO NOT change correct content unnecessarily.
- The "before" field MUST contain the original relevant input.
- The "after" field MUST contain the corrected version.
- The "after" field should be something the user can directly use.
- Explain exactly what was changed.
- If there is no clear correction possible, keep the after field equal to
  the original input and explain why.
- Do not invent errors that are not present.

Bug Report:
{bug_report}

Triage Analysis:
{json.dumps(triage, indent=2)}

Log Analysis:
{json.dumps(log_analysis, indent=2)}

Root Cause Analysis:
{json.dumps(root_cause, indent=2)}

Similar Historical Bugs:
{json.dumps(similar_bugs, indent=2)}

Return ONLY valid JSON.

Return exactly this structure:

{{
  "summary": "",
  "issue": "",
  "before": "",
  "after": "",
  "recommended_fix": "",
  "steps": [
    "",
    "",
    ""
  ],
  "explanation": "",
  "code_snippet": "",
  "best_practice": "",
  "confidence": 0.95
}}

Field instructions:

summary:
A short description of the problem.

issue:
Clearly identify what is wrong.

before:
The original user input that contains the problem.

after:
The corrected version of the input.

recommended_fix:
A short description of the fix.

steps:
Provide 2-5 practical steps explaining how the issue was fixed.

explanation:
Explain the difference between before and after in simple language.

code_snippet:
If the issue is related to programming code, provide ONLY the corrected
code here. If it is not code-related, return an empty string.

best_practice:
Give one relevant software engineering best practice.

confidence:
A number between 0 and 1 representing confidence in the correction.
"""

    try:
        print("\n========== GEMINI REMEDIATION ==========")
        print("Calling Gemini API...")

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        print("Gemini response received.")

        text = response.text

        if not text:
            raise ValueError("Gemini returned an empty response.")

        text = text.strip()

        # Remove Markdown JSON fences if Gemini returns them
        if text.startswith("```json"):
            text = text[7:]

        if text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        recommendation = json.loads(text)

        # Make sure the new fields always exist
        recommendation.setdefault("summary", "")
        recommendation.setdefault("issue", "")
        recommendation.setdefault("before", bug_report)
        recommendation.setdefault("after", bug_report)
        recommendation.setdefault("recommended_fix", "")
        recommendation.setdefault("steps", [])
        recommendation.setdefault("explanation", "")
        recommendation.setdefault("code_snippet", "")
        recommendation.setdefault("best_practice", "")
        recommendation.setdefault("confidence", 0.50)

        print("JSON parsed successfully.")
        print("Before/After fix generated.")
        print("============================\n")

        return recommendation

    except Exception:
        print("\n========== GEMINI ERROR ==========")
        traceback.print_exc()
        print("==================================")
        raise