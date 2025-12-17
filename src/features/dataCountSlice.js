import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    countTotalData: 0
}

export const dataCountSlice = createSlice({
    name: 'count_data',
    initialState,
    reducers: {
      setTotalCount: (state, action) => {
        state.countTotalData = action.payload.countTotalData;
      },
    }
})

export const { setTotalCount } = dataCountSlice.actions;

export default dataCountSlice.reducer;
