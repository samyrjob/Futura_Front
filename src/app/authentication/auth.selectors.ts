import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './AuthState';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

// Optional: to get username from user object
export const selectUsername = createSelector(
  selectAuthState,
  (state: AuthState) => state.user?.username ?? null
);

export const selectHasEnteredWorld = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.hasEnteredWorld
);