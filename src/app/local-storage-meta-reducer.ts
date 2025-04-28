// local-storage.metareducer.ts

import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { ActionReducer, INIT, UPDATE } from '@ngrx/store';




export function initialStateFactory() {
  const platformId = inject(PLATFORM_ID);
  return getInitialState(platformId);
}



export function hydrationMetaReducer<State>(reducer: ActionReducer<State>): ActionReducer<State> {
  const platformId = inject(PLATFORM_ID); 
  console.log('Platform ID:', platformId); // Log the platform ID for debugging

  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
    if (isPlatformBrowser(platformId)){
        const storedState = localStorage.getItem('appState');
        if (storedState) {
          try {
            return JSON.parse(storedState);
          } catch {
            localStorage.removeItem('appState');
          }
        }

    }
    }

    const nextState = reducer(state, action);
    if (isPlatformBrowser(platformId)){
      // Store the new state in localStorage
      localStorage.setItem('appState', JSON.stringify(nextState));
    }
    return nextState;
  };

}


export function getInitialState<State>(platformId: Object): State | undefined {

  if (isPlatformBrowser(platformId)) {
    try {
      const storedState = localStorage.getItem('appState');
      if (storedState) {
        return JSON.parse(storedState) as State;
      }
    } catch (e) {
      console.error('Could not load state from localStorage', e);
    }
  }
  return undefined;
}
