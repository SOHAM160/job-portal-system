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

  // Check token on mount
  useEffect(() => {
    checkAuth();
  }, []);

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

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    if (data.success) setUser(data.user);
    return data;
  };

  const login = async (formData) => {
    const { data } = await loginUser(formData);
    if (data.success) setUser(data.user);
    return data;
  };

  const loginWithGoogle = async (tokenId) => {
    const { data } = await googleLoginUser(tokenId);
    if (data.success) setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
