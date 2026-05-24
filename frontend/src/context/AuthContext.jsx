import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser, registerUser, googleLoginUser } from "../api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await getMe();
      if (data.success) setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check token on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    if (data.success) setUser(data.user);
    return data;
  };

  const refreshUser = async () => {
    try {
      const { data } = await getMe();
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Token invalid, logging out");
      setUser(null);
    }
  };

  const login = async (formData) => {
    const { data } = await loginUser(formData);
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const loginWithGoogle = async (tokenId, role) => {
    const { data } = await googleLoginUser(tokenId, role);
    if (data.success) setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
