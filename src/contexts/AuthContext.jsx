import { createContext, useContext, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  // Better Auth manages session state — useSession() is a reactive hook
  const { data: session, isPending: loading, refetch } = authClient.useSession();

  const user = session?.user ?? null;

  // ─── Sync access token with session state (Reload Safe) ─────────────────────
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
    } else if (!loading) {
      localStorage.removeItem("access-token");
    }
  }, [session, loading]);

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

    // Fetch the JWT token immediately on successful registration to prevent race conditions
    try {
      const res = await fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const jwtData = await res.json();
        if (jwtData.token) {
          localStorage.setItem("access-token", jwtData.token);
        }
      }
    } catch (err) {
      console.error("JWT fetch failed on registration:", err);
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

    // Fetch the JWT token immediately on successful login to prevent race conditions
    try {
      const res = await fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const jwtData = await res.json();
        if (jwtData.token) {
          localStorage.setItem("access-token", jwtData.token);
        }
      }
    } catch (err) {
      console.error("JWT fetch failed on login:", err);
    }

    // Check if user is blocked (fetch from our DB)
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${API_URL}/api/profile`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const profile = await res.json();
        if (profile.status === "blocked") {
          // Sign out immediately and throw
          await authClient.signOut();
          localStorage.removeItem("access-token");
          throw new Error("Your account has been blocked. Contact support.");
        }
      }
    } catch (err) {
      if (err.message?.includes("blocked")) throw err;
      // Other fetch errors — ignore, session is still valid
    }

    return data;
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await authClient.signOut();
    localStorage.removeItem("access-token");
  };


  // ─── Update local user state (after profile update) ────────────────────────
  const updateUser = async () => {
    // Re-fetch session from server to get updated user data
    await refetch();
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
