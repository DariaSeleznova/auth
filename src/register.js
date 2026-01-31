import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { auth } from "./firebase.js";

export async function registerFlow(email, password, nickname) {
    const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
        displayName: nickname
    });

    return userCredential.user;
}
