import { signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

export async function logoutFlow() {
    await signOut(auth);
}
