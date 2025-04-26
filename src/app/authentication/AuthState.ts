import { UtilisatorDTO } from '../model/UtilisatorDTO';

export interface AuthState {
  isAuthenticated: boolean;
  user: UtilisatorDTO | null;
  error: any; // 👈 add this line to store login errors
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
//   username: null,
  user: null,
  error: null, // 👈 initialize error state
};
