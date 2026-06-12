# Production Completion Scope

This document converts the final user decisions into a production build checklist.

## Final decisions

- Product: RoleFit AI
- Customers: All companies
- First role: Operations Manager
- Required roles: Operations Manager, Team Leader, Quality Manager, Quality Analyst, Recruiter, HR Telecaller, Sales Executive, Customer Support Executive, Backend Verification Analyst, Trainer
- Flow: AI recommendation plus human approval
- Pricing: Per user
- Database: MySQL
- Hosting: Own domain
- Assessments: All enabled
- Communication: All enabled
- Branding: Company-wise logo and branding required

## Database and hosting

### Required

- MySQL production database
- Own domain
- Backend API deployment
- Frontend deployment
- SSL certificate
- Environment variable based configuration
- Backup and restore plan

### MySQL connection format

```bash
DATABASE_URL=mysql+pymysql://rolefit_user:password@host:3306/rolefit_ai
```

## Assessment modules required

1. Resume parsing
2. Eligibility screening
3. MCQ screening
4. Skill assessment
5. Scenario-based questions
6. Voice interview transcript assessment
7. Typing test
8. Communication test
9. Case study
10. Role alignment question
11. Structured interviewer/reviewer scorecard
12. Final Role Fit Report

## Communication modules required

1. Email
2. SMS
3. WhatsApp
4. Calendar scheduling
5. Candidate portal status update
6. Recruiter reminders
7. Hiring manager approval reminders
8. Offer/onboarding notifications

## Branding requirements

Each company tenant must be able to configure:

- Company logo
- Company name
- Primary brand color
- Secondary brand color
- Career page branding
- Email sender display name
- Candidate portal branding

## Required API keys and secrets

Do not commit secrets to GitHub. Store these only in server environment variables.

```bash
OPENAI_API_KEY=
DEEPGRAM_API_KEY=
DATABASE_URL=
JWT_SECRET=
EMAIL_SMTP_HOST=
EMAIL_SMTP_USER=
EMAIL_SMTP_PASSWORD=
SMS_PROVIDER_KEY=
WHATSAPP_PROVIDER_TOKEN=
CALENDAR_CLIENT_ID=
CALENDAR_CLIENT_SECRET=
```

## Phase 1: Production core

1. MySQL database support
2. Authentication and user roles
3. Tenant data isolation
4. Company branding table and logo upload
5. User management
6. Per-user plan and subscription limits

## Phase 2: Hiring flow completion

1. Job creation UI to backend wiring
2. Candidate application UI to backend wiring
3. Resume upload and parsing
4. Assessment submit flow
5. Voice/audio upload flow
6. Role Fit Report generation
7. Human approval action flow

## Phase 3: Communication and scheduling

1. Email provider
2. SMS provider
3. WhatsApp provider
4. Calendar integration
5. Reminder engine
6. Candidate status portal updates

## Phase 4: Company branding and public pages

1. Company logo upload
2. Tenant career page branding
3. Candidate portal branding
4. Email template branding
5. Public job URL per company/domain

## Phase 5: Production release

1. Security review
2. API rate limiting
3. File upload validation
4. Full QA/UAT
5. CI/CD
6. SSL/domain setup
7. Monitoring and logs
8. Backup automation
