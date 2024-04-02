import Constant from "@/utils/constant.js";
import {v4 as uuidv4} from 'uuid';

const handleErrorApi = (error, dispatch, openToast) => {
    if (error.code === 422) {
        error.message = Object.values(error.message);
        error.message.forEach((message) => {
            dispatch(openToast({
                id: uuidv4(),
                type: Constant.ToastType.ERROR,
                message: 'Validate',
                description: message[0],
            }));
        });
    } else {
        dispatch(openToast({
            id: uuidv4(),
            type: Constant.ToastType.ERROR,
            message: 'Lỗi',
            description: error.message.message,
        }));
    }
};

export  {
    handleErrorApi
};
