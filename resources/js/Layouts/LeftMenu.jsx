import {
    DashboardOutlined, UserOutlined,
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import {useSelector} from "react-redux";
import {v4 as uuid} from 'uuid';
import {Link, router} from '@inertiajs/react';

const {Sider} = Layout;

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
            label: <Link to={`${link}`}>{label}</Link>,
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
    setMenu.itemMenu('Dashboard', '/', <DashboardOutlined/>),
    setMenu.subMenu('Nhân sự', <UserOutlined/>, [
        setMenu.itemMenu('Quản lý nhân sự', '/ManagerUsers'),
    ])
];


const LeftMenu = () => {
    const location = router().current();
    /**
     * Hàm đệ quy để tìm kiếm MenuItem tương ứng với đường dẫn hiện tại
     * @param {array} itemMenu
     * @return {{selectedKey: null, openKeys: *[]}|{selectedKey: *, openKeys: *[]}}
     */
    const findLocation = (itemMenu) => {
        let selectedKey = null;
        let openKeys = [];
        for (const menuItem of itemMenu) {
            if (menuItem.link === location.pathname) {
                selectedKey = menuItem.key;
                openKeys.push(menuItem.key);
                return { selectedKey, openKeys };
            } else if (menuItem.children && menuItem.children.length > 0) {
                const { selectedKey: childSelectedKey, openKeys: childOpenKeys } = findLocation(menuItem.children);
                if (childSelectedKey) {
                    selectedKey = childSelectedKey;
                    openKeys = openKeys.concat(menuItem.key, childOpenKeys);
                    return { selectedKey, openKeys };
                }
            }
        }
        return { selectedKey, openKeys };
    };
    const { selectedKey, openKeys } = findLocation(itemMenu);
    const statusMenu = useSelector(state => state.app.collapsedMenu);
    return (
        <Sider trigger={null} collapsible collapsed={statusMenu}>
            <Menu className="sticky top-0 left-0 bottom-0  h-screen"
                  theme="light"
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  defaultOpenKeys={openKeys}
                  items={itemMenu}
            />
        </Sider>

    );
}


export default LeftMenu;


