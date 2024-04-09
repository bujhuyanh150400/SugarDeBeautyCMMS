import {Layout, Menu} from 'antd';
import {useSelector} from "react-redux";
import {Link, usePage} from '@inertiajs/react';
import DynamicIcon from "@/Components/DynamicIcon.jsx";
const LeftMenu = () => {
    const page = usePage();
    const parentPath = page.url.split('/').splice(1, 2).shift();
    const menu = page.props.auth.menu;
    // Chưa tối ưu lắm ...
    let arrayMenu = menu.map((item_menu) => {
        let children = item_menu.is_sub ? item_menu.children.map((children_item)=>{
            return {
                key: children_item.key,
                label : <Link replace href={`/${children_item.href}`}>{children_item.label}</Link>,
                link_uri: children_item.href
            }
        }) : null
        return {
            key: item_menu.key,
            label : item_menu.is_sub ? item_menu.label : <Link replace href={`/${item_menu.href}`}>{item_menu.label}</Link>,
            icon: (<DynamicIcon icon={item_menu.icon} />),
            children: children,
            link_uri: item_menu.href
        }
    });
    const findLocation = (menu) => {
        let selectedKey = null;
        let openKeys = [];
        for (const menuItem of menu) {
            let urlPathParent = menuItem.link_uri ? menuItem.link_uri.split('/').shift() : '';
            if (urlPathParent === parentPath) {
                selectedKey = menuItem.key;
                openKeys.push(menuItem.key);
                return {selectedKey, openKeys};
            } else if (menuItem.children && menuItem.children.length > 0) {
                const {selectedKey: childSelectedKey, openKeys: childOpenKeys} = findLocation(menuItem.children);
                if (childSelectedKey) {
                    selectedKey = childSelectedKey;
                    openKeys = openKeys.concat(menuItem.key, childOpenKeys);
                    return {selectedKey, openKeys};
                }
            }
        }
        return {selectedKey, openKeys};
    }
    const {selectedKey, openKeys} = findLocation(arrayMenu);
    const statusMenu = useSelector(state => state.app.collapsedMenu);
    return (
        <Layout.Sider trigger={null} collapsible collapsed={statusMenu}>
            <Menu
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    height: "100vh",
                    zIndex: '999',
                }}
                theme="light"
                mode="inline"
                selectedKeys={[selectedKey]}
                defaultOpenKeys={openKeys}
                items={arrayMenu}
            />
        </Layout.Sider>

    );
}


export default LeftMenu;


