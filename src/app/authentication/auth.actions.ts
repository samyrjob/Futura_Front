import {createAction, props} from '@ngrx/store';
import { UtilisatorDTO } from '../model/UtilisatorDTO';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: UtilisatorDTO }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const enterVirtualWorld = createAction(
  '[Auth] Enter Virtual World');

export const exitVirtualWorld = createAction(
  '[Auth] Exit Virtual World');

export const logout = createAction('[Auth] Logout');

