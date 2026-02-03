# 🔐 Authentication Modal (Firebase Auth)

A lightweight authentication module with login, registration, and password recovery using Firebase Authentication and Firestore.

The project focuses on **clean architecture**, **UX-friendly validation**, and **realistic auth behavior** similar to production applications.

🔗 Live demo:  
https://dariaseleznova.github.io/auth/

---

## ✨ Features

- Login with email & password
- Registration with:
  - email
  - nickname (unique)
  - password + repeat password
- Password recovery via email
- Firebase Authentication
- Firestore for nickname uniqueness
- Session persistence
- Logout
- Password show / hide
- Inline validation & error messages
- Disabled buttons until form is valid
- Modal-based UI

---

## 🧠 Architecture Overview

The project is intentionally split into logical layers:

/src
├── ui.js # UI logic & DOM interactions
├── login.js # Login flow (Firebase Auth)
├── register.js # Registration flow
├── logout.js # Logout logic
├── validation.js # Pure validation helpers (no UI)
├── firebase.js # Firebase init & Firestore helpers


### Key principles:
- **UI logic is separated from business logic**
- **Validation is split into:**
  - silent checks (for button state)
  - UI checks (for error messages)
- **Firebase errors are handled securely** (no credential leakage)

---

## 🔐 Authentication Notes

Firebase intentionally returns a generic error (`auth/invalid-credential`) for login failures to prevent user enumeration attacks.

For this reason:
- frontend validation handles field-level feedback
- server errors are displayed as general auth errors

This mirrors real-world production behavior.

---

## 📦 Tech Stack

- HTML / CSS / Vanilla JavaScript (ES Modules)
- Firebase Authentication
- Firebase Firestore
- GitHub Pages

---

## 🚀 Getting Started (Local)

1. Clone the repository
2. Serve files via local server (required for ES modules)
3. Open http://localhost:3000

🛠️ Possible Improvements
Sync user data across devices

Editable user profile (nickname update)

Better UI animations

Accessibility improvements

Expense Tracker integration (planned)

👩‍💻 Author
Daria Seleznova

This project was built as a learning-focused but production-inspired authentication module, with attention to UX, architecture, and security best practices.

<img width="1801" height="801" alt="modal_login" src="https://github.com/user-attachments/assets/6690c9b2-da94-4e97-ac0c-acac8b8a66df" />
<img width="1793" height="800" alt="modal_register" src="https://github.com/user-attachments/assets/2580ae1f-85bb-4e63-a470-bb56ab496943" />
<img width="689" height="450" alt="user_panel" src="https://github.com/user-attachments/assets/f58961aa-3119-4eaa-b26a-0d4f0b06c2f7" />
<img width="548" height="298" alt="edit_profile" src="https://github.com/user-attachments/assets/2e968671-f208-4cc5-b3dd-80f71d047ce4" />
<img width="850" height="612" alt="errors_validations" src="https://github.com/user-attachments/assets/f334dee1-3c6a-45be-9de7-be4e0a1dc6a6" />
<img width="604" height="368" alt="errors_firebase" src="https://github.com/user-attachments/assets/69b26f59-be2c-4223-a819-d39702585397" />




