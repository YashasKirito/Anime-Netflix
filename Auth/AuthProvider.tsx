import { useAuthStore } from "Auth";
import { useEffect } from "react";
import { auth } from "../firebase";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [setUser] = useAuthStore((state) => [state.setUser]);

  // Fetch user anime list from firebase
  useEffect(() => {
    let unSub = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unSub();
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
