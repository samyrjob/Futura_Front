import { authReducer } from './auth.reducer'; // Adjust path as needed
import { loginSuccess } from './auth.actions'; // If using actions

test('should handle Login Success', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    error: null
  };

  const action = loginSuccess({ user: { username: 'test', email: 'something@laouni.fr'} }); // Or define action manually
  const newState = authReducer(initialState, action);

  expect(newState).toEqual({
    isAuthenticated: true,
    user: { username: 'test', email: 'something@laouni.fr'},
    error: null
  });
});

