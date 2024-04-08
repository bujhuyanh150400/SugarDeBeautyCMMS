import {Button, Flex, Layout as LayoutAntd, Typography} from 'antd';
import LeftMenu from "@/Layouts/LeftMenu.jsx";
import Header from "@/Layouts/Header.jsx";
import {Head, router, usePage} from "@inertiajs/react";
import {SwapLeftOutlined} from "@ant-design/icons";
import {useEffect} from "react";
import Constant from "@/utils/constant.js";
import {openToast} from "@/redux/reducers/ToastSlice.js";
import {v4 as uuidv4} from "uuid";
import {useDispatch} from "react-redux";
const LayoutCMMS = ({children,title,back_to}) => {
    const dispatch = useDispatch();
    const flashMessage = usePage().props.flash
    useEffect(() => {
        if (flashMessage.success || flashMessage.error || flashMessage.warning || flashMessage.info) {
            let toastType;
            let toastMessage;
            if (flashMessage.success) {
                toastType = Constant.ToastType.SUCCESS;
                toastMessage = "Thành công";
            } else if (flashMessage.error) {
                toastType = Constant.ToastType.ERROR;
                toastMessage = "Lỗi !!!";
            } else if (flashMessage.warning) {
                toastType = Constant.ToastType.WARNING;
                toastMessage = "Cảnh báo !!!";
            } else if (flashMessage.info) {
                toastType = Constant.ToastType.INFO;
                toastMessage = "Thông tin";
            }
            dispatch(openToast({
                id: uuidv4(),
                type: toastType,
                message: toastMessage,
                description: flashMessage.success || flashMessage.error || flashMessage.warning || flashMessage.info,
            }));
        }
    }, [flashMessage]);
    return (
        <LayoutAntd hasSider>
            <Head title={title ?? "CMMS admin"}/>
            <LeftMenu />
            <LayoutAntd>
                <Header/>
                <LayoutAntd.Content style={{
                    padding:"1rem",
                    height:"100%"
                }}>
                    <div
                        style={{
                            background:"#fff",
                            padding:"1rem",
                            borderRadius: "0.375rem",
                            minHeight: "100%",
                        }}>
                        <Flex align="center" gap={12} style={{ paddingBottom:"2rem"}}>
                            {back_to ? <Button size="small" danger onClick={()=> router.get(back_to)} icon={<SwapLeftOutlined />}>Quay lại</Button> : ''}
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                {title}
                            </Typography.Title>
                        </Flex>
                        {children}
                    </div>
                </LayoutAntd.Content>
            </LayoutAntd>
        </LayoutAntd>
    );
}
export default LayoutCMMS;
