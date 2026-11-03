# Quiz Marks Projector - AI Agent Guidelines

## 1. Firebase Project Restrictions
*   **Project ID:** `inter-level-progress-manager`
*   **Web App ID:** `1:379503088311:web:136ac6e7bec46d29133332`
*   **Target Hosting Site:** `quiz-marks-projector`
*   **Canonical AppKey:** `quizMarksProjector`

## 2. Shared Environment Safety
*   **NO DIRECT RULE DEPLOYMENTS:** Never deploy Firestore or Storage rules from this repository. The canonical rules reside in the external `school-softwares-firebase-shared-config` repository.
*   **STRICT NAMESPACING:** All Firestore data belonging to this application MUST exist under `/apps/quizMarksProjector/users/{uid}/...`. DO NOT create data at the root of the database.
*   **SCOPED DEPLOYMENTS ONLY:** Always use scoped deployment commands.
    *   Hosting: `firebase deploy --only hosting:quiz-marks-projector`
    *   Functions: `firebase deploy --only functions:quizMarksRedeemAccessCode,functions:quizMarksSubmitScore`
    *   *Never* run an unscoped `firebase deploy`.

## 3. Technology Stack & Commands
*   React, Vite, TypeScript, Tailwind CSS, shadcn/ui.
*   `npm run build`: Type-checks and builds the Vite output into `dist/`.
*   `npm run test`: Runs the Vitest suite.

## 4. Invigilator Architecture
*   Invigilators authenticate via Firebase Anonymous Auth.
*   Authorization is handled server-side by Cloud Functions checking `/apps/quizMarksProjector/activeCodes/...` and granting `invigilatorSessions`.
*   Score mutations happen exclusively via the `quizMarksSubmitScore` Cloud Function.
