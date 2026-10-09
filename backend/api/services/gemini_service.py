import json
import logging
import os

logger = logging.getLogger(__name__)

try:
    from google import genai
    from google.genai import types
except ImportError:  # google-genai paketinin kurulu olmaması durumunda app import edilmeye devam etsin.
    genai = None
    types = None

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY")) if genai else None
details_client = (
    genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
        http_options=types.HttpOptions(timeout=10000),
    )
    if genai and types and os.getenv("GEMINI_API_KEY")
    else None
)


class GeminiService:

    @classmethod
    def get_word_details(cls, word):
        if details_client is None:
            return None

        try:
            prompt = (
                f"'{word}' İngilizce kelimesi için kısa ve doğru bir İngilizce açıklama "
                "ve bu anlamı gösteren doğal bir İngilizce örnek cümle üret. "
                "Sadece şu JSON formatında cevap ver: "
                '{"definition": "...", "example": "..."}'
            )
            response = details_client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                    max_output_tokens=160,
                ),
            )
            data = json.loads(response.text or "{}")
            definition = data.get("definition", "")
            example = data.get("example", "")

            return {
                "definition": definition.strip() if isinstance(definition, str) else "",
                "example": example.strip() if isinstance(example, str) else "",
            }
        except Exception:
            logger.exception("Gemini word detail generation failed")
            return None

    @classmethod
    def get_word_meaning(cls, word):
        if client is None:
            return None

        try:
            prompt = (
                f"'{word}' İngilizce kelimesinin Türkçe karşılıklarını ver. "
                "Sadece şu JSON formatında cevap ver, başka hiçbir açıklama ekleme: "
                '{"meaning1": "...", "meaning2": "...", "meaning3": "...", "level": "A1/A2/B1/B2/C1/C2"}'
            )

            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
            )

            text = response.text.strip().strip("`").replace("json", "", 1).strip()
            data = json.loads(text)

            return {
                "word": word,
                "meaning1": data.get("meaning1", ""),
                "meaning2": data.get("meaning2", ""),
                "meaning3": data.get("meaning3", ""),
                "level": data.get("level", ""),
            }

        except Exception as e:
            print(f"Gemini hata: {e}")
            return None