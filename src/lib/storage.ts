import { type User } from "@/types";

const USER_KEY = "signalr-chat-room-user";

export const storage = {
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
};
