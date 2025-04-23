export interface AuthState {
    isAuthenticated : boolean;
    username : string | null;
}

// here initialAuthState is a plain object that implements the AuthState interface. 
export const initialAuthState: AuthState = {
    isAuthenticated: false,
    username: null
};