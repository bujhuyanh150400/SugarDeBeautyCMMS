import Layout from "@/Layouts/index.jsx";
import {router, useForm} from "@inertiajs/react";
import {
    Button,
    DateInput,
    DatePicker,
    DateRangePicker,
    Form,
    Input,
    InputNumber,
    Message,
    SelectPicker,
    Text
} from "rsuite";
import constant from "@/utils/constant.js";
import Editor from "@/Components/Editor.jsx";
import PlusIcon from "@rsuite/icons/Plus.js";
import HelperFunction from "@/utils/HelperFunction.js";
import {useState} from "react";


const currentDate = new Date();
const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
const initStateForm = {
    type: '',
    money: 0,
    payoff_at: defaultStartDate,
    description: '',
    user_id: '',
}
const Add = (props) => {
    const {users, errors, payoffStatus} = props
    const [data, setData] = useState(initStateForm)
    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}))
    const submit = async () => {
        await router.post(route('payoff.add'), {
            ...data,
            payoff_at: HelperFunction.convertDateTime(data.payoff_at)
        });
    }
    return (
        <Layout back_to={route('payoff.list')}>
            <Message className={`mb-8`} type="warning" showIcon>
                <strong>Lưu ý!</strong> Đơn thưởng phạt 1 khi tạo sẽ không được sửa hoặc xoá, <strong>Hãy chú ý nhập
                đúng dữ liệu</strong> !
            </Message>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
                    <Form.Group controlId="user_id">
                        <Form.ControlLabel>Nhân viên tiếp nhận</Form.ControlLabel>
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
                            name="user_id"
                            searchable={true}
                            id="user_id"
                            placeholder="Nhân viên nghỉ phép"/>
                        <Form.ErrorMessage show={!!errors.user_id}>{errors.user_id}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="payoff_at">
                        <Form.ControlLabel>Ngày tiếp nhận</Form.ControlLabel>
                        <DatePicker
                            block={true}
                            name="payoff_at"
                            id="payoff_at"
                            oneTap
                            isoWeek={true}
                            showWeekNumbers={true}
                            format={`dd-MM-yyyy`}
                            defaultValue={data.payoff_at}
                            value={data.payoff_at}
                            onChange={(value_date) => {
                                setForm('payoff_at', value_date);
                            }}/>
                        <Form.ErrorMessage show={!!errors.payoff_at}>{errors.payoff_at}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.ControlLabel>Là đơn</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={Object.values(payoffStatus).map(status => ({
                                label: status.text,
                                value: status.value
                            }))}
                            value={data.type}
                            onChange={(value) => setForm('type', value)}
                            name="type"
                            searchable={false}
                            id="type"
                            placeholder="Đơn thưởng hoặc phạt"/>
                        <Form.ErrorMessage show={!!errors.type}>{errors.type}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="money">
                        <Form.ControlLabel>Số tiền</Form.ControlLabel>
                        <InputNumber
                            name="money" id="money"
                            min={0}
                            formatter={HelperFunction.toThousands}
                            value={data.money}
                            onChange={(value) => setForm('money', value * 1)}
                            postfix="VND"/>
                        <Form.ErrorMessage show={!!errors.money}>{errors.money}</Form.ErrorMessage>
                    </Form.Group>
                </div>
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
                        Tạo đơn</Button>
                </div>
            </Form>
        </Layout>
    )
}
export default Add;
