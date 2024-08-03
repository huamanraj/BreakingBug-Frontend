import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userSlice';

const store = configureStore({
    // ERROR:::: JavaScript object literals,we use a colon (:) to separate the property name from its value, not an equals sign (=)!! 
    
    reducer: {
        user: userReducer,
    }
});

export default store;