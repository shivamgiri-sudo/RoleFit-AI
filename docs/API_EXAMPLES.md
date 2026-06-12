# API Examples

## Create demo role

```bash
curl -X POST http://localhost:8000/jobs \
  -H 'Content-Type: application/json' \
  -d '{
    "organization_name":"Demo Company",
    "branch_name":"Noida Branch",
    "title":"Operations Manager",
    "department":"Operations",
    "level":"Manager",
    "education_required":"Graduate",
    "experience_min_years":5,
    "mandatory_skills":"SLA management, team leadership, client handling, reporting, root cause analysis",
    "role_expectations":"Own daily operations, SLA, quality, productivity, people performance and client escalations."
  }'
```

## Candidate apply

```bash
curl -X POST http://localhost:8000/candidates/apply/1 \
  -H 'Content-Type: application/json' \
  -d '{
    "full_name":"Amit Sharma",
    "email":"amit@example.com",
    "phone":"9999999999",
    "location":"Noida",
    "education":"Graduate",
    "years_experience":6,
    "current_role":"Assistant Operations Manager",
    "source":"Career Page"
  }'
```

## Submit assessment

```bash
curl -X POST http://localhost:8000/assessments/1/submit \
  -H 'Content-Type: application/json' \
  -d '{
    "answers":[
      {"question_id":1,"answer_text":"I will own the SLA miss, check data, identify root cause, create a recovery plan, align team leaders, communicate to the client, and prevent repeat failure through review tracker."},
      {"question_id":2,"answer_text":"I will prioritize daily reviews, coaching closure, client escalation, and team communication with a clear tracker and end of day summary."},
      {"question_id":9,"answer_text":"I see myself owning SLA, quality, productivity and people performance. In the first 90 days I will stabilize review rhythm, improve reporting accuracy, reduce escalations and build team leader accountability."}
    ]
  }'
```
