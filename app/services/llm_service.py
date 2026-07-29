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