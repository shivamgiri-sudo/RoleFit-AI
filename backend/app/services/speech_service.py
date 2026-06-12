from dataclasses import dataclass
from typing import Any

import httpx


class SpeechProviderError(RuntimeError):
    pass


@dataclass
class TranscriptionResult:
    provider: str
    model: str
    transcript: str
    confidence: float
    language: str
    note: str
    raw_request_id: str | None = None


def normalize_text_transcript(text: str, provider: str = "manual", model: str = "manual-transcript", language: str = "en-IN") -> TranscriptionResult:
    clean_text = " ".join(text.strip().split())
    confidence = 0.98 if len(clean_text.split()) >= 50 else 0.75
    return TranscriptionResult(
        provider=provider,
        model=model,
        transcript=clean_text,
        confidence=confidence,
        language=language,
        note="Manual transcript normalized. Use /integrations/transcribe-audio for real audio transcription.",
    )


async def transcribe_deepgram_audio(
    *,
    audio_bytes: bytes,
    content_type: str,
    api_key: str | None,
    model: str = "nova-3",
    language: str = "en-IN",
    smart_format: bool = True,
) -> TranscriptionResult:
    if not api_key:
        raise SpeechProviderError("DEEPGRAM_API_KEY is missing. Add it to the backend environment variables.")
    if not audio_bytes:
        raise SpeechProviderError("Audio file is empty.")

    params: dict[str, Any] = {
        "model": model,
        "smart_format": str(smart_format).lower(),
        "language": language,
    }
    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": content_type or "application/octet-stream",
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            "https://api.deepgram.com/v1/listen",
            params=params,
            headers=headers,
            content=audio_bytes,
        )

    if response.status_code >= 400:
        raise SpeechProviderError(f"Deepgram transcription failed: {response.status_code} {response.text[:500]}")

    payload = response.json()
    try:
        alternative = payload["results"]["channels"][0]["alternatives"][0]
        transcript = alternative.get("transcript", "").strip()
        confidence = float(alternative.get("confidence") or 0)
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise SpeechProviderError("Deepgram response format was not recognized.") from exc

    if not transcript:
        raise SpeechProviderError("Deepgram returned an empty transcript.")

    metadata = payload.get("metadata", {}) if isinstance(payload, dict) else {}
    return TranscriptionResult(
        provider="deepgram",
        model=model,
        transcript=transcript,
        confidence=confidence,
        language=language,
        note="Real Deepgram transcription completed.",
        raw_request_id=metadata.get("request_id"),
    )


def provider_connection_hint(provider: str, has_key: bool) -> str:
    if provider == "deepgram" and has_key:
        return "Deepgram is configured for real audio transcription."
    if provider == "deepgram":
        return "Deepgram selected, but DEEPGRAM_API_KEY is missing."
    if provider in {"aws", "azure", "google", "openai"} and has_key:
        return f"{provider} is configured. Add the provider adapter in speech_service.py if needed."
    return f"{provider} selected, but required configuration is incomplete."
