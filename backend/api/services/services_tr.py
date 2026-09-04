import requests


def translate_word(word, source_language="en"):
    if not word or not str(word).strip():
        return None

    langpair = "en|tr" if source_language.lower() == "en" else "tr|en"

    url = (
        f"https://api.mymemory.translated.net/get"
        f"?q={word}&langpair={langpair}"
    )

    try:
        response = requests.get(url, timeout=5)
    except requests.exceptions.RequestException:
        return None

    if response.status_code != 200:
        return None

    try:
        data = response.json()
    except ValueError:
        return None

    translated_text = data.get("responseData", {}).get("translatedText")
    return translated_text