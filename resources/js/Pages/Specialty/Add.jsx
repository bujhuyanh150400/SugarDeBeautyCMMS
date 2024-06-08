import Layout from "@/Layouts/index.jsx";
import {useForm} from "@inertiajs/react";
import {
    Button,
    Form,
    SelectPicker, Text,
} from "rsuite";
import constant from "@/utils/constant.js";
import PlusIcon from "@rsuite/icons/Plus.js";
import Editor from "@/Components/Editor.jsx";
import {v4 as uuidv4} from 'uuid';

const Add = () => {
    const {data, setData, post, errors} = useForm({
        name: '',
        description: '',
        active: '',
        service: {},
    });

    const addService = () => {
        setData("service", {...data.service, [uuidv4()]: {title: '', money: '', percent: '',}})
    }
    console.log(data)
    const submit = async () => {
        await post(route('specialties.add'), data);
    }
    return (
        <Layout back_to={route('specialties.list')}>
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
                <div className="mt-12   ">
                    <Text size={'lg'} weight={'semibold'}>Dịch vụ của chuyên môn</Text>
                    <Button className={`my-4`} size={'sm'} onClick={addService} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm</Button>
                    <div className={`flex flex-col gap-2`}>
                        {data.service.length > 0 && Object.entries(data.service).map(([uid, service]) => (
                            <div>

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
