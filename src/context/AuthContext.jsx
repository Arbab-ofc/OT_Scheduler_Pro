import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase/config";
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  registerWithEmail,
  sendVerificationEmail
} from "../services/firebase/auth.service";
import { getDocument, subscribeToDocument, updateDocument } from "../services/firebase/firestore.service";
import logger from "../services/logger/logger.service";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  loginGoogle: async () => {},
  register: async () => {},
  logoutUser: async () => {},
  sendVerification: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile;
    const unsubscribeAuth = onAuthStateChanged(auth, async firebaseUser => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        setLoading(true);
        try {
          let initialProfileReceived = false;
          unsubscribeProfile = subscribeToDocument("users", firebaseUser.uid, async profile => {
            initialProfileReceived = true;
            if (profile && profile.role) {
              setUser({ ...firebaseUser, ...profile, emailVerified: firebaseUser.emailVerified });
              if (firebaseUser.emailVerified && profile.isEmailVerified !== true) {
                await updateDocument("users", firebaseUser.uid, { isEmailVerified: true });
              }
            } else if (profile) {
              setUser({ ...firebaseUser, ...profile, emailVerified: firebaseUser.emailVerified });
              if (firebaseUser.emailVerified && profile.isEmailVerified !== true) {
                await updateDocument("users", firebaseUser.uid, { isEmailVerified: true });
              }
            } else {
              const fetched = await getDocument("users", firebaseUser.uid);
              if (fetched) {
                setUser({ ...firebaseUser, ...fetched, emailVerified: firebaseUser.emailVerified });
                if (firebaseUser.emailVerified && fetched.isEmailVerified !== true) {
                  await updateDocument("users", firebaseUser.uid, { isEmailVerified: true });
                }
              }
            }
            setLoading(false);
          });
          setUser({ ...firebaseUser });
          setTimeout(() => {
            if (!initialProfileReceived) setLoading(false);
          }, 500);
          logger.info("AuthContext", "AUTH_STATE_CHANGED", { uid: firebaseUser.uid });
        } catch (error) {
          logger.error("AuthContext", "AUTH_FETCH_PROFILE_ERROR", error);
          setUser({ ...firebaseUser });
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email, password) => loginWithEmail(email, password),
      loginGoogle: async () => loginWithGoogle(),
      register: async payload => registerWithEmail(payload),
      logoutUser: async () => logout(),
      sendVerification: async () => sendVerificationEmail(),
      refreshUser: async () => {
        if (!auth.currentUser) return null;
        await auth.currentUser.reload();
        const profile = await getDocument("users", auth.currentUser.uid);
        if (auth.currentUser.emailVerified && profile?.isEmailVerified !== true) {
          await updateDocument("users", auth.currentUser.uid, { isEmailVerified: true });
        }
        setUser({ ...auth.currentUser, ...(profile || {}) });
        return { ...auth.currentUser, ...(profile || {}) };
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
