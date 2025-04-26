import { createReducer, on } from "@ngrx/store";
// import the state management storage in terms of auth :
import {initialAuthState} from "./AuthState";
// import the action :
import {login, loginFailure, loginSuccess, logout} from "./auth.actions";



export const authReducer = createReducer(
  initialAuthState,

  on(loginSuccess, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    // username: user.email,  // or `user.username` based on backend
    user: user
  })),

  on(loginFailure, (state, { error }) => ({
    ...state,
    error: error, // <- store it somewhere in state
  })),

  on(logout, () => initialAuthState)
);
