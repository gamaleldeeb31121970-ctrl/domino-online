// players.js
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * إضافة لاعب جديد
 */
export async function addPlayer(name) {
  try {
    const docRef = await addDoc(collection(db, "players"), {
      name: name,
      score: 0,
      createdAt: new Date()
    });
    console.log("تم إضافة اللاعب مع ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("خطأ في إضافة اللاعب:", e);
  }
}

/**
 * تحديث نقاط لاعب
 */
export async function updateScore(playerId, newScore) {
  try {
    const playerRef = doc(db, "players", playerId);
    await updateDoc(playerRef, { score: newScore });
    console.log("تم تحديث النقاط للاعب:", playerId);
  } catch (e) {
    console.error("خطأ في تحديث النقاط:", e);
  }
}

/**
 * جلب قائمة اللاعبين
 */
export async function getPlayers() {
  try {
    const q = query(collection(db, "players"), orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);
    const players = [];
    querySnapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });
    return players;
  } catch (e) {
    console.error("خطأ في جلب اللاعبين:", e);
    return [];
  }
}
