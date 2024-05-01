import { createSlice } from '@reduxjs/toolkit';
export const AppSlice = createSlice({
    name: 'app',
    initialState: {
        collapsedMenu:true,
        darkTheme:false,
    },
    reducers: {
        setCollapsedMenu : (state, action) => {
            state.collapsedMenu = action.payload
        },
        setThemeDark : (state, action) => {
            state.darkTheme = action.payload
        }
    },
});
export const {
    setCollapsedMenu,
    setThemeDark
} = AppSlice.actions;
export default AppSlice.reducer;
