import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // For now, let's use a simple in-memory storage
    // You can replace this with actual MongoDB connection later
    console.log('Database connected (in-memory mode)');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Simple in-memory storage for demo
const storage = {
  files: new Map(),
  analyses: new Map()
};

// In-memory storage for users
let users = new Map();

const saveFileData = async (fileId, data) => {
  storage.files.set(fileId, data);
  return true;
};

const getFileData = async (fileId) => {
  return storage.files.get(fileId);
};

const saveAnalysis = async (fileId, stage, data) => {
  if (!storage.analyses.has(fileId)) {
    storage.analyses.set(fileId, {});
  }
  storage.analyses.get(fileId)[stage] = data;
  return true;
};

const getAnalysis = async (fileId, stage) => {
  const analyses = storage.analyses.get(fileId);
  return analyses ? analyses[stage] : null;
};

// User Management Methods
const userMethods = {
  // Save a new user
  async saveUser(userData) {
    users.set(userData.email, userData);
    console.log(`👤 User saved: ${userData.email}`);
    return userData;
  },

  // Find user by email
  async findUser(email) {
    const user = users.get(email.toLowerCase());
    return user || null;
  },

  // Find user by ID
  async findUserById(userId) {
    for (const user of users.values()) {
      if (user.id === userId) {
        return user;
      }
    }
    return null;
  },

  // Update user's last login
  async updateUserLastLogin(userId) {
    for (const [email, user] of users.entries()) {
      if (user.id === userId) {
        user.lastLogin = new Date();
        users.set(email, user);
        return user;
      }
    }
    return null;
  },

  // Get all users (admin function)
  async getAllUsers() {
    return Array.from(users.values()).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    }));
  },

  // Update user active status
  async updateUserStatus(userId, isActive) {
    for (const [email, user] of users.entries()) {
      if (user.id === userId) {
        user.isActive = isActive;
        users.set(email, user);
        return user;
      }
    }
    return null;
  },

  // 🔥 ADDED: Save interview session (for SME interviews)
  async saveInterviewSession(sessionId, sessionData) {
    if (!storage.interviews) {
      storage.interviews = new Map();
    }
    storage.interviews.set(sessionId, sessionData);
    return true;
  },

  // 🔥 ADDED: Get interview session
  async getInterviewSession(sessionId) {
    if (!storage.interviews) {
      return null;
    }
    return storage.interviews.get(sessionId);
  }
};

// Export all methods
export default {
  connectDB,
  saveFileData,
  getFileData,
  saveAnalysis,
  getAnalysis,
  ...userMethods
};