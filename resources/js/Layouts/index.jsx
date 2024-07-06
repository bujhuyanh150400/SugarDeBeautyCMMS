import LeftMenu from "@/Layouts/LeftMenu.jsx";
import HeaderAdmin from "@/Layouts/Header.jsx";
import {usePage} from "@inertiajs/react";
import { useSelector} from "react-redux";
import {Container, Content, Placeholder, CustomProvider} from "rsuite";
import {useEffect} from "react";
import toast from "react-hot-toast";

const Layout = ({children,back_to,className,hiddenHeader = false, hiddenLeftMenu = false}) => {
    const flashMessage = usePage().props.flash;
    useEffect(()=>{
        if (flashMessage.success || flashMessage.error || flashMessage.warning || flashMessage.info) {
            if (flashMessage.success) {
                toast.success(flashMessage.success)
            } else if (flashMessage.error) {
                toast.error(flashMessage.error)
            } else if (flashMessage.warning) {
                toast(flashMessage.warning,{
                    icon: <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 576 512"><path fill="#FFD43B" d="M569.5 440C588 472 564.8 512 527.9 512H48.1c-36.9 0-60-40.1-41.6-72L246.4 24c18.5-32 64.7-32 83.2 0l239.9 416zM288 354c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46zm-43.7-165.3l7.4 136c.3 6.4 5.6 11.3 12 11.3h48.5c6.4 0 11.6-5 12-11.3l7.4-136c.4-6.9-5.1-12.7-12-12.7h-63.4c-6.9 0-12.4 5.8-12 12.7z"/></svg>,
                })
            } else if (flashMessage.info) {
                toast(flashMessage.info,{
                    icon:<svg xmlns="http://www.w3.org/2000/svg" height="20" width="7.5" viewBox="0 0 192 512"><path fill="#74C0FC" d="M20 424.2h20V279.8H20c-11 0-20-9-20-20V212c0-11 9-20 20-20h112c11 0 20 9 20 20v212.2h20c11 0 20 9 20 20V492c0 11-9 20-20 20H20c-11 0-20-9-20-20v-47.8c0-11 9-20 20-20zM96 0C56.2 0 24 32.2 24 72s32.2 72 72 72 72-32.2 72-72S135.8 0 96 0z"/></svg>
                })
            }
        }
    },[flashMessage]);
    const darkTheme = useSelector(state => state.app.darkTheme);

    useEffect(() => {
        if (darkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkTheme]);

    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"} >
            <Container>
                {hiddenLeftMenu === false && <LeftMenu />}
                <Container>
                    {hiddenHeader === false && <HeaderAdmin back_to={back_to}/>}
                    <Content  className={`${className} p-4`}>
                        {children}
                    </Content>
                </Container>
            </Container>
        </CustomProvider>
    );
}
export default Layout;
