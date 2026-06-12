# API Integrations

RoleFit AI keeps external provider wiring isolated behind `/integrations` APIs and service abstractions.

## Current endpoints

### `GET /integrations/status`

Returns configured AI and speech provider settings without exposing secret values.

### `POST /integrations/transcript`

Accepts transcript text and returns the normalized transcript response contract used by the interview studio.

```json
{
  "text": "Candidate interview transcript text",
  "language": "en-IN"
}
```

## Environment variables

```bash
AI_PROVIDER=mock
AI_MODEL=local-rolefit-evaluator-v1
OPENAI_API_KEY=

SPEECH_PROVIDER=mock
SPEECH_MODEL=mock-transcriber-v1
DEEPGRAM_API_KEY=
AWS_REGION=ap-south-1
AZURE_SPEECH_REGION=centralindia
AZURE_SPEECH_KEY=
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
```

## Production plan

1. Keep `mock` for local development.
2. Set `SPEECH_PROVIDER` to the selected vendor.
3. Add the secret key only in server environment variables.
4. Replace the mock body inside `backend/app/services/speech_service.py` with the selected vendor client.
5. Keep the output contract unchanged so frontend and review APIs do not break.

## Security rules

- Never commit API keys.
- Never expose secret values through `/integrations/status`.
- Store vendor request/response logs only if candidate consent and data retention policy allow it.
- The voice/interview workflow should evaluate transcript content only and keep final employment action approval-gated.
