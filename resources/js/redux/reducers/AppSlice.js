import { createSlice } from '@reduxjs/toolkit';
export const AppSlice = createSlice({
    name: 'app',
    initialState: {
        collapsedMenu:false,
        darkTheme:false,
        loading:false,
    },
    reducers: {
        setCollapsedMenu : (state, action) => {
            state.collapsedMenu = action.payload
        },
        setThemeDark : (state, action) => {
            state.darkTheme = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    },
});
export const {
    setCollapsedMenu,
    setThemeDark,
    setLoading
} = AppSlice.actions;
export default AppSlice.reducer;
