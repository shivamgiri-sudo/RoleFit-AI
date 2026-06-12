from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

from ..services.provider_config import get_provider_config
from ..services.speech_service import (
    SpeechProviderError,
    normalize_text_transcript,
    provider_connection_hint,
    transcribe_deepgram_audio,
)

router = APIRouter(prefix="/integrations", tags=["integrations"])


class TranscriptRequest(BaseModel):
    text: str = Field(min_length=2)
    language: str = "en-IN"


@router.get("/status")
def integration_status():
    config = get_provider_config()
    speech_key_present = False
    if config.speech_provider == "deepgram":
        speech_key_present = config.deepgram_api_key_present
    elif config.speech_provider == "openai":
        speech_key_present = config.openai_api_key_present
    elif config.speech_provider in {"aws", "azure", "google"}:
        speech_key_present = True

    return {
        "ai_provider": config.ai_provider,
        "ai_model": config.ai_model,
        "speech_provider": config.speech_provider,
        "speech_model": config.speech_model,
        "speech_connection": provider_connection_hint(config.speech_provider, speech_key_present),
        "deepgram_api_key_present": config.deepgram_api_key_present,
        "openai_api_key_present": config.openai_api_key_present,
        "aws_region": config.aws_region,
        "azure_speech_region": config.azure_speech_region,
        "secrets_policy": "API keys must be stored in environment variables only. Never commit keys to GitHub.",
    }


@router.post("/transcript")
def transcript_from_text(payload: TranscriptRequest):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty")
    return normalize_text_transcript(text=payload.text, language=payload.language)


@router.post("/transcribe-audio")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("en-IN"),
):
    config = get_provider_config()
    if config.speech_provider != "deepgram":
        raise HTTPException(status_code=400, detail="Only Deepgram audio transcription is implemented in this build. Set SPEECH_PROVIDER=deepgram.")

    audio_bytes = await file.read()
    try:
        result = await transcribe_deepgram_audio(
            audio_bytes=audio_bytes,
            content_type=file.content_type or "application/octet-stream",
            api_key=config.deepgram_api_key,
            model=config.speech_model,
            language=language,
        )
    except SpeechProviderError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return result
