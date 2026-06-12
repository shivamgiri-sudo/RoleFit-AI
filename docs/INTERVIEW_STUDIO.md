# Interview Studio

The Interview Studio adds a premium product layer for guided interview sessions.

## Current implementation

- Backend session API
- Role-linked question plan
- Consent statement storage
- Transcript submission endpoint
- Content evidence summary
- Risk flag summary
- Review recommendation
- Modern frontend concept page at `/voice-interview`

## Production integration plan

1. Connect a speech-to-text provider.
2. Capture consent before starting the session.
3. Read questions aloud from the role question plan.
4. Store transcript text.
5. Send transcript text to the backend review endpoint.
6. Keep final action in the existing approval workflow.

## Guardrails

The studio is for structured evidence review. It must not score biometric, demographic, or unrelated personal attributes. Final action stays approval-gated and auditable.
