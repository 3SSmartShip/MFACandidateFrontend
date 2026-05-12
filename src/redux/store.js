import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './features/candidateSlice';

export const store = configureStore({
  reducer: {
    candidate: candidateReducer,
  },
});
