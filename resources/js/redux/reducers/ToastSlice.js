import {createSlice} from '@reduxjs/toolkit';

export const ToastSlice = createSlice({
    name: 'toast',
    initialState: [],
    reducers: {
        openToast: (state, action) => {
            state.push(action.payload);
        },
        closeToast: (state,action) =>{
            return state.filter(toast => toast.id !== action.payload.id);
        }
    },
});
export const {openToast,closeToast} = ToastSlice.actions;
export default ToastSlice.reducer;