import os
import json
import os
from google import genai

# os.environ.get kullanmadan, anahtarı doğrudan tırnak içinde yazın
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
class GeminiService:

    @classmethod
    def get_word_meaning(cls, word):
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