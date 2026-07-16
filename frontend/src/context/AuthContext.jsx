import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// ─── Built-in demo accounts ─────────────────────────────────────────────────
const DEMO_USERS = [
  {
    _id: 'admin001',
    name: 'Admin User',
    email: 'admin@shopnova.com',
    password: 'admin123',
    isAdmin: true,
    token: 'demo-admin-token',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: 'user001',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    isAdmin: false,
    token: 'demo-user-token',
    createdAt: '2024-02-15T00:00:00.000Z',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const USERS_KEY = 'shopnova_users';
const SESSION_KEY = 'userInfo';

/** Return all users (demo + registered) stored locally */
const getAllUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/** Persist a newly registered user to localStorage */
const saveUser = (user) => {
  const existing = getAllUsers();
  existing.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(existing));
};

/** Find a user by email across demo + registered users */
const findUserByEmail = (email) => {
  const lower = email.toLowerCase();
  const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === lower);
  if (demo) return demo;
  return getAllUsers().find((u) => u.email.toLowerCase() === lower) || null;
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  /** Sign in: checks demo users first, then registered users in localStorage */
  const loginUser = async (email, password) => {
    const found = findUserByEmail(email);
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password');
    }
    // Strip password before storing in session
    const { password: _pw, ...session } = found;
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  };

  /** Register: saves new user to localStorage */
  const registerUser = async (name, email, password) => {
    if (findUserByEmail(email)) {
      throw new Error('Email already registered');
    }
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password,
      isAdmin: false,
      token: `token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    const { password: _pw, ...session } = newUser;
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  };

  /** Update profile info in session + registered-users store */
  const updateUserProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));

    // Also update in the registered users list (not demo accounts)
    const all = getAllUsers();
    const idx = all.findIndex((u) => u._id === user._id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(all));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
