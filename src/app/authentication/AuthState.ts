import { UtilisatorDTO } from '../model/UtilisatorDTO';

export interface AuthState {
  isAuthenticated: boolean;
  user: UtilisatorDTO | null;
  hasEnteredWorld: boolean; // ← this is the new piece of state
  error: any; // 👈 add this line to store login errors
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  //   username: null,
  user: null,
  hasEnteredWorld: false, // NEW
  error: null, // 👈 initialize error state
};
