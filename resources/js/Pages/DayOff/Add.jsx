import Layout from "@/Layouts/index.jsx";
import {router, useForm} from "@inertiajs/react";
import {Button, DateInput, DateRangePicker, Form, Input, SelectPicker} from "rsuite";
import constant from "@/utils/constant.js";
import Editor from "@/Components/Editor.jsx";
import PlusIcon from "@rsuite/icons/Plus.js";
import HelperFunction from "@/utils/HelperFunction.js";
import {useState} from "react";


const currentDate = new Date();
const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
const defaultEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0, 0);

const initStateForm = {
    user_id: '',
    title: '',
    description: '',
    start_date: defaultStartDate,
    end_date: defaultEndDate,
}

const Add = (props) => {
    const {users, errors} = props


    const [data, setData] = useState(initStateForm)

    const setForm = (key, value) =>  setData((prevState) => ({...prevState, [key]: value}))

    const submit = async () => {
        await router.post(route('dayoff.add'), {
            ...data,
            start_date: HelperFunction.convertDateTime(data.start_date),
            end_date: HelperFunction.convertDateTime(data.end_date)
        });
    }
    return (
        <Layout back_to={route('dayoff.list')}>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <Form.Group controlId="user">
                        <Form.ControlLabel>Nhân viên xin nghỉ</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...users.map(user => ({
                                    label: `${user.name} - ${user.facility.name} - ${user.specialties.name}`,
                                    value: user.id
                                }))
                            ]}
                            value={data.user_id}
                            onChange={(value) => setForm('user_id', value)}
                            name="user"
                            searchable={true}
                            id="user"
                            placeholder="Nhân viên nghỉ phép"/>
                        <Form.ErrorMessage show={!!errors.user_id}>{errors.user_id}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="day_off">
                        <Form.ControlLabel>Ngày bắt đầu nghỉ</Form.ControlLabel>
                        <DateRangePicker
                            block={true}
                            name="day_off"
                            id="day_off"
                            appearance={`subtle`}
                            isoWeek={true}
                            showWeekNumbers={true}
                            format={`dd-MM-yyyy`}
                            defaultValue={[data.start_date, data.end_date]}
                            value={[data.start_date, data.end_date]}
                            onChange={(value_date) => {
                                if (value_date) {
                                    setForm('start_date', value_date[0]);
                                    setForm('end_date', value_date[1])
                                }else {
                                    setForm('start_date', defaultStartDate);
                                    setForm('end_date', defaultEndDate);
                                }

                            }}/>
                        <Form.ErrorMessage show={!!errors.start_date}>{errors.start_date}</Form.ErrorMessage>
                        <Form.ErrorMessage show={!!errors.end_date}>{errors.end_date}</Form.ErrorMessage>
                    </Form.Group>
                </div>
                <Form.Group controlId="title">
                    <Form.ControlLabel>Tiêu đề nghỉ phép</Form.ControlLabel>
                    <Form.Control
                        name="title" id="title"
                        onChange={(value) => setForm('title', value)} value={data.title}
                        placeholder="Tiêu đề nghỉ phép (tối đa 255 kí tự)"
                        errorMessage={errors.title}
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.ControlLabel>Mô tả</Form.ControlLabel>
                    <Editor data={data.description} onChange={(event, editor) => {
                        let value = editor.getData();
                        setForm('description', value);
                    }}/>
                    <Form.ErrorMessage show={!!errors.description}>{errors.description}</Form.ErrorMessage>
                </Form.Group>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green" startIcon={<PlusIcon/>}>
                        Tạo đơn nghỉ phép</Button>
                </div>
            </Form>
        </Layout>
    )
}
export default Add;
