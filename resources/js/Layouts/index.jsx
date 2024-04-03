import {Layout as LayoutAntd } from 'antd';
import LeftMenu from "@/Layouts/LeftMenu.jsx";
import Header from "@/Layouts/Header.jsx";
const {Content} = LayoutAntd;

const LayoutCMMS = ({children}) => {
    return (
        <LayoutAntd hasSider>
            <LeftMenu/>
            <LayoutAntd>
                <Header/>
                <Content className="p-4">
                    <div className="bg-white p-4 shadow-sm rounded-md min-h-full">
                        {children}
                    </div>
                </Content>
            </LayoutAntd>
        </LayoutAntd>
    );
}
export default LayoutCMMS;
