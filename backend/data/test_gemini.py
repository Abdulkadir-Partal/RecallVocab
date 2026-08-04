import json
import re
import time
import pandas as pd
from google import genai
from google.genai import types

# ==========================
# AYARLAR
# ==========================

API_KEY = "AQ.Ab8RN6LhzK21ObtLjZKNmce4ZVmEfknJcWR8XJNCq-64aGOZZg"

INPUT_FILE = "ENGLISH_CEFR_WORDS.csv"
OUTPUT_FILE = "word_bank_test.csv"

BATCH_SIZE = 50
MODEL = "gemini-3.5-flash-lite"

# ==========================
# GEMINI
# ==========================

client = genai.Client(api_key=API_KEY)

# ==========================
# GİRİŞ DOSYASI
# ==========================

df = pd.read_csv(INPUT_FILE)

# Test etmek istersen:
# df = df.head(50)

# ==========================
# ÇIKIŞ DOSYASI VAR MI?
# ==========================

try:
    existing_df = pd.read_csv(OUTPUT_FILE)
    rows = existing_df.to_dict("records")
    current_id = len(rows) + 1
    print(f"Devam ediliyor.")
    print(f"{len(rows)} kelime zaten mevcut.")
except FileNotFoundError:
    rows = []
    current_id = 1
    print("Yeni word_bank oluşturuluyor.")


# ==========================
# JSON AYIKLAMA YARDIMCI FONKSİYONU
# ==========================

def extract_json_array(text: str):
    """
    Modelin yanıtından JSON dizisini güvenli şekilde çıkarır.
    Markdown, açıklama metni veya kesilmiş satırlar olsa bile
    ilk '[' ile eşleşen son ']' arasını almaya çalışır.
    """
    text = text.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("[")
    end = text.rfind("]")

    if start == -1 or end == -1 or end < start:
        raise ValueError("Yanıt içinde JSON dizisi bulunamadı.")

    json_str = text[start:end + 1]
    return json.loads(json_str)


# ==========================
# BATCH
# ==========================

for start in range(0, len(df), BATCH_SIZE):

    batch = df.iloc[start:start + BATCH_SIZE]

    print(f"\nİşleniyor: {start + 1}-{start + len(batch)}")

    word_list = []
    for _, row in batch.iterrows():
        word_list.append(f"{row['headword']} | CEFR: {row['CEFR']}")

    prompt = f"""
You are an expert English-Turkish lexicographer creating a CEFR vocabulary dataset.

Return ONLY valid JSON. No markdown, no explanations, no numbering.

Format:

[
  {{
    "word":"",
    "meaning1":"",
    "meaning2":"",
    "meaning3":""
  }}
]

Rules:
- Return EXACTLY {len(batch)} objects.
- Preserve the original order.
- Always fill meaning1, meaning2 and meaning3.
- Never leave any meaning empty.
- Never repeat the same meaning.
- Use the three most common Turkish dictionary meanings.
- If a word has only one primary meaning, generate closely related dictionary meanings.
- Maximum 3 words per meaning.
- The response MUST be a single valid JSON array and MUST be complete (do not truncate).

Words:

{chr(10).join(word_list)}
"""

    # ==========================
    # API + Retry
    # ==========================

    while True:

        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    # Modelin doğrudan JSON döndürmesini zorla
                    response_mime_type="application/json",
                    # Kesilmeyi önlemek için yeterli tavan tanı
                    max_output_tokens=8192,
                    temperature=0.3,
                ),
            )

            text = response.text or ""

            if not text.strip():
                print("Boş yanıt geldi. Muhtemelen token limiti / kesilme.")
                print("30 saniye sonra tekrar denenecek...")
                time.sleep(30)
                continue

            print("\n====================")
            print(text[:500], "..." if len(text) > 500 else "")
            print("====================\n")

            try:
                data = extract_json_array(text)
            except (ValueError, json.JSONDecodeError) as parse_err:
                print("JSON parse hatası:", parse_err)
                print("Yanıt uzunluğu:", len(text), "karakter")
                print("30 saniye sonra tekrar denenecek...")
                time.sleep(30)
                continue

            if len(data) != len(batch):
                print(f"Kelime sayısı uyuşmadı. Beklenen: {len(batch)}, Gelen: {len(data)}")
                print("30 saniye sonra tekrar denenecek...")
                time.sleep(30)
                continue

            # Her objede gerekli alanların olduğunu doğrula
            missing_field = False
            for item in data:
                for key in ("meaning1", "meaning2", "meaning3"):
                    if key not in item or not str(item[key]).strip():
                        missing_field = True
                        break
                if missing_field:
                    break

            if missing_field:
                print("Bazı meaning alanları eksik/boş geldi.")
                print("30 saniye sonra tekrar denenecek...")
                time.sleep(30)
                continue

            break

        except Exception as e:
            print("\nAPI Hatası:")
            print(e)
            print("30 saniye bekleniyor...\n")
            time.sleep(30)

    # ==========================
    # Sonuçları ekle
    # ==========================

    for i, (_, row) in enumerate(batch.iterrows()):
        item = data[i]

        rows.append({
            "id": current_id,
            "word": row["headword"],
            "meaning1": str(item["meaning1"]).strip(),
            "meaning2": str(item["meaning2"]).strip(),
            "meaning3": str(item["meaning3"]).strip(),
            "level": row["CEFR"],
        })

        current_id += 1

    # ==========================
    # HER BATCH SONUNDA KAYDET
    # ==========================

    pd.DataFrame(rows).to_csv(
        OUTPUT_FILE,
        index=False,
        encoding="utf-8-sig",
    )

    print(f"✅ Kaydedildi ({len(rows)} kelime)")

print("\n🎉 Tüm kelimeler başarıyla tamamlandı.")