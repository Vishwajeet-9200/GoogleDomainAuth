# GoogleDomainAuth

Google Authentication application built using Expo, React Native, Firebase Authentication, and Node.js.

The application restricts access to users with official `@hbplus.fit` email addresses.

## Features

- Google Sign-In authentication.
- Firebase Authentication integration.
- Restricted access to `@hbplus.fit` email accounts.
- Backend token verification using Firebase Admin SDK.
- Protected dashboard.
- Logout functionality.
- Loading and error handling.
- Web and native Android authentication implementation.

## Tech Stack

**Frontend**

- React Native
- Expo
- TypeScript
- Firebase Authentication
- Google Sign-In

**Backend**

- Node.js
- Express.js
- Firebase Admin SDK

## Project Structure

```text
GoogleDomainAuth/
├── backend/
│   ├── package.json
│   └── server.js
├── src/
│   ├── app/
│   │   ├── firebase/
│   │   │   └── config.js
│   │   ├── index.tsx
│   │   └── _layout.tsx
│   └── components/
├── app.json
├── package.json
└── README.md
```

## Authentication Flow

1. User clicks Continue with Google.
2. Google authentication is performed.
3. Firebase authenticates the user.
4. The application checks whether the email ends with `@hbplus.fit`.
5. Firebase generates an ID token.
6. The token is sent to the Node.js backend.
7. Firebase Admin verifies the token.
8. The backend checks the email domain and verification status.
9. Authorized users can access the dashboard.

## Domain Restriction

Only verified accounts belonging to the following domain are allowed:

`@hbplus.fit`

The domain is checked on both the frontend and backend to prevent unauthorized access.

## Backend API

**Protected Dashboard Endpoint**

`GET /api/dashboard`

Authentication header:

`Authorization: Bearer <Firebase_ID_Token>`

The backend verifies the Firebase ID token and returns dashboard information for authorized users.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Vishwajeet-9200/GoogleDomainAuth.git
cd GoogleDomainAuth
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure Firebase

Configure your Firebase project in:

`src/app/firebase/config.js`

Enable Google Authentication in Firebase Console.

For Android, configure the Android app and Google Sign-In credentials in Firebase.

### 4. Configure Backend

Go to Firebase Console and generate a Firebase Admin service account key.

Save the downloaded file as:

`backend/serviceAccountKey.json`

**Important:** Never upload this private service account key to GitHub.

Install backend dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
node server.js
```

The backend runs on port `5000`.

### 5. Start the frontend

From the project root:

```bash
npx expo start
```

For web:

```bash
npx expo start --web
```

## Security

- Firebase ID token verification on the backend.
- Email domain validation.
- Verified email requirement.
- Private Firebase Admin credentials excluded from Git.

## Deployment

Deployment URL: Pending.

**Note:** The frontend currently calls the backend at `http://localhost:5000`. Before production deployment, this must be changed to the deployed backend URL.

## Author

Vishwajeet Yadav
