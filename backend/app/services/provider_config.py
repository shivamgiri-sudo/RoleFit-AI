import os
from dataclasses import dataclass


@dataclass(frozen=True)
class ProviderConfig:
    ai_provider: str
    ai_model: str
    speech_provider: str
    speech_model: str
    deepgram_api_key_present: bool
    openai_api_key_present: bool
    aws_region: str | None
    azure_speech_region: str | None


def get_provider_config() -> ProviderConfig:
    return ProviderConfig(
        ai_provider=os.getenv("AI_PROVIDER", "mock"),
        ai_model=os.getenv("AI_MODEL", "local-rolefit-evaluator-v1"),
        speech_provider=os.getenv("SPEECH_PROVIDER", "mock"),
        speech_model=os.getenv("SPEECH_MODEL", "mock-transcriber-v1"),
        deepgram_api_key_present=bool(os.getenv("DEEPGRAM_API_KEY")),
        openai_api_key_present=bool(os.getenv("OPENAI_API_KEY")),
        aws_region=os.getenv("AWS_REGION"),
        azure_speech_region=os.getenv("AZURE_SPEECH_REGION"),
    )
