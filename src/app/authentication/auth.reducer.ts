import { createReducer, on } from "@ngrx/store";
// import the state management storage in terms of auth :
import {initialAuthState} from "./AuthState";
// import the action :
import {login, loginFailure, loginSuccess, logout, enterVirtualWorld, exitVirtualWorld} from "./auth.actions";



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
  on(enterVirtualWorld, (state) => ({
    ...state,
    hasEnteredWorld: true
  })),
  on(exitVirtualWorld, (state) => ({
    ...state,
    hasEnteredWorld: false
  })),

  on(logout, () => initialAuthState)
);
