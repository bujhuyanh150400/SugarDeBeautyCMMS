import { useSelector } from 'react-redux';
import {  Spin } from 'antd';
const Loading = () => {
    const loading = useSelector(state => state.app.loading);
    return (
        <Spin spinning={loading} size="large" fullscreen />
    );
};
export default Loading;