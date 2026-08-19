import json
import os

try:
    from google import genai
except ImportError:  # google-genai paketinin kurulu olmaması durumunda app import edilmeye devam etsin.
    genai = None

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY")) if genai else None


class GeminiService:

    @classmethod
    def get_word_meaning(cls, word):
        print(f"DEBUG GEMINI BYPASS: {word}")
        return None