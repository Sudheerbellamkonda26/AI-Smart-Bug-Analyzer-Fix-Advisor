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
You are an experienced Software Engineer and Bug Analysis Expert.

Analyze the following bug report and generate an actionable fix recommendation.

Bug Report:
{bug_report}

Triage:
{json.dumps(triage, indent=2)}

Log Analysis:
{json.dumps(log_analysis, indent=2)}

Root Cause:
{json.dumps(root_cause, indent=2)}

Similar Bugs:
{json.dumps(similar_bugs, indent=2)}

Return ONLY valid JSON.

{{
  "summary": "",
  "recommended_fix": "",
  "steps": [
    "",
    "",
    ""
  ],
  "code_snippet": "",
  "best_practice": "",
  "confidence": 0.95
}}
"""

    try:
        print("\n========== GEMINI ==========")
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

        recommendation = json.loads(text)

        print("JSON parsed successfully.")
        print("============================\n")

        return recommendation

    except Exception:
        print("\n========== GEMINI ERROR ==========")
        traceback.print_exc()
        print("==================================")
        raise