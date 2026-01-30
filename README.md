# 🏠 BoardingMate - Smart Boarding Management System

BoardingMate is a modern, cross-platform mobile application designed to simplify property management for boarding house owners (landlords). It moves away from traditional room-centric management to a **tenant-centric approach**, allowing for precise tracking of shared rooms, individual rent payments, and utility bill distribution.

---

## ✨ Key Features

- **User Authentication:** Secure sign-up and login for landlords using Firebase Authentication.
- **Tenant Management (CRUD):** 
  - **Create:** Easily onboard new tenants with room assignments and key money details.
  - **Read:** A real-time dashboard to view all active residents and their payment status.
  - **Update:** Modify tenant details or mark monthly rent as paid.
  - **Delete:** Remove tenant records when they depart.
- **Smart Bill Splitter (Business Logic):** landlords can input total electricity and water bills for a specific room, and the app automatically calculates and distributes the share among the tenants of that room.
- **Automated Monthly Status:** The app logic automatically resets payment status to "Unpaid" at the start of each new calendar month.
- **Premium UI/UX:** Built with a minimalist "Coral Red" theme, utilizing soft glow shadows and responsive layouts for a high-end feel.

---

## 📸 App Screenshots

| Dashboard | Tenant List | Bill Splitter |
|:---:|:---:|:---:|
| <img src="screenshots/home.png" width="200" /> | <img src="screenshots/list.png" width="200" /> | <img src="screenshots/bills.png" width="200" /> |

| Tenant Profile | Register | Login |
|:---:|:---:|:---:|
| <img src="screenshots/profile.png" width="200" /> | <img src="screenshots/register.png" width="200" /> | <img src="screenshots/login.png" width="200" /> |

---

## 🚀 Tech Stack

- **Frontend:** React Native (Expo Go)
- **Backend:** Firebase Firestore & Firebase Auth
- **Navigation:** Expo Router (Stack & Tab Navigation)
- **State Management:** React Context API & Custom Hooks
- **Language:** TypeScript
- **Styling:** React Native StyleSheet (for precision and performance)

---

## ⚙️ Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

  ```bash
  git clone https://github.com/Lahiru075/BoardingMate.git
  cd BoardingMate
  ```
2. **Install dependencies:**
   
  ```bash
  npm install
  ```

3. **Configure Environment Variables:**

Create a `.env` file in the **root directory** and add your Firebase credentials  (make sure they are prefixed with `EXPO_PUBLIC_`):
Note: Do not push your .env file to version control.

  ```Env
  EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
  ```

4. **Start the development server:**

  ```bash
  npx expo start
  ```

5. **Run on Device:**
Scan the QR code using the Expo Go app on Android or iOS.

---

## 📱 Mobile Build (APK)

The Android APK build for this project can be found at the following link:

🔗 **[Download BoardingMate APK (Google Drive)](https://drive.google.com/file/d/1Vco7QdBANY1EYg8V3B2YoFVfQLMTGUcF/view?usp=sharing)**

> ℹ️ Note: You can also find the `.apk` file inside the **BoardingMate** folder on Google Drive or inside the `build` folder of this repository (if uploaded).

---

## 👨‍💻 Developer Details
**Name:** Lahiru Lakshan Sanjeewa

**Institute:** Institute of Software Engineering (IJSE)
