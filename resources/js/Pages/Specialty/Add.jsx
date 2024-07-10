import Layout from "@/Layouts/index.jsx";
import {router, useForm} from "@inertiajs/react";
import {
    Button,
    Form, IconButton, InputNumber, Panel,
    SelectPicker, Text,
} from "rsuite";
import constant from "@/utils/constant.js";
import PlusIcon from "@rsuite/icons/Plus.js";
import Editor from "@/Components/Editor.jsx";
import {v4 as uuidv4} from 'uuid';
import {useState} from "react";
import _ from "lodash";
import HelperFunction from "@/utils/HelperFunction.js";
import TrashIcon from '@rsuite/icons/Trash';
import Swal from 'sweetalert2'
const Add = (props) => {
    const {errors} = props;
    const [data, setData] = useState({
        name: '',
        description: '',
        active: '',
        service: {},
    })
    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}))
    const addService = () => {
        setForm("service", {...data.service, [uuidv4()]: {title: '', money: 0, percent: 0,}})
    }
    const handleServiceChange = (id, field, value) => {
        setData((prevState) => ({
            ...prevState,
            service: {
                ...prevState.service,
                [id]: {
                    ...prevState.service[id],
                    [field]: value,
                },
            },
        }));
    };
    // Hàm xử lý xóa
    const handleDeleteService = (id) => {
        const updatedServices = {...data.service};
        delete updatedServices[id];
        setData((prevData) => ({
            ...prevData,
            service: updatedServices,
        }));
    };
    const submit = async () => {
        await router.post(route('specialties.add'), data);
    }
    return (
        <Layout>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tên chuyên môn</Form.ControlLabel>
                        <Form.Control
                            name="name" id="name"
                            onChange={(value) => setForm('name', value)} value={data.name}
                            placeholder="Tên chuyên môn"
                            errorMessage={errors.name}
                        />
                    </Form.Group>
                    <Form.Group controlId="active">
                        <Form.ControlLabel>Trạng thái hoạt động</Form.ControlLabel>
                        <SelectPicker
                            data={constant.ActiveStatus}
                            value={data.active}
                            onChange={(value) => setForm('active', value)}
                            name="active"
                            searchable={false}
                            id="active"
                            placeholder="Trạng thái hoạt động"/>
                        <Form.ErrorMessage show={!!errors.active}>{errors.active}</Form.ErrorMessage>
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
                <div className="my-8">
                    <Text size={'lg'} weight={'semibold'}>Dịch vụ của chuyên môn</Text>
                    <Button className={`my-4`} size={'sm'} onClick={addService} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm</Button>
                    <div className={`flex flex-col gap-2 mt-4`}>
                        {_.size(data.service) > 0 && _.map(data.service, (service, id) => (
                            <div className={`grid grid-cols-4 gap-4`} key={id}>
                                <Form.Group controlId={`service-money-${id}`}>
                                    <Form.ControlLabel>Tên dịch vụ</Form.ControlLabel>
                                    <Form.Control
                                        name={`service-title-${id}`} id={`service-title-${id}`}
                                        onChange={(value) => handleServiceChange(id, 'title', value)}
                                        value={data.service[id].title}
                                        placeholder="Tên chuyên môn"
                                    />
                                    <Form.ErrorMessage show={!!errors?.[`service.${id}.title`]}>
                                        {errors?.[`service.${id}.title`] ?? ''}
                                    </Form.ErrorMessage>
                                </Form.Group>
                                <Form.Group controlId={`service-money-${id}`}>
                                    <Form.ControlLabel>Số tiền mỗi dịch vụ</Form.ControlLabel>
                                    <InputNumber
                                        postfix="VND"
                                        formatter={HelperFunction.toThousands}
                                        value={data.service[id].money}
                                        onChange={(value) => handleServiceChange(id, 'money', value)}
                                        name={`service-money-${id}`}
                                        id={`service-money-${id}`}
                                        placeholder="Số tiền"/>
                                    <Form.ErrorMessage show={!!errors?.[`service.${id}.money`]}>
                                        {errors?.[`service.${id}.money`] ?? ''}
                                    </Form.ErrorMessage>
                                </Form.Group>
                                <Form.Group controlId={`service-percent-${id}`}>
                                    <Form.ControlLabel>% hoa hồng</Form.ControlLabel>
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        postfix="%"
                                        formatter={HelperFunction.toThousands}
                                        value={data.service[id].percent}
                                        onChange={(value) => handleServiceChange(id, 'percent', value)}
                                        name={`service-percent-${id}`}
                                        id={`service-percent-${id}`}
                                        placeholder="% hoa hồng"/>
                                    <Form.ErrorMessage show={!!errors?.[`service.${id}.percent`]}>
                                        {errors?.[`service.${id}.percent`] ?? ''}
                                    </Form.ErrorMessage>
                                </Form.Group>
                                <div className={`self-center`}>
                                    <IconButton color={`red`} appearance={`primary`} icon={<TrashIcon/>} onClick={() => handleDeleteService(id)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green" startIcon={<PlusIcon/>}>
                        Tạo chuyên môn mới</Button>
                </div>
            </Form>
        </Layout>
    )
}
export default Add
