import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import create from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (val: boolean) => void;
}

const provider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  token: null,
  setLoading: (val) => set({ loading: val }),
  setUser: (user) => set({ user }),
  login: () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        set({ user, token: token || null });
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log({ errorCode, errorMessage, email, credential });
        // ...
      });
  },
  logout: () => {
    signOut(auth);
    set({ user: null });
  },
}));
