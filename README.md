# Quiz Marks Projector

Real-Time Quiz Competition Management and Animated Live Leaderboard.

## Overview
A web application to conduct academic quiz competitions. It provides an administrative dashboard, a simple mobile-friendly scoring interface for invigilators, and a beautifully animated real-time projector view of the leaderboard.

## Development Setup
1. `npm install`
2. `npm run dev`

## Technologies Used
- React (Vite)
- TypeScript
- Tailwind CSS & shadcn/ui
- Framer Motion (for animations)
- Firebase (Auth, Firestore, Functions, Hosting)

## Security Architecture
This application shares the `inter-level-progress-manager` Firebase project with other educational tools. To ensure isolation and safety:
- **Canonical AppKey:** `quizMarksProjector`
- **Data Path:** All application data is strictly nested under `/apps/quizMarksProjector/users/{uid}/...`
- **Rules:** Firestore and Storage rules are maintained externally in the `school-softwares-firebase-shared-config` repository.
- **Invigilator Access:** Handled securely via Firebase Anonymous Auth combined with server-side access code validation and Cloud Functions for scoring.

## Developer Credit
Developed by Jeevan Varghese (HSST Jr. Botany, St. Gemma's Girls' HSS, Malappuram).
Visit [itsjeevanvarghese.web.app](https://itsjeevanvarghese.web.app) for more softwares.
