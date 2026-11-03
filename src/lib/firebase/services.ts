import { collection, doc, getDoc, getDocs, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config";

const APP_KEY = "quizMarksProjector";

// Quiz Management Services
export const getQuizzes = async (uid: string) => {
  const quizzesRef = collection(db, `apps/${APP_KEY}/users/${uid}/quizzes`);
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getQuiz = async (uid: string, quizId: string) => {
  const quizRef = doc(db, `apps/${APP_KEY}/users/${uid}/quizzes/${quizId}`);
  const snapshot = await getDoc(quizRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const createQuiz = async (uid: string, quizData: any) => {
  const newQuizRef = doc(collection(db, `apps/${APP_KEY}/users/${uid}/quizzes`));
  await setDoc(newQuizRef, {
    ...quizData,
    createdAt: new Date(),
    status: "Draft",
  });
  return newQuizRef.id;
};

// Team Management Services
export const getTeams = async (uid: string, quizId: string) => {
  const teamsRef = collection(db, `apps/${APP_KEY}/users/${uid}/quizzes/${quizId}/teams`);
  const snapshot = await getDocs(teamsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTeam = async (uid: string, quizId: string, teamData: any) => {
  const teamRef = doc(collection(db, `apps/${APP_KEY}/users/${uid}/quizzes/${quizId}/teams`));
  await setDoc(teamRef, teamData);
  // Also initialize leaderboard entry
  const leaderboardRef = doc(db, `apps/${APP_KEY}/users/${uid}/quizzes/${quizId}/leaderboard/${teamRef.id}`);
  await setDoc(leaderboardRef, {
    name: teamData.name,
    color: teamData.color || "#3B82F6",
    totalScore: 0
  });
  return teamRef.id;
};

// Question Management Services
export const getQuestions = async (uid: string, quizId: string) => {
  const questionsRef = collection(db, `apps/${APP_KEY}/users/${uid}/quizzes/${quizId}/questions`);
  const snapshot = await getDocs(questionsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addQuestion = async (uid: string, quizId: string, questionData: any) => {
  const qRef = doc(collection(db, `apps/${APP_KEY}/users/${uid}/quizzes/${quizId}/questions`));
  await setDoc(qRef, questionData);
  return qRef.id;
};

// Leaderboard Subscription (Projector)
export const subscribeToLeaderboard = (ownerUid: string, quizId: string, callback: (teams: any[]) => void) => {
  const leaderboardRef = collection(db, `apps/${APP_KEY}/users/${ownerUid}/quizzes/${quizId}/leaderboard`);

  return onSnapshot(leaderboardRef, (snapshot) => {
    const teams = snapshot.docs.map(doc => ({ teamId: doc.id, ...doc.data() }));
    // Sort by score descending
    teams.sort((a: any, b: any) => (b.totalScore || 0) - (a.totalScore || 0));
    callback(teams);
  });
};
