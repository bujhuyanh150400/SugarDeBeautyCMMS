import {useSelector} from "react-redux";
import {Link, usePage} from '@inertiajs/react';
import {
    Icon,
    MenuItem,
} from "semantic-ui-react";
import {useState} from "react";
const LeftMenu = () => {
    const page = usePage();
    const parentPath = page.url.split('/').splice(1, 2).shift();
    const menu = page.props.auth.menu;
    console.log(menu);
    const statusMenu = useSelector(state => state.app.collapsedMenu);


    return (
        <>
            <MenuItem as='a'>
                <Icon name='home' />
                Home
            </MenuItem>
            <MenuItem as='a'>
                <Icon name='gamepad' />
                Games
            </MenuItem>
            <MenuItem as='a'>
                <Icon name='camera' />
                Channels
            </MenuItem>
        </>
    );
}


export default LeftMenu;


