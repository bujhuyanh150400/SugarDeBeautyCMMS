import Layout from "@/Layouts/index.jsx";
import {useForm} from "@inertiajs/react";
import {
    Button,
    Form,
    SelectPicker,
} from "rsuite";
import constant from "@/utils/constant.js";
import EditIcon from '@rsuite/icons/Edit';


const Edit = (props) => {
    const {facility} = props;
    const {data, setData, patch, errors} = useForm({
        name: facility.name,
        address: facility.address,
        active: facility.active,
    });
    const submit = async () => {
        await patch(route('facilities.edit',{facility_id: facility.id}), data);
    }
    return (
        <Layout back_to={route('facilities.list')}>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tên cơ sở</Form.ControlLabel>
                        <Form.Control
                            name="name" id="name"
                            onChange={(value) => setData('name', value)} value={data.name}
                            placeholder="Tên cơ sở"
                            errorMessage={errors.name}
                        />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Địa chỉ cơ sở</Form.ControlLabel>
                        <Form.Control
                            name="address" id="address"
                            onChange={(value) => setData('address', value)} value={data.address}
                            placeholder="Địa chỉ cơ sở"
                            errorMessage={errors.address}
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
                <div className="flex items-center justify-end">
                    <Button type="submit"  appearance="primary" color="green" startIcon={<EditIcon/>}>
                        Sửa cơ sở</Button>
                </div>
            </Form>
        </Layout>
    )
}

export default Edit
