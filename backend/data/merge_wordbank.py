import re
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).parent

FILES = {
    "A1": "A1.csv",
    "A2": "A2.csv",
    "B1": "B1.csv",
    "B2": "B2.csv",
    "C1": "C1.csv",
}

rows = []

for level, filename in FILES.items():

    print(f"Reading {filename}...")

    with open(
        BASE_DIR / filename,
        encoding="utf-8"
    ) as f:

        for line in f:

            line = line.strip().replace('"', "")

            if not line:
                continue

            if line.startswith("Terms"):
                continue

            if line.startswith("OXFORD"):
                continue

            parts = re.split(r"\s{2,}", line)

            if len(parts) < 2:
                continue

            word = parts[0].strip()

            meanings = []

            for part in parts[1:]:

                clean = re.sub(
                    r"\[.*?\]",
                    "",
                    part
                ).strip()

                if clean:
                    meanings.append(clean)

            while len(meanings) < 3:
                meanings.append("")

            rows.append({

                "word": word,

                "meaning1": meanings[0],

                "meaning2": meanings[1],

                "meaning3": meanings[2],

                "level": level,

            })

df = pd.DataFrame(rows)

df.insert(
    0,
    "id",
    range(1, len(df) + 1)
)

df.to_csv(
    BASE_DIR / "word_bank.csv",
    index=False,
    encoding="utf-8-sig"
)

print(df.head())

print(f"\nToplam kelime: {len(df)}")