export type User = {
  userId: string;
  email: string;
};
export type RegisterRequest = {
  email: string;
  password: string;
};
export type LoginRequest = {
  email: string;
  password: string;
};
export type AuthResponse = {
  token: string;
  email: string;
  userId: string;
};
