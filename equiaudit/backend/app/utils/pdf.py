from __future__ import annotations


def _escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_simple_pdf(title: str, lines: list[str]) -> bytes:
    safe_title = _escape_pdf_text(title)
    safe_lines = [_escape_pdf_text(line) for line in lines]

    y = 760
    text_lines = ["BT", "/F1 12 Tf", "72 760 Td", f"({safe_title}) Tj"]
    for line in safe_lines:
        y -= 16
        text_lines.append(f"0 -16 Td ({line}) Tj")
    text_lines.append("ET")

    stream = "\n".join(text_lines).encode("utf-8")
    objects = []

    objects.append(b"1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj")
    objects.append(b"2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj")
    objects.append(
        b"3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>endobj"
    )
    objects.append(b"4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj")
    objects.append(
        b"5 0 obj<< /Length " + str(len(stream)).encode("ascii") + b" >>stream\n" + stream + b"\nendstream endobj"
    )

    xref_offsets = []
    pdf = [b"%PDF-1.4\n"]
    current_offset = len(pdf[0])
    for obj in objects:
        xref_offsets.append(current_offset)
        pdf.append(obj + b"\n")
        current_offset += len(obj) + 1

    xref_start = current_offset
    xref_lines = [b"xref", b"0 6", b"0000000000 65535 f "]
    for offset in xref_offsets:
        xref_lines.append(f"{offset:010d} 00000 n ".encode("ascii"))
    pdf.extend([line + b"\n" for line in xref_lines])

    trailer = (
        b"trailer<< /Size 6 /Root 1 0 R >>\nstartxref\n"
        + str(xref_start).encode("ascii")
        + b"\n%%EOF"
    )
    pdf.append(trailer)

    return b"".join(pdf)
