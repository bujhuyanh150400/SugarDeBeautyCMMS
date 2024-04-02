import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {notification} from 'antd';
import {closeToast} from "@/redux/reducers/ToastSlice.js";

const Toast = () => {
    const dispatch = useDispatch();
    const toasts = useSelector((state) => state.toast);
    const [api, contextHolder] = notification.useNotification();
    notification.config({
        placement: 'topRight',
        duration: 5,
    });
    useEffect(() => {
        toasts.forEach(toast => {
            api[toast.type]({
                message: toast.message,
                description: toast.description,
                key: toast.id,
                onClose: () => {
                    dispatch(closeToast({id: toast.id}));
                },
            });
        });
    }, [toasts, api, dispatch])

    return (
        <>
            {contextHolder}
        </>
    );
}

export default Toast;
