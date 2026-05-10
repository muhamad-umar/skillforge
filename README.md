# SkillForge

AI-powered gamified learning platform — quests, XP, badges, classrooms and an AI mentor.

## Stack
HTML + CSS + JavaScript (Tailwind-inspired custom design system, no build step).

## Run locally
Open `frontend/landing/index.html` in your browser, **or** serve the project:

```bash
npx serve .
```

Then visit http://localhost:3000/frontend/landing/index.html.

## Structure
See the directory tree — pages are grouped by role (landing / auth / learner / instructor / admin) with shared CSS/JS in `frontend/shared/`.

## Demo flow
1. `frontend/landing/index.html` — Landing
2. `frontend/auth/signup.html` → `login.html` (any submit redirects to learner dashboard)
3. `frontend/learner/learner_dashboard.html` — full learner experience
4. `frontend/instructor/instructor_dashboard.html` — instructor view
5. `frontend/admin/admin_dashboard.html` — admin view

## Dummy Credentials
You can use the following test credentials to log in (roles are automatically handled based on email):

- **Learners**: `umar@gmail.com` or `zainab@gmail.com` / `password123`
- **Instructor**: `instructor@gmail.com` / `password123`
- **Admin**: `admin@gmail.com` / `password123`

*(Note: These are also stored in `backend/users.json` for reference.)*
