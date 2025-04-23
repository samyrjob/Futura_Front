import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./AuthState";

export const selectAuthState = createFeatureSelector<AuthState>('auth');


export const selectisAuthenticated = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
)

export const selectUsername= createSelector(
    selectAuthState,
    (state: AuthState) => state.username
)