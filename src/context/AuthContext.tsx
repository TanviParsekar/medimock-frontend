import { createContext } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: AuthContextType["user"]) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
