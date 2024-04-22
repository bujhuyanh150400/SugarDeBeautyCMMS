import LayoutCMMS from "@/Layouts/index.jsx";
import {router, useForm} from "@inertiajs/react";
import Editor from "@/Components/Editor.jsx";
import dayjs from "dayjs";

const AddUser = (props) => {
    const {facilities, specialties} = props;
    const permissions = Object.values(props.auth.permission);
    const {data, setData, post, processing, errors} = useForm({
        name: '',
        email: '',
        password: '',
        birth: null,
        avatar: null,
        gender: '',
        phone: '',
        address: '',
        description: '',
        permission: '',
        facility_id: '',
        specialties_id: '',
    })
    const submit = async () => {
        await post('/user/add', data);
    }
    return (
        <></>
    )
}
export default AddUser
