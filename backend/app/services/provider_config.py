import os
from dataclasses import dataclass


@dataclass(frozen=True)
class ProviderConfig:
    ai_provider: str
    ai_model: str
    speech_provider: str
    speech_model: str
    deepgram_api_key: str | None
    openai_api_key: str | None
    deepgram_api_key_present: bool
    openai_api_key_present: bool
    aws_region: str | None
    azure_speech_region: str | None


def get_provider_config() -> ProviderConfig:
    deepgram_key = os.getenv("DEEPGRAM_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    return ProviderConfig(
        ai_provider=os.getenv("AI_PROVIDER", "openai"),
        ai_model=os.getenv("AI_MODEL", "gpt-4o-mini"),
        speech_provider=os.getenv("SPEECH_PROVIDER", "deepgram"),
        speech_model=os.getenv("SPEECH_MODEL", "nova-3"),
        deepgram_api_key=deepgram_key,
        openai_api_key=openai_key,
        deepgram_api_key_present=bool(deepgram_key),
        openai_api_key_present=bool(openai_key),
        aws_region=os.getenv("AWS_REGION"),
        azure_speech_region=os.getenv("AZURE_SPEECH_REGION"),
    )
