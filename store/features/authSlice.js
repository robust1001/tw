import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  didTryAutoLogin: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticate(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.didTryAutoLogin = true;
    },
    setDidTryAutoLogin(state) {
      state.didTryAutoLogin = true;
    },
    logout(state) {
      console.log(initialState);
      state.token = initialState.token;
      state.user = initialState.user;
      state.didTryAutoLogin = initialState.didTryAutoLogin;
    },
  },
});

export const {setAuthenticate, setDidTryAutoLogin, logout} = authSlice.actions;

export default authSlice.reducer;
