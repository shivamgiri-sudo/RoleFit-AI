from dataclasses import dataclass
from typing import Optional


@dataclass
class TranscriptionResult:
    provider: str
    model: str
    transcript: str
    confidence: float
    language: str
    note: str


def transcribe_text_input(text: str, provider: str = "mock", model: str = "mock-transcriber-v1", language: str = "en-IN") -> TranscriptionResult:
    """Development-safe transcription helper.

    The MVP accepts transcript text directly so local development works without paid speech credentials.
    Production can replace this function with Deepgram, OpenAI, AWS Transcribe, Azure Speech,
    or Google Speech-to-Text while preserving the same response contract.
    """
    clean_text = " ".join(text.strip().split())
    confidence = 0.92 if len(clean_text.split()) >= 50 else 0.68
    return TranscriptionResult(
        provider=provider,
        model=model,
        transcript=clean_text,
        confidence=confidence,
        language=language,
        note="Mock transcript pathway. Connect a speech-to-text vendor for production audio files.",
    )


def provider_connection_hint(provider: str, has_key: bool) -> str:
    if provider == "mock":
        return "Mock provider active. No external API key is required."
    if has_key:
        return f"{provider} key is configured. Wire the vendor client in speech_service.py."
    return f"{provider} selected, but the required API key is not configured."
