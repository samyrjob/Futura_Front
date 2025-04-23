import { createReducer, on } from "@ngrx/store";
// import the state management storage in terms of auth :
import {initialAuthState} from "./AuthState";
// import the action :
import {login} from "./auth.actions";
import {logout} from "./auth.actions";


// create the reducer like when we login we change the state auth management :
export const authReducer = createReducer(
    initialAuthState,
    on (login, (state, { username }) => {
        return {
            ...state,
                isAuthenticated: true,
                username: username
        }
        }),
    on (logout, (state) => {
        return initialAuthState
    }))
