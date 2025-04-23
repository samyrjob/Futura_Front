// when we have several reducers

import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './authentication/auth.reducer';
import { Action } from 'rxjs/internal/scheduler/Action';



// Define the overall application state interface
export const appReducer: ActionReducerMap<AppState> = {
    auth: authReducer,
};