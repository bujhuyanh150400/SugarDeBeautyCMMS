import Constant from "@/utils/constant.js";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
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
function toThousands(value) {
    return value ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : value;
}
const convertDateTime = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export default {
    handleErrorApi, convertDateTime,toThousands
};
