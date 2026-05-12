import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidateData: null,
  isAuthenticated: false,
};

export const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidateData: (state, action) => {
      state.candidateData = action.payload;
      state.isAuthenticated = true;
    },
    logoutCandidate: (state) => {
      state.candidateData = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCandidateData, logoutCandidate } = candidateSlice.actions;
export default candidateSlice.reducer;
