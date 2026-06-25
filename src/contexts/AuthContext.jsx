import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Sync session state and JWT token fallback (cross-domain cookie safe) ───
  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem("access-token");

      if (session?.user) {
        // Standard session cookie auth
        setUser(session.user);
        setLoading(false);
      } else if (token) {
        // Cross-domain cookie is blocked, but we have a valid JWT!
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
            // Token expired or invalid
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
        // No session and no token
        if (!sessionLoading) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    syncAuth();
  }, [session, sessionLoading]);

  // Keep access token synced if Better Auth session cookie works
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


  // ─── Register ──────────────────────────────────────────────────────────────
  // Better Auth signUp.email() handles hashing & session creation
  const register = async ({ email, password, name, avatar, bloodGroup, district, upazila }) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      // Pass custom fields
      bloodGroup,
      district,
      upazila,
      avatar,
      role: "donor",
      status: "active",
    });

    if (error) throw new Error(error.message || "Registration failed");

    setLoading(true);

    // Fetch the JWT token immediately on successful registration to prevent race conditions
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

    // Fetch and populate user profile details immediately using JWT
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

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      // Map Better Auth error messages to user-friendly ones
      if (error.message?.toLowerCase().includes("invalid") || error.status === 401) {
        throw new Error("Invalid email or password");
      }
      throw new Error(error.message || "Login failed");
    }

    setLoading(true);

    // Fetch the JWT token immediately on successful login to prevent race conditions
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

    // Fetch and populate user profile immediately using JWT
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
            // Sign out immediately if blocked
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

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await authClient.signOut();
    localStorage.removeItem("access-token");
    setUser(null);
  };

  // ─── Update local user state (after profile update) ────────────────────────
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
