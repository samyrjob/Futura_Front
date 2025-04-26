import { Utilisator } from '../model/Utilisator';

export interface AuthState {
  isAuthenticated: boolean;
//   username: string | null;
  user: Utilisator | null;
  error: any; // 👈 add this line to store login errors
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
//   username: null,
  user: null,
  error: null, // 👈 initialize error state
};
