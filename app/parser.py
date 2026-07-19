from pathlib import Path
from pypdf import PdfReader

def extract_text(file_path):
    extension = Path(file_path).suffix.lower()

    if extension == ".txt" or extension == ".log":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    elif extension == ".pdf":
        text = ""
        reader = PdfReader(file_path)

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        return text

    return "Unsupported file type."