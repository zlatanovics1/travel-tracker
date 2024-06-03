import { createContext, useContext } from "react";
import { useState } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  function login(email, password) {
    if (FAKE_USER.email === email && FAKE_USER.password === password) {
      setUser(FAKE_USER);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid email or password!");
    }
  }
  function logout() {
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, error, login, logout, useAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Access is denied outside of AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
