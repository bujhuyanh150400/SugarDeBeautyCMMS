import {setCollapsedMenu} from "@/redux/reducers/AppSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {v4 as uuid} from 'uuid';
import {useState} from "react";
import {router, usePage} from "@inertiajs/react";


const HeaderAdmin = () => {
    const dispatch = useDispatch();
    const page = usePage();
    const currentUser = page.props.auth.user;
    const statusMenu = useSelector(state => state.app.collapsedMenu);
    const handleLogout = async () => {

    }
    return (
        <></>
    );
}

export default HeaderAdmin;


