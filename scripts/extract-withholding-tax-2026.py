"""Extract the 2026-02-27 simplified withholding table from the official PDF.

Usage: python scripts/extract-withholding-tax-2026.py path/to/official.pdf
The PDF is the 27-page Law.go.kr annex with flSeq=169798151.
"""

import json
import re
import sys
from pathlib import Path

import fitz

SOURCE = "https://www.law.go.kr/LSW/flDownload.do?flSeq=169798151"
CELL = re.compile(r"^(?:-|\d[\d,]*)$")


def extract(pdf_path: Path) -> list[list[int]]:
    document = fitz.open(pdf_path)
    if len(document) != 27:
        raise ValueError(f"Expected 27 pages, found {len(document)}")
    rows = []
    for page_number in range(1, 27):
        lines = [line.strip() for line in document[page_number].get_text().splitlines()]
        # Each page repeats column headings 1..11. Find the last 11 heading;
        # numeric table cells start after the following above/below labels.
        heading = max(index for index, line in enumerate(lines) if line == "11")
        cells = [line for line in lines[heading + 1:] if CELL.fullmatch(line)]
        for offset in range(0, len(cells) - 12, 13):
            values = cells[offset:offset + 13]
            lower, upper = (int(value.replace(",", "")) for value in values[:2])
            if lower >= 10000:
                break
            if upper <= lower or len(values) != 13:
                raise ValueError(f"Invalid bracket on PDF page {page_number + 1}: {values}")
            row = [lower, upper, *[0 if value == "-" else int(value.replace(",", "")) for value in values[2:]]]
            rows.append(row)
    if not rows or rows[0][0] != 770 or rows[-1][1] != 10000:
        raise ValueError(f"Wrong table extent: {rows[0] if rows else None} .. {rows[-1] if rows else None}")
    for previous, current in zip(rows, rows[1:]):
        if previous[1] != current[0]:
            raise ValueError(f"Gap or overlap between {previous[:2]} and {current[:2]}")
    target = next(row for row in rows if row[:2] == [3500, 3520])
    if target[2:] != [127220, 102220, 62460, 49340, 37630, 32380, 27130, 21880, 17390, 14010, 10640]:
        raise ValueError(f"Official 3500–3520 row mismatch: {target}")
    return rows


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    rows = extract(Path(sys.argv[1]))
    output = Path(__file__).resolve().parents[1] / "src/data/withholding-tax-2026.json"
    payload = {
        "source": SOURCE,
        "amended": "2026-02-27",
        "unit": "lower/upper: thousand KRW, tax: KRW",
        "columns": "lowerInclusiveK,upperExclusiveK,family1..family11",
        "rows": rows,
    }
    output.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Extracted {len(rows)} continuous rows to {output}")
