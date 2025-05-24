import { createAction, props } from '@ngrx/store';
const STORAGE = '@ngrx/store/storage';

export const login = createAction(
  STORAGE,
  props<{ payload: string }>()
);