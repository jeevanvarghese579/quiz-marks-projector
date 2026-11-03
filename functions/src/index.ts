import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

const db = getFirestore();
const APP_KEY = "quizMarksProjector";

// Admin generates access codes
export const quizMarksCreateAccessCode = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Admin authentication required.");
  }
  const { quizId, code, teams, type, expiry } = request.data;
  if (!quizId || !code) {
    throw new functions.https.HttpsError("invalid-argument", "Missing quizId or code.");
  }

  const uid = request.auth.uid;
  const accessCodeRef = db.doc(`apps/${APP_KEY}/users/${uid}/quizzes/${quizId}/invigilatorAccess/${code}`);

  await accessCodeRef.set({
    code,
    teams: teams || "all", // "all" or array of teamIds
    type: type || "score", // "read-only" or "score"
    expiry: expiry || null,
    active: true,
    createdBy: uid,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { success: true };
});

// Invigilator logs in with code
export const quizMarksRedeemAccessCode = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Anonymous authentication required.");
  }

  const { code } = request.data;
  if (!code) {
    throw new functions.https.HttpsError("invalid-argument", "Missing access code.");
  }

  const codeMappingRef = db.doc(`apps/${APP_KEY}/activeCodes/${code}`);
  const codeMappingSnap = await codeMappingRef.get();

  if (!codeMappingSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Invalid or expired access code.");
  }

  const { ownerUid, quizId } = codeMappingSnap.data() as { ownerUid: string, quizId: string };

  const accessCodeRef = db.doc(`apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/invigilatorAccess/${code}`);
  const accessCodeSnap = await accessCodeRef.get();

  if (!accessCodeSnap.exists || !accessCodeSnap.data()?.active) {
    throw new functions.https.HttpsError("permission-denied", "Access code is inactive.");
  }

  const accessData = accessCodeSnap.data()!;
  if (accessData.expiry && accessData.expiry.toDate() < new Date()) {
    throw new functions.https.HttpsError("permission-denied", "Access code expired.");
  }

  const invigilatorUid = request.auth.uid;
  const sessionRef = db.doc(`apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/invigilatorSessions/${invigilatorUid}`);

  await sessionRef.set({
    invigilatorUid,
    code,
    teams: accessData.teams,
    type: accessData.type,
    createdAt: FieldValue.serverTimestamp(),
    active: true
  });

  return { success: true, ownerUid, quizId, teams: accessData.teams, type: accessData.type };
});

export const quizMarksSubmitScore = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const { ownerUid, quizId, teamId, questionId, score, status } = request.data;
  if (!ownerUid || !quizId || !teamId || !questionId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
  }

  const invigilatorUid = request.auth.uid;

  // Verify session
  const sessionRef = db.doc(`apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/invigilatorSessions/${invigilatorUid}`);
  const sessionSnap = await sessionRef.get();

  // If the user is the owner, they bypass invigilator checks
  const isOwner = request.auth.uid === ownerUid;

  let actorRole = "owner";
  if (!isOwner) {
    actorRole = "invigilator";
    if (!sessionSnap.exists || !sessionSnap.data()?.active) {
      throw new functions.https.HttpsError("permission-denied", "No active session.");
    }
    const session = sessionSnap.data()!;
    if (session.type !== "score") {
      throw new functions.https.HttpsError("permission-denied", "Session is read-only.");
    }
    if (session.teams !== "all" && (!Array.isArray(session.teams) || !session.teams.includes(teamId))) {
       throw new functions.https.HttpsError("permission-denied", "Not authorized for this team.");
    }
  }

  const scoreRef = db.doc(`apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/scores/${teamId}_${questionId}`);

  await db.runTransaction(async (transaction) => {
    const scoreSnap = await transaction.get(scoreRef);
    const previousScore = scoreSnap.exists ? scoreSnap.data()?.score : 0;
    const previousStatus = scoreSnap.exists ? scoreSnap.data()?.status : "unanswered";

    // Update score
    transaction.set(scoreRef, {
      teamId,
      questionId,
      score,
      status,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: request.auth?.uid
    }, { merge: true });

    // Log audit
    const logRef = db.collection(`apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/auditLogs`).doc();
    transaction.set(logRef, {
      teamId,
      questionId,
      previousScore,
      newScore: score,
      previousStatus,
      newStatus: status,
      actorUid: request.auth?.uid,
      actorRole,
      timestamp: FieldValue.serverTimestamp()
    });

    // Update team leaderboard total securely
    const teamLeaderboardRef = db.doc(`apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/leaderboard/${teamId}`);
    const teamLeaderboardSnap = await transaction.get(teamLeaderboardRef);

    const diff = score - (previousScore || 0);
    const currentTotal = teamLeaderboardSnap.exists ? (teamLeaderboardSnap.data()?.totalScore || 0) : 0;

    transaction.set(teamLeaderboardRef, {
      totalScore: currentTotal + diff,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  });

  return { success: true };
});
