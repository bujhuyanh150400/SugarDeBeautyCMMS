import Layout from "@/Layouts/index.jsx";
import {router, usePage} from "@inertiajs/react";
import {
    Button,
    Form, IconButton, InputNumber,
    SelectPicker, Text
} from "rsuite";
import {Icon} from '@rsuite/icons';
import constant from "@/utils/constant.js";
import EditIcon from '@rsuite/icons/Edit';
import Editor from "@/Components/Editor.jsx";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import _ from "lodash";
import HelperFunction from "@/utils/HelperFunction.js";
import TrashIcon from "@rsuite/icons/Trash.js";
import PlusIcon from "@rsuite/icons/Plus";
import Swal from "sweetalert2";
import SaveIcon from "@/assets/icons/save-fontawsome.svg"

const Edit = (props) => {
    const {specialty, errors} = props;
    const [data, setData] = useState({
        name: specialty.name,
        description: specialty.description,
        active: specialty.active,
        service: {},
    });
    const initService = specialty.service.reduce((acc, service) => {
        acc[service.id] = service;
        return acc;
    }, {});
    let page = usePage();
    useEffect(() => {
        setServices(initService)
    }, [specialty])
    const [services, setServices] = useState(initService);
    const setDataService = (id, field, value) => setServices((prevState) => ({
        ...prevState,
        [id]: {...prevState[id], [field]: value}
    }));
    const optionsRouter = {
        replace: true,
        preserveState: true,
        preserveScroll: true
    }
    const handleDeleteService = (service_id) => {
        Swal.fire({
            title: 'Bạn có muốn xoá dịch vụ này',
            text: 'Bạn có chắc chắn muốn làm điều này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, tôi chắc chắn!',
            cancelButtonText: 'Không, hủy bỏ!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('specialties.deleted_service', {service_id}), optionsRouter)
            }
        });
    }
    const handleUpdateService = (service_id) => {
        Swal.fire({
            title: 'Bạn có muốn sửa dịch vụ này',
            text: 'Bạn có chắc chắn muốn làm điều này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, tôi chắc chắn!',
            cancelButtonText: 'Không, hủy bỏ!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(route('specialties.edit_service',{service_id}),services[service_id] , optionsRouter);
            }
        });
    }
    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}));
    const addNewService = () => {
        setForm("service", {...data.service, [uuidv4()]: {title: '', money: 0, percent: 0,}})
    }
    const handleNewServiceChange = (id, field, value) => {
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
    const submit = async () => {
        await router.patch(route('specialties.edit', {specialty_id: specialty.id}), data);
    }
    return (
        <Layout>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tên cơ sở</Form.ControlLabel>
                        <Form.Control
                            name="name" id="name"
                            onChange={(value) => setData('name', value)} value={data.name}
                            placeholder="Tên chuyên môn"
                            errorMessage={errors.name}
                        />
                    </Form.Group>
                    <Form.Group controlId="active">
                        <Form.ControlLabel>Trạng thái hoạt động</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={constant.ActiveStatus}
                            value={data.active}
                            onChange={(value) => setData('active', value)}
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
                        setData('description', value);
                    }}/>
                    <Form.ErrorMessage show={!!errors.description}>{errors.description}</Form.ErrorMessage>
                </Form.Group>
                <div className="space-y-4">
                    <Text  size={'lg'} weight={'semibold'}>Dịch vụ hiện tại của chuyên môn</Text>
                    {_.size(services) > 0 && _.map(services, (service, id) => (
                        <div className={`grid grid-cols-4 gap-4`} key={id}>
                            <Form.Group controlId={`service-money-${id}`}>
                                <Form.ControlLabel>Tên dịch vụ</Form.ControlLabel>
                                <Form.Control
                                    name={`service-title-${id}`} id={`service-title-${id}`}
                                    onChange={(value) => setDataService(id, 'title', value)}
                                    value={services[id].title}
                                    placeholder="Tên chuyên môn"
                                />
                            </Form.Group>
                            <Form.Group controlId={`service-money-${id}`}>
                                <Form.ControlLabel>Số tiền mỗi dịch vụ</Form.ControlLabel>
                                <InputNumber
                                    block
                                    postfix="VND"
                                    formatter={HelperFunction.toThousands}
                                    value={services[id].money}
                                    onChange={(value) => setDataService(id, 'money', value)}
                                    name={`service-money-${id}`}
                                    id={`service-money-${id}`}
                                    placeholder="Số tiền"/>
                            </Form.Group>
                            <Form.Group controlId={`service-percent-${id}`}>
                                <Form.ControlLabel>% hoa hồng</Form.ControlLabel>
                                <InputNumber
                                    block
                                    min={0}
                                    max={100}
                                    postfix="%"
                                    formatter={HelperFunction.toThousands}
                                    value={services[id].percent}
                                    onChange={(value) => setDataService(id, 'percent', value)}
                                    name={`service-percent-${id}`}
                                    id={`service-percent-${id}`}
                                    placeholder="% hoa hồng"/>
                            </Form.Group>
                            <div className={`self-center flex gap-2`}>
                                <IconButton color={`blue`} appearance={`primary`}
                                            icon={<img src={SaveIcon} alt="Save" className={`w-5 h-5 text-white`}/>}
                                            onClick={() => handleUpdateService(id)}/>
                                <IconButton color={`red`} appearance={`primary`} icon={<TrashIcon/>}
                                            onClick={() => handleDeleteService(id)}/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="my-8">
                    <Text size={'lg'} weight={'semibold'}>Thêm dịch vụ mới</Text>
                    <Button className={`my-4`} size={'sm'} onClick={addNewService} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm</Button>
                    <div className={`flex flex-col gap-2 mt-4`}>
                        {_.size(data.service) > 0 && _.map(data.service, (service, id) => (
                            <div className={`grid grid-cols-4 gap-4`} key={id}>
                                <Form.Group controlId={`service-money-${id}`}>
                                    <Form.ControlLabel>Tên dịch vụ</Form.ControlLabel>
                                    <Form.Control
                                        name={`service-title-${id}`} id={`service-title-${id}`}
                                        onChange={(value) => handleNewServiceChange(id, 'title', value)}
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
                                        block
                                        postfix="VND"
                                        formatter={HelperFunction.toThousands}
                                        value={data.service[id].money}
                                        onChange={(value) => handleNewServiceChange(id, 'money', value)}
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
                                        block
                                        min={0}
                                        max={100}
                                        postfix="%"
                                        formatter={HelperFunction.toThousands}
                                        value={data.service[id].percent}
                                        onChange={(value) => handleNewServiceChange(id, 'percent', value)}
                                        name={`service-percent-${id}`}
                                        id={`service-percent-${id}`}
                                        placeholder="% hoa hồng"/>
                                    <Form.ErrorMessage show={!!errors?.[`service.${id}.percent`]}>
                                        {errors?.[`service.${id}.percent`] ?? ''}
                                    </Form.ErrorMessage>
                                </Form.Group>
                                <div className={`self-center`}>
                                    <IconButton color={`red`} appearance={`primary`} icon={<TrashIcon/>}
                                                onClick={() => handleDeleteService(id)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green" startIcon={<EditIcon/>}>
                        Lưu</Button>
                </div>
            </Form>
        </Layout>
    )
}

export default Edit
