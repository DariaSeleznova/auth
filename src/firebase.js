import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===== Firebase init =====

const firebaseConfig = {
    apiKey: "AIzaSyC9Ejlk3J2NOIFt5BPqbXacQsgsyNFOQK4",
    authDomain: "check-login-3cc1e.firebaseapp.com",
    projectId: "check-login-3cc1e",
    appId: "1:462585092834:web:8656b30ab8ac667a165cbb"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ===== Nickname helpers =====

function normalizeNickname(nickname) {
    return nickname.trim().toLowerCase();
}

// Проверка занятости никнейма
export async function isNicknameInUse(nickname) {
    const key = normalizeNickname(nickname);
    const ref = doc(db, "nicknames", key);
    const snap = await getDoc(ref);
    return snap.exists();
}

// Создание / обновление никнейма
export async function updateNickname(uid, oldName, newName) {
    const newKey = normalizeNickname(newName);

    if (oldName) {
        const oldKey = normalizeNickname(oldName);
        await deleteDoc(doc(db, "nicknames", oldKey));
    }

    await setDoc(doc(db, "nicknames", newKey), { uid });
}

export async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}
