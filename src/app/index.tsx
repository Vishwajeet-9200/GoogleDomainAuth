



import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithCredential,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase/config";


if (Platform.OS !== "web") {
  GoogleSignin.configure({
    webClientId: "513461596826-6tva47kmp04n07gn1e4epc48a45k1mlj.apps.googleusercontent.com",
  });
}


const ALLOWED_DOMAIN = "@hbplus.fit";

const isAllowedEmail = (email: string | null) => {
  return email?.toLowerCase().endsWith(ALLOWED_DOMAIN) ?? false;
};

export default function LoginScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check existing login session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !isAllowedEmail(currentUser.email)) {
        await signOut(auth);
        setUser(null);
      } else {
        setUser(currentUser);
      }

      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      console.log("Google Login Button Clicked");

      setLoading(true);
      setError("");

      let result;

      if (Platform.OS === "web") {
        // Web Google Login
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({
          prompt: "select_account",
        });

        result = await signInWithPopup(auth, provider);
      } else {
        // Android Native Google Login
        await GoogleSignin.hasPlayServices();

        const response = await GoogleSignin.signIn();

        if (response.type !== "success") {
          setError("Google Sign-In cancelled.");
          return;
        }

        const idToken = response.data.idToken;

        if (!idToken) {
          throw new Error("Google ID Token not received.");
        }

        const credential = GoogleAuthProvider.credential(idToken);

        result = await signInWithCredential(auth, credential);
      }

      const email = result.user.email;

      // Check Official HB+ Domain
      if (!isAllowedEmail(email)) {
        await signOut(auth);

        if (Platform.OS !== "web") {
          await GoogleSignin.signOut();
        }

        setUser(null);
        setError(
          "Access is restricted to official HB+ email accounts only."
        );
        return;
      }

      // Get Firebase ID Token
      const idToken = await result.user.getIdToken();

      // Backend Authentication
      const response = await fetch(
        "http://localhost:5000/api/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Backend Status:", response.status);
      console.log("Backend Data:", data);

      if (!response.ok) {
        await signOut(auth);
        setUser(null);
        setError(data.message || "Authentication failed");
        return;
      }

      setUser(result.user);
      console.log("Login Successful:", email);

    } catch (error: any) {
      console.log("Login Error:", error.code, error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setError("");
    } catch (error: any) {
      console.log("Logout Error:", error.message);
      setError(error.message);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.subtitle}>Checking login...</Text>
      </View>
    );
  }

  // Dashboard after successful login
  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome to HB Plus!</Text>

          <Text style={styles.subtitle}>{user.displayName}</Text>

          <Text style={styles.email}>{user.email}</Text>

          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Login Screen
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>HB+</Text>
        </View>

        <Text style={styles.heading}>Welcome Back!</Text>

        <Text style={styles.subtitle}>Sign in to continue to HB Plus</Text>

        <Pressable
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2563eb" />
          ) : (
            <Text style={styles.buttonText}>G Continue with Google</Text>
          )}
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Sign in securely using your Google account.
          </Text>
        </View>

        <Text style={styles.footer}>Secure Authentication by HB Plus</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    padding: 35,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },

  logo: {
    width: 75,
    height: 75,
    backgroundColor: "#2563eb",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  logoText: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "bold",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 10,
    marginBottom: 30,
  },

  googleButton: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },

  infoBox: {
    marginTop: 25,
    backgroundColor: "#eff6ff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  infoText: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
  },

  footer: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 30,
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
  },

  email: {
    color: "#64748b",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },
});
