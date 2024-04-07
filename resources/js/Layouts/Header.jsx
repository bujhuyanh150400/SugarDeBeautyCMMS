import {Button, Layout, Flex, Image, Dropdown, Badge, Modal} from 'antd';
import {
    BellOutlined,
    ExclamationCircleFilled,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from "@ant-design/icons";
import {setCollapsedMenu, setLoading} from "@/redux/reducers/AppSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {v4 as uuidv4, v4 as uuid} from 'uuid';
import {useEffect, useState} from "react";
import {router, usePage} from "@inertiajs/react";
import {openToast} from "@/redux/reducers/ToastSlice.js";
import Constant from "@/utils/constant.js";


const HeaderAdmin = () => {
    const dispatch = useDispatch();
    const page = usePage();
    const currentUser = page.props.auth.user;
    const statusMenu = useSelector(state => state.app.collapsedMenu);
    const [openAccountModal, setOpenAccountModal] = useState(false);
    const handleLogout = async () => {
        Modal.confirm({
            title: 'Bạn có muốn đăng xuất không ?',
            icon: <ExclamationCircleFilled/>,
            okText: 'Tôi muốn đăng xuất',
            cancelText: 'Không',
            onOk() {
                router.post('/logout')
            },
            onCancel() {
                return false
            }
        });
    }
    const items = [
        {
            key: uuid(),
            label: "Thông tin tài khoản",
            onClick: () => setOpenAccountModal(true)
        },
        {
            key: uuid(),
            icon: <LogoutOutlined/>,
            danger: true,
            label: "Đăng xuất",
            onClick: handleLogout,
        },
    ];
    return (
        <>
            <Layout.Header
                style={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    padding: '0 2.5rem 0 0',
                    background: '#fff',
                    zIndex: '999',
                    borderBottom:'1px solid #ccc'
                }}
            >
                <Flex align="center" justify="space-between">
                    {/*Logo and btn menu*/}
                    <Flex align="center" gap="small">
                        <Button
                            type="text"
                            icon={statusMenu ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => dispatch(setCollapsedMenu(!statusMenu))}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Flex>
                    {/* Account and notification */}
                    <Flex align="center" gap="small">
                        <Dropdown
                            menu={{items}}
                            trigger={['click']}
                            placement="bottomLeft"
                            arrow
                        >
                            <Button
                                icon={<UserOutlined/>}
                                size="large">
                                {currentUser.name}
                            </Button>
                        </Dropdown>
                        <Badge count={21} overflowCount={20}>
                            <Button
                                icon={<BellOutlined/>}
                                size="large">
                            </Button>
                        </Badge>
                    </Flex>
                </Flex>
            </Layout.Header>
            <Modal
                open={openAccountModal}
                title={`Thông tin tài khoản `}
                onCancel={() => setOpenAccountModal(false)}
                footer={[
                    <Button onClick={() => {
                        router.get('/');
                        setOpenAccountModal(false);
                    }}>
                        hehe
                    </Button>,
                ]}
            >
                <p>Some contents...</p>
            </Modal>
        </>

    );
}

export default HeaderAdmin;


