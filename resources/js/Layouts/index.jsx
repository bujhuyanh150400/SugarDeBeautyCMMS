import LeftMenu from "@/Layouts/LeftMenu.jsx";
import Header from "@/Layouts/Header.jsx";
import {Head, router, usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import Constant from "@/utils/constant.js";
import {openToast} from "@/redux/reducers/ToastSlice.js";
import {v4 as uuidv4} from "uuid";
import {useDispatch} from "react-redux";
import {
    Checkbox, Container,
    Icon,
    Menu, MenuItem,
    Segment,
    Sidebar,
    SidebarPushable,
    SidebarPusher
} from "semantic-ui-react";
const LayoutCMMS = ({children,title,back_to}) => {
    const flashMessage = usePage().props.flash
    useEffect(() => {

    }, [flashMessage]);
    const [visible, setVisible] = useState(false)
    return (
           <SidebarPushable className="h-screen">
               <Head title={title ?? "CMMS admin"}/>
               <Sidebar
                   as={Menu}
                   animation='push'
                   icon='labeled'
                   inverted
                   onHide={() => setVisible(false)}
                   vertical
                   visible={visible}
                   width='thin'
               >
                   <LeftMenu />
               </Sidebar>
               <SidebarPusher>
                   <Container >
                       <Header/>
                       <Checkbox
                           checked={visible}
                           label={{ children: <code>visible</code> }}
                           onChange={(e, data) => setVisible(data.checked)}
                       />
                       {children}
                   </Container>
               </SidebarPusher>
           </SidebarPushable>
    );
}
export default LayoutCMMS;
