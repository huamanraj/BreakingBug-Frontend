import { configureStore } from '@reduxjs/toolkit';
// ERROR: Importing `userReducer` from './userSlice' is incorrect. Use default export instead.
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        // ERROR: Use a colon (:) to separate property names from values in JavaScript objects, not an equals sign (=).
        user: userReducer,
    }
});

export default store;
