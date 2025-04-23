import { AuthState } from "./authentication/AuthState";

export interface AppState{
    auth: AuthState;
    // Add other slices of state here as needed
}