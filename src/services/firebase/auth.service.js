import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { addDocument, getDocument, updateDocument } from "./firestore.service";
import logger from "../logger/logger.service";

export const registerWithEmail = async ({
  email,
  password,
  displayName,
  role = "user",
  phoneNumber,
  dateOfBirth,
  gender,
  bloodGroup
}) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await sendEmailVerification(cred.user);
  await addDocument("users", {
    uid: cred.user.uid,
    email,
    displayName,
    role,
    phoneNumber,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    gender,
    bloodGroup,
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }, cred.user.uid);
  logger.info("AuthService", "REGISTER_EMAIL", { uid: cred.user.uid, email });
  return cred.user;
};

export const loginWithEmail = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getDocument("users", cred.user.uid);
  if (!cred.user.emailVerified) {
    throw new Error("Email not verified. Please verify your email.");
  }
  await updateDocument("users", cred.user.uid, { lastLogin: new Date(), isEmailVerified: cred.user.emailVerified });
  logger.info("AuthService", "LOGIN_EMAIL", { uid: cred.user.uid, email });
  return { ...cred.user, ...profile };
};

export const loginWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  const profile = await getDocument("users", cred.user.uid);
  if (!profile) {
    const newProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: cred.user.emailVerified
    };
    await addDocument("users", newProfile, cred.user.uid);
    logger.info("AuthService", "LOGIN_GOOGLE_CREATE_PROFILE", { uid: cred.user.uid, role: newProfile.role });
  } else {
    await updateDocument("users", cred.user.uid, { lastLogin: new Date() });
    logger.info("AuthService", "LOGIN_GOOGLE_PROFILE_FOUND", { uid: cred.user.uid, role: profile.role });
  }
  logger.info("AuthService", "LOGIN_GOOGLE", { uid: cred.user.uid, email: cred.user.email });
  return { ...cred.user, ...profile };
};

export const sendVerificationEmail = async () => {
  if (!auth.currentUser) return;
  await sendEmailVerification(auth.currentUser);
  logger.info("AuthService", "SEND_VERIFICATION", { uid: auth.currentUser.uid });
};

export const sendResetPassword = async email => {
  await sendPasswordResetEmail(auth, email);
  logger.info("AuthService", "RESET_PASSWORD", { email });
};

export const logout = async () => {
  await signOut(auth);
  logger.info("AuthService", "LOGOUT", {});
};

export default {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  sendVerificationEmail,
  sendResetPassword,
  logout
};
