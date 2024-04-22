import LayoutCMMS from "@/Layouts/index.jsx";
import {router, useForm, usePage} from "@inertiajs/react";
import {v4 as uuid} from 'uuid';
import {useEffect, useState} from "react";

const List = (props) => {
    let {facilities, query = null, users} = props;
    query = query || {};
    const permissions = Object.values(props.auth.permission);
    const setQueryChange = async (name, value) => {
        if (value) {
            query[name] = value;
        } else {
            delete query[name];
        }

    };
    const handlePagination = async (pagination) => {
        await router.get('/user/list', {
            page: pagination.current,
            ...query
        }, {
            replace: true,
            preserveState: true,
            preserveScroll: true,
            only: ['users']
        });
    }
    const filterForm = async () => {
        await router.get('/user/list', {
            ...query
        }, {
            replace: true,
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    }
    return (
        <></>
    )
}

export default List
