import { createSlice } from '@reduxjs/toolkit';
export const AppSlice = createSlice({
    name: 'app',
    initialState: {
        loading: false,
        collapsedMenu:false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setCollapsedMenu : (state, action) => {
            state.collapsedMenu = action.payload
        }
    },
});
export const {
    setLoading,
    setCollapsedMenu
} = AppSlice.actions;
export default AppSlice.reducer;