import {Button, Layout, Flex, Image, Dropdown, Badge, Modal} from 'antd';
import {BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from "@ant-design/icons";
import {setCollapsedMenu, setLoading} from "@/redux/reducers/AppSlice.js";
import {useDispatch, useSelector} from "react-redux";
import logo from "~/assets/logo.png";
import {Link} from "react-router-dom";
import {v4 as uuid} from 'uuid';
import {createSelector} from "@reduxjs/toolkit";
import {useState} from "react";
const {HeaderAntd} = Layout;
import apiRequest from "~/service/apiRequest.js";
import {handleErrorApi} from "@/utils/function.js"
import {openToast} from "@/redux/reducers/ToastSlice.js";
import Constant from "@/utils/constant.js";

const selectStatusMenu = state => state.app.collapsedMenu;
const selectLogin = state => state.login.currentUser;


const selectMenuAndLogin = createSelector(
    selectStatusMenu,
    selectLogin,
    (statusMenu, login) => ({ statusMenu, login }));


const HeaderAdmin = () => {
    const dispatch = useDispatch();
    const statusMenu = useSelector(selectMenuAndLogin);
    const [openAccountModal, setOpenAccountModal] = useState(false);
    /**
     * Function xử lý  logout
     * @return {Promise<void>}
     */
    const handleLogout = async () => {
        console.log('test');
    }

    const items = [
        {
            key: uuid(),
            label: "Thông tin tài khoản",
            onClick: ()=>setOpenAccountModal(true)
        },
        {
            key: uuid(),
            icon: <LogoutOutlined />,
            danger:true,
            label: "Đăng xuất",
            onClick : handleLogout,
        },
    ];
    return (
        <>
            <HeaderAntd className="sticky top-0 w-full p-0 bg-white pe-10">
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
                        <Link to="/" className="w-[200px] flex items-center justify-center">
                            <Image
                                preview={false}
                                width="fit-content"
                                height="fit-content"
                                src={logo}
                                alt="Logo HVBASE"
                            />
                        </Link>
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
                                icon={<UserOutlined />}
                                size="large">
                                test124
                            </Button>
                        </Dropdown>
                        <Badge count={21} overflowCount={20}>
                            <Button
                                icon={<BellOutlined />}
                                size="large">
                            </Button>
                        </Badge>
                    </Flex>
                </Flex>
            </HeaderAntd>
            <Modal
                open={openAccountModal}
                title={`Thông tin tài khoản `}
                onCancel={()=>setOpenAccountModal(false)}
                footer={[
                    <Button danger="true" key="back" onClick={()=>setOpenAccountModal(false)}>
                        Thoát
                    </Button>,
                ]}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>

    );
}

export default HeaderAdmin;


