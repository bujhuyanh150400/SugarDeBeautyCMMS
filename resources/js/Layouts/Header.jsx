import {setCollapsedMenu} from "@/redux/reducers/AppSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Head, Link, router, usePage} from "@inertiajs/react";
import {Avatar, Button, Dropdown, Header, Heading, IconButton, Panel, Stack, Toggle} from "rsuite";
import {setThemeDark} from "@/redux/reducers/AppSlice.js";
import {Icon} from "@rsuite/icons";
import OffRoundIcon from '@rsuite/icons/OffRound';
import MenuIcon from '@rsuite/icons/Menu';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mt-1" height="15" width="15" viewBox="0 0 512 512">
        <path
            d="M494.2 221.9l-59.8-40.5 13.7-71c2.6-13.2-1.6-26.8-11.1-36.4-9.6-9.5-23.2-13.7-36.2-11.1l-70.9 13.7-40.4-59.9c-15.1-22.3-51.9-22.3-67 0l-40.4 59.9-70.8-13.7C98 60.4 84.5 64.5 75 74.1c-9.5 9.6-13.7 23.1-11.1 36.3l13.7 71-59.8 40.5C6.6 229.5 0 242 0 255.5s6.7 26 17.8 33.5l59.8 40.5-13.7 71c-2.6 13.2 1.6 26.8 11.1 36.3 9.5 9.5 22.9 13.7 36.3 11.1l70.8-13.7 40.4 59.9C230 505.3 242.6 512 256 512s26-6.7 33.5-17.8l40.4-59.9 70.9 13.7c13.4 2.7 26.8-1.6 36.3-11.1 9.5-9.5 13.6-23.1 11.1-36.3l-13.7-71 59.8-40.5c11.1-7.5 17.8-20.1 17.8-33.5-.1-13.6-6.7-26.1-17.9-33.7zm-112.9 85.6l17.6 91.2-91-17.6L256 458l-51.9-77-90.9 17.6 17.6-91.2-76.8-52 76.8-52-17.6-91.2 91 17.6L256 53l51.9 76.9 91-17.6-17.6 91.1 76.8 52-76.8 52.1zM256 152c-57.3 0-104 46.7-104 104s46.7 104 104 104 104-46.7 104-104-46.7-104-104-104zm0 160c-30.9 0-56-25.1-56-56s25.1-56 56-56 56 25.1 56 56-25.1 56-56 56z"/>
    </svg>);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mt-1" height="15" width="15" viewBox="0 0 512 512">
        <path
            d="M283.2 512c79 0 151.1-35.9 198.9-94.8 7.1-8.7-.6-21.4-11.6-19.4-124.2 23.7-238.3-71.6-238.3-197 0-72.2 38.7-138.6 101.5-174.4 9.7-5.5 7.3-20.2-3.8-22.2A258.2 258.2 0 0 0 283.2 0c-141.3 0-256 114.5-256 256 0 141.3 114.5 256 256 256z"/>
    </svg>);

const renderToggle = props => <Avatar bordered  {...props} size="sm" className="mt-1" circle/>

const HeaderAdmin = ({back_to}) => {
    const dispatch = useDispatch();
    const page = usePage();
    const currentUser = page.props.auth.user;
    const collapsedMenu = useSelector(state => state.app.collapsedMenu);
    const darkTheme = useSelector(state => state.app.darkTheme);
    const handleLogout = async () => {
        await router.post(route('logout'))
    }
    return (
        <>
            <Head title={page.props.title ?? 'Sugar de beautes'}/>
            <Header className="px-4 py-8">
                <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={8}
                >
                    <Stack
                        alignItems="center"
                        spacing={8}
                    >
                        <IconButton icon={<MenuIcon/>} appearance="subtle"
                                    onClick={() => dispatch(setCollapsedMenu(!collapsedMenu))}></IconButton>
                        {back_to && (<Button as={Link} href={back_to} size="sm" color="red" appearance="ghost" startIcon={<ArrowLeftLineIcon />}>Quay lại</Button>)}
                        <Heading className="roboto" level={5}>{page.props.title ?? 'Sugar de beautes'}</Heading>
                    </Stack>
                    <Stack
                        alignItems="center"
                        spacing={16}
                    >
                        <Toggle
                            size="md"
                            checked={darkTheme}
                            onChange={checked => dispatch(setThemeDark(checked))}
                            checkedChildren={<Icon as={MoonIcon}/>}
                            unCheckedChildren={<Icon as={SunIcon}/>}
                        />
                        <Dropdown renderToggle={renderToggle} placement="bottomEnd">
                            <Dropdown.Item panel style={{padding: 10, width: 160}}>
                                <p>Chào bạn</p>
                                <strong>{currentUser.name}</strong>
                            </Dropdown.Item>
                            <Dropdown.Separator/>
                            <Dropdown.Item>Xem thông tin cá nhân</Dropdown.Item>
                            <Dropdown.Separator/>
                            <Dropdown.Item onClick={handleLogout} icon={<OffRoundIcon/>}>Đăng xuất</Dropdown.Item>
                        </Dropdown>
                    </Stack>
                </Stack>
            </Header>
        </>
    );
}


export default HeaderAdmin;


