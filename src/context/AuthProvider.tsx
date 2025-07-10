import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && !token) {
      setToken(storedToken);
    }

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Invalid user data in localStorage.");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const setUserState = (user: AuthContextType["user"]) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const login = (
    jwt: string,
    user: { id: string; name: string; email: string; role: "USER" | "ADMIN" }
  ) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(jwt);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser: setUserState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
