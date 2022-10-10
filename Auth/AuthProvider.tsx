import { useAuthStore } from "Auth";
import { useEffect } from "react";
import { auth } from "../firebase";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [setUser, setLoading] = useAuthStore((state) => [
    state.setUser,
    state.setLoading,
  ]);

  // Fetch user anime list from firebase
  useEffect(() => {
    setLoading(true);
    let unSub = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      unSub();
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
