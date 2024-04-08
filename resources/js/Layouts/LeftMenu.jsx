import {
    DashboardOutlined, UserOutlined,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import {useSelector} from "react-redux";
import {v4 as uuid} from 'uuid';
import {Link, usePage} from '@inertiajs/react';


const setMenu = {
    /**
     * @description Item Menu: Dùng để set item menu ( ko có sub menu)
     * @param {string} label
     * @param {string} link
     * @param {JSX.Element} icon
     * @param {boolean} disabled
     * @return {{icon: string, disabled: boolean, label: JSX.Element, key}}
     */
    itemMenu: (label, link, icon = '', disabled = false) => {
        return {
            label: <Link replace href={`/${link}`}>{label}</Link>,
            key: uuid(),
            icon,
            disabled,
            link
        }
    },
    /**
     * @description sub Menu: Dùng để set sub menu ( có menu con), còn nếu muốn label ko thì chỉ điền label
     * @param {string} label
     * @param {JSX.Element} icon
     * @param {array}children
     * @return {{children: *[], icon: string, label: string, type: string, key: string}}
     */
    subMenu: (label = '', icon = '', children = []) => {
        return {
            type: '',
            label,
            key: uuid(),
            icon,
            children
        }
    },
};

const itemMenu = [
    setMenu.itemMenu('Dashboard', '', <DashboardOutlined/>),
    setMenu.subMenu('Nhân sự', <UserOutlined/>, [
        setMenu.itemMenu('Quản lý nhân sự', 'user/list'),
        setMenu.itemMenu('Quản lý cơ sở', 'facilities/list'),
        setMenu.itemMenu('Quản lý chuyên môn', 'specialties/list'),
    ])
];


const LeftMenu = () => {
    const page = usePage();
    const parentPath = page.url.split('/').splice(1,2).shift();
    /**
     * Hàm đệ quy để tìm kiếm MenuItem tương ứng với đường dẫn hiện tại
     * @param {array} itemMenu
     * @return {{selectedKey: null, openKeys: *[]}|{selectedKey: *, openKeys: *[]}}
     */
    const findLocation = (itemMenu) => {
        let selectedKey = null;
        let openKeys = [];
        for (const menuItem of itemMenu) {
            let urlPathParent = menuItem.link ?  menuItem.link.split('/').shift() : ''
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
    };
    const {selectedKey, openKeys} = findLocation(itemMenu);
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
                items={itemMenu}
            />
        </Layout.Sider>

    );
}


export default LeftMenu;


