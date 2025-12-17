import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    count: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
     setCartCount: (state, action) => {
      state.count = action.payload;
     },
     increaseCartCount: (state) => {
      state.count = state.count + 1;
     },
    }
})

export const { setCartCount, increaseCartCount } = cartSlice.actions;

export default cartSlice.reducer;
