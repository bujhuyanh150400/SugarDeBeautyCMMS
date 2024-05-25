import Layout from "@/Layouts/index.jsx";
import {useState} from "react";
import {router} from "@inertiajs/react";

const List = (props) => {
    let {facilities, list_day_off} = props;
    const [filter, setFilter] = useState({
        keyword: '',
        start_date: '',
        facility: '',
        end_date: '',
    })
    const handleChangeFilter = (key, value) => {
        setFilter(values => ({
            ...values,
            [key]: value,
        }))
    }
    const optionsRouter = {
        replace: true,
        preserveState: true,
        only: ['list_day_off']
    }
    const handlePagination = async (page) => {
        await router.get(route('dayoff.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('dayoff.list'), filter, optionsRouter);
    }
    return (
        <Layout>
            test123
        </Layout>
    )
}

export default List;
