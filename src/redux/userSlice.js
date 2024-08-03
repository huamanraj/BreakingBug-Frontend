import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

// Initial state for userSlice
const initialState = {
    status: 'idle',
    loading: false,
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
    currentToken: (JSON.parse(localStorage.getItem('user')) || {}).token || null,
    isLoggedIn: false,
    error: null,
    response: null,
    responseReview: null,
    responseProducts: null,
    responseSellerProducts: null,
    responseSpecificProducts: null,
    responseDetails: null,
    responseSearch: null,
    responseCustomersList: null,
    productData: [],
    sellerProductData: [],
    specificProductData: [],
    productDetails: {},
    productDetailsCart: {},
    filteredProducts: [],
    customersList: [],
};

// Function to update cart details in local storage
const updateCartDetailsInLocalStorage = (cartDetails) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    currentUser.cartDetails = cartDetails;
    localStorage.setItem('user', JSON.stringify(currentUser));
};

// Function to update shipping data in local storage
const updateShippingDataInLocalStorage = (shippingData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {
        ...currentUser,
        shippingData: shippingData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action to indicate an authentication request is in progress
        authRequest: (state) => {
            state.status = 'loading';
        },
        // Action to reset the state after an under-control action
        underControl: (state) => {
            state.status = 'idle';
            state.response = null;
        },
        // Action to handle successful addition of stuff
        stuffAdded: (state) => {
            state.status = 'added';
            state.response = null;
            state.error = null;
        },
        // Action to handle successful update of stuff
        stuffUpdated: (state) => {
            state.status = 'updated';
            state.response = null;
            state.error = null;
        },
        // Action to handle update failure
        updateFailed: (state, action) => {
            state.status = 'failed';
            state.responseReview = action.payload;
            state.error = null;
        },
        // Action to update shipping data and local storage
        updateShippingData: (state, action) => {
            state.currentUser.shippingData = action.payload;
            updateShippingDataInLocalStorage(action.payload);
        },
        // Action to update current user and token in local storage
        updateCurrentUser: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
            state.currentToken = action.payload.token; // Ensure token is updated
            localStorage.setItem('user', JSON.stringify(state.currentUser));
        },
        // Action to handle authentication success
        authSuccess: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.currentUser = action.payload;
            state.currentRole = action.payload.role;
            state.currentToken = action.payload.token;
            state.status = 'success';
            state.response = null;
            state.error = null;
            state.isLoggedIn = true;
        },
        // Action to add a product to the cart
        addToCart: (state, action) => {
            const existingProduct = state.currentUser.cartDetails.find(
                (cartItem) => cartItem._id === action.payload._id
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const newCartItem = { ...action.payload, quantity: 1 };
                state.currentUser.cartDetails.push(newCartItem);
            }

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
        },
        // Action to remove a product from the cart
        removeFromCart: (state, action) => {
            const existingProduct = state.currentUser.cartDetails.find(
                (cartItem) => cartItem._id === action.payload._id
            );

            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                } else {
                    const index = state.currentUser.cartDetails.findIndex(
                        (cartItem) => cartItem._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.currentUser.cartDetails.splice(index, 1);
                    }
                }
            }

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
        },
        // Action to remove a specific product from the cart
        removeSpecificProduct: (state, action) => {
            const productIdToRemove = action.payload;
            state.currentUser.cartDetails = state.currentUser.cartDetails.filter(
                (cartItem) => cartItem._id !== productIdToRemove
            );
            updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
        },
        // Action to fetch product details from the cart
        fetchProductDetailsFromCart: (state, action) => {
            const productIdToFetch = action.payload;
            const productInCart = state.currentUser.cartDetails.find(
                (cartItem) => cartItem._id === productIdToFetch
            );

            if (productInCart) {
                state.productDetailsCart = { ...productInCart };
            } else {
                state.productDetailsCart = null;
            }
        },
        // Action to remove all products from the cart
        removeAllFromCart: (state) => {
            state.currentUser.cartDetails = [];
            updateCartDetailsInLocalStorage([]);
        },
        // Action to handle authentication failure
        authFailed: (state, action) => {
            state.status = 'failed';
            state.response = action.payload;
            state.error = null;
        },
        // Action to handle authentication error
        authError: (state, action) => {
            state.status = 'error';
            state.response = null;
            state.error = action.payload;
        },
        // Action to handle user logout
        authLogout: (state) => {
            localStorage.removeItem('user');
            state.status = 'idle';
            state.loading = false;
            state.currentUser = null;
            state.currentRole = null;
            state.currentToken = null;
            state.error = null;
            state.response = true;
            state.isLoggedIn = false;
        },
        // Action to check if the token is valid and handle errors
        isTokenValid: (state) => {
            const token = state.currentToken;
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    if (decodedToken.exp * 1000 > Date.now()) {
                        state.isLoggedIn = true;
                    } else {
                        // Token expired
                        localStorage.removeItem('user');
                        state.currentUser = null;
                        state.currentRole = null;
                        state.currentToken = null;
                        state.status = 'idle';
                        state.response = null;
                        state.error = null;
                        state.isLoggedIn = false;
                    }
                } catch (error) {
                    // Error decoding token
                    console.error('Invalid token specified', error);
                    localStorage.removeItem('user');
                    state.currentUser = null;
                    state.currentRole = null;
                    state.currentToken = null;
                    state.status = 'idle';
                    state.response = null;
                    state.error = null;
                    state.isLoggedIn = false;
                }
            } else {
                // No token
                state.isLoggedIn = false;
            }
        },
        // Action to indicate a request is in progress
        getRequest: (state) => {
            state.loading = true;
        },
        // Action to handle request failure
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Action to handle request error
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Action to handle successful deletion
        getDeleteSuccess: (state) => {
            state.status = 'deleted';
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        // Action to handle successful product data fetch
        productSuccess: (state, action) => {
            state.productData = action.payload;
            state.responseProducts = null;
            state.loading = false;
            state.error = null;
        },
        // Action to handle product fetch failure
        getProductsFailed: (state, action) => {
            state.responseProducts = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Action to handle successful seller product data fetch
        sellerProductSuccess: (state, action) => {
            state.sellerProductData = action.payload;
            state.responseSellerProducts = null;
            state.loading = false;
            state.error = null;
        },
        // Action to handle seller product fetch failure
        getSellerProductsFailed: (state, action) => {
            state.responseSellerProducts = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Action to handle successful specific product data fetch
        specificProductSuccess: (state, action) => {
            state.specificProductData = action.payload;
            state.responseSpecificProducts = null;
            state.loading = false;
            state.error = null;
        },
        // Action to handle specific product fetch failure
        getSpecificProductsFailed: (state, action) => {
            state.responseSpecificProducts = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Action to handle successful product details fetch
        productDetailsSuccess: (state, action) => {
            state.productDetails = action.payload;
            state.responseDetails = null;
            state.loading = false;
            state.error = null;
        },
        // Action to handle product details fetch failure
        getProductDetailsFailed: (state, action) => {
            state.responseDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Action to handle successful filtered products fetch
        filterProductSuccess: (state, action) => {
            state.filteredProducts = action.payload;
            state.responseSearch = null;
            state.loading = false;
            state.error = null;
        },
        // Action to handle filtered products fetch failure
        getFilterProductsFailed: (state, action) => {
            state.responseSearch = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Action to handle successful customers list fetch
        customersListSuccess: (state, action) => {
            state.customersList = action.payload;
            state.responseCustomersList = null;
            state.loading = false;
            state.error = null;
        },
        // Action to handle customers list fetch failure
        getCustomersListFailed: (state, action) => {
            state.responseCustomersList = action.payload;
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    stuffUpdated,
    updateFailed,
    updateShippingData,
    updateCurrentUser,
    authSuccess,
    addToCart,
    removeFromCart,
    removeSpecificProduct,
    fetchProductDetailsFromCart,
    removeAllFromCart,
    authFailed,
    authError,
    authLogout,
    isTokenValid,
    getRequest,
    getFailed,
    getError,
    getDeleteSuccess,
    productSuccess,
    getProductsFailed,
    sellerProductSuccess,
    getSellerProductsFailed,
    specificProductSuccess,
    getSpecificProductsFailed,
    productDetailsSuccess,
    getProductDetailsFailed,
    filterProductSuccess,
    getFilterProductsFailed,
    customersListSuccess,
    getCustomersListFailed
} = userSlice.actions;

export default userSlice.reducer;
