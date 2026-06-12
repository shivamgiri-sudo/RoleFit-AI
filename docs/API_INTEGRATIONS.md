# API Integrations

RoleFit AI now includes real provider adapters for interview audio transcription and structured transcript evaluation.

## Implemented providers

- Speech-to-text: Deepgram prerecorded audio API
- Structured transcript evaluation: OpenAI Chat Completions with JSON schema output

## Endpoints

### `GET /integrations/status`

Returns configured AI and speech provider settings without exposing secret values.

### `POST /integrations/transcript`

Accepts already-prepared transcript text and returns a normalized transcript object.

```json
{
  "text": "Candidate interview transcript text",
  "language": "en-IN"
}
```

### `POST /integrations/transcribe-audio`

Uploads real audio and sends it to Deepgram.

```bash
curl -X POST http://localhost:8000/integrations/transcribe-audio \
  -F "file=@candidate-interview.wav" \
  -F "language=en-IN"
```

### `POST /voice-interviews/{session_id}/submit`

Submits transcript text to the OpenAI structured evaluator. The response is schema-based and includes:

- content_score
- trait_signal_score
- role_alignment_score
- evidence_summary
- risk_flags
- recommendation
- confidence

## Environment variables

```bash
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=

SPEECH_PROVIDER=deepgram
SPEECH_MODEL=nova-3
DEEPGRAM_API_KEY=
```

## Local setup

1. Copy `.env.example` to `.env`.
2. Add `OPENAI_API_KEY` and `DEEPGRAM_API_KEY` in your local/server environment.
3. Restart FastAPI.
4. Check `GET /integrations/status`.
5. Upload audio through `POST /integrations/transcribe-audio`.
6. Submit the transcript through `POST /voice-interviews/{session_id}/submit`.

## Security rules

- Never commit API keys.
- Never expose secret values through `/integrations/status`.
- Store vendor request/response logs only if candidate consent and data retention policy allow it.
- The interview workflow evaluates transcript content only and keeps final employment action approval-gated.
