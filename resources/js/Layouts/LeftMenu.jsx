import {Link, usePage} from '@inertiajs/react';
import {useSelector} from "react-redux";
import {Nav, Sidebar, Sidenav} from "rsuite";
import DynamicIcon from "@/Components/DynamicIcon.jsx";
import {v4 as uuid} from "uuid"
const LeftMenu = () => {
    const page = usePage();
    const parentPath = page.url.split('/').splice(1, 2).shift();
    const childPath = page.url.split('/').splice(2, 3).shift() ;
    const menus = page.props.auth.menu;
    const collapsedMenu = useSelector(state => state.app.collapsedMenu);
    const RenderMenu = ({menu,parent}) => {
        return (
            <>
                {(menu.children && menu.children.length > 0) ? (
                    <Nav.Menu
                        key={menu.key}
                        trigger="click"
                        title={menu.label}
                        icon={<DynamicIcon icon={menu.icon} />}
                        eventKey={menu.active}
                        placement="rightStart"
                    >
                        {menu.children.map(menuChild => (
                            <RenderMenu key={uuid()} parent={menu.active} menu={menuChild} />
                        ))}
                    </Nav.Menu>
                ): (
                    <Nav.Item key={menu.key} as={Link}
                              href={menu.href}
                              eventKey={ parent ? `${parent}-${menu.active}` : menu.active }
                              icon={<DynamicIcon icon={menu.icon} />}>
                        {menu.label}
                    </Nav.Item>
                )}
            </>
        )
    }

    return (
        <Sidebar
            className="!sticky !top-0 !left-0 !h-screen flex flex-col z-50"
            width={collapsedMenu ? 220 : 56}
            collapsible
        >
            <Sidenav expanded={collapsedMenu} defaultOpenKeys={[parentPath]} appearance="subtle">
                <Sidenav.Body>
                    <Nav activeKey={`${parentPath}-${childPath}`}>
                        {menus.map((menu) => (<RenderMenu key={uuid()} menu={menu} />))}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </Sidebar>
    );
}



export default LeftMenu;


