import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session state and JWT token fallback
  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem("access-token");

      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else if (token) {
        try {
          const res = await fetch(`${API_URL}/api/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const profile = await res.json();
            setUser({
              id: profile._id || profile.id,
              ...profile
            });
          } else {
            localStorage.removeItem("access-token");
            setUser(null);
          }
        } catch (err) {
          console.error("JWT profile sync failed:", err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        if (!sessionLoading) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    syncAuth();
  }, [session, sessionLoading]);

  // Sync access token if Better Auth session works
  useEffect(() => {
    if (session?.user) {
      const fetchToken = async () => {
        try {
          const res = await fetch(`${API_URL}/api/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.token) {
              localStorage.setItem("access-token", data.token);
            }
          }
        } catch (err) {
          console.error("JWT sync failed:", err);
        }
      };
      fetchToken();
    } else if (!sessionLoading && !localStorage.getItem("access-token")) {
      localStorage.removeItem("access-token");
    }
  }, [session, sessionLoading]);

  // Register helper
  const register = async ({ email, password, name, avatar, bloodGroup, district, upazila }) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      bloodGroup,
      district,
      upazila,
      avatar,
      role: "donor",
      status: "active",
    });

    if (error) throw new Error(error.message || "Registration failed");

    setLoading(true);

    let token = "";
    try {
      const res = await fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const jwtData = await res.json();
        if (jwtData.token) {
          token = jwtData.token;
          localStorage.setItem("access-token", token);
        }
      }
    } catch (err) {
      console.error("JWT fetch failed on registration:", err);
    }

    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const profile = await res.json();
          setUser({
            id: profile._id || profile.id,
            ...profile
          });
        }
      } catch (err) {
        console.error("Profile fetch failed on registration:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return data;
  };

  // Login helper
  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("invalid") || error.status === 401) {
        throw new Error("Invalid email or password");
      }
      throw new Error(error.message || "Login failed");
    }

    setLoading(true);

    let token = "";
    try {
      const res = await fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const jwtData = await res.json();
        if (jwtData.token) {
          token = jwtData.token;
          localStorage.setItem("access-token", token);
        }
      }
    } catch (err) {
      console.error("JWT fetch failed on login:", err);
    }

    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile.status === "blocked") {
            await authClient.signOut();
            localStorage.removeItem("access-token");
            setUser(null);
            throw new Error("Your account has been blocked. Contact support.");
          }
          setUser({
            id: profile._id || profile.id,
            ...profile
          });
        }
      } catch (err) {
        if (err.message?.includes("blocked")) throw err;
        console.error("Profile fetch failed on login:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return data;
  };

  // Logout helper
  const logout = async () => {
    await authClient.signOut();
    localStorage.removeItem("access-token");
    setUser(null);
  };

  // Sync state after update
  const updateUser = async () => {
    await refetch();
    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const profile = await res.json();
          setUser({
            id: profile._id || profile.id,
            ...profile
          });
        }
      } catch (err) {
        console.error("Failed to update user profile:", err);
      }
    }
  };


  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAdmin:     user?.role === "admin",
    isVolunteer: user?.role === "volunteer",
    isDonor:     user?.role === "donor",
    isBlocked:   user?.status === "blocked",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
