import {Button, Col, DatePicker, Form, Input, Row, Select, InputNumber} from "antd";
import LayoutCMMS from "@/Layouts/index.jsx";
import {PlusOutlined} from "@ant-design/icons";
import {router, useForm} from "@inertiajs/react";
import Editor from "@/Components/Editor.jsx";
import PreviewImage from "@/Components/PreviewImage.jsx";
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
        console.log(errors)
    }
    return (
        <LayoutCMMS title={props.title} back_to="/user/list">
            <Form
                layout="vertical"
                name="basic"
                onFinish={submit}
                autoComplete="off"
            >
                <Row wrap={true} gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="name"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nhập họ và tên"/>
                        </Form.Item>
                        <Form.Item
                            label="Email của nhân viên"
                            name="email"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                        >
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="example@email.com"/>
                        </Form.Item>
                        <Form.Item
                            label="SĐT của nhân viên"
                            name="phone"
                            validateStatus={errors.phone ? 'error' : ''}
                            help={errors.phone}
                        >
                            <Input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Nhập SDT nhân viên"/>
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password}
                        >
                            <Input.Password
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="HASH PASSWORD"/>
                        </Form.Item>
                        <Form.Item
                            label="Ngày sinh của nhân viên"
                            name="birth"
                            validateStatus={errors.birth ? 'error' : ''}
                            help={errors.birth}
                        >
                            <DatePicker
                                style={{
                                    width: "100%"
                                }}
                                value={data.birth}
                                onChange={(value) => setData('birth', dayjs(value).format('YYYY-MM-DD'))}
                                format="DD/MM/YYYY"
                                placeholder=""/>
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ của nhân viên"
                            name="address"
                            validateStatus={errors.address ? 'error' : ''}
                            help={errors.address}
                        >
                            <Input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Nhập Địa chỉ"/>
                        </Form.Item>
                        <Row wrap={true} gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label="Giới tính"
                                    name="gender"
                                    validateStatus={errors.gender ? 'error' : ''}
                                    help={errors.gender}
                                >
                                    <Select
                                        placeholder="Chọn giới tính"
                                        value={data.gender}
                                        onChange={(value) => setData('gender', value)}
                                        options={[
                                            {
                                                value: 1,
                                                label: 'Nam'
                                            },
                                            {
                                                value: 2,
                                                label: 'Nữ'
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Cơ sở làm việc"
                                    name="facility_id"
                                    validateStatus={errors.facility_id ? 'error' : ''}
                                    help={errors.facility_id}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn cơ sở"
                                        value={data.facility_id}
                                        onChange={(value) => setData('facility_id', value)}
                                        filterOption={(input, option) => {
                                            return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
                                        }}
                                        options={[
                                            {
                                                value: '',
                                                label: 'Lựa chọn'
                                            },
                                            ...facilities.map((facility) => {
                                                return {
                                                    value: facility.id,
                                                    label: `${facility.name} - ${facility.address}`
                                                }
                                            })
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Kỹ thuật chuyên môn"
                                    name="specialties_id"
                                    validateStatus={errors.specialties_id ? 'error' : ''}
                                    help={errors.specialties_id}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Kỹ thuật"
                                        value={data.specialties_id}
                                        onChange={(value) => setData('specialties_id', value)}
                                        filterOption={(input, option) => {
                                            return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
                                        }}
                                        options={[
                                            {
                                                value: '',
                                                label: 'Lựa chọn'
                                            },
                                            ...specialties.map((specialty) => {
                                                return {
                                                    value: specialty.id,
                                                    label: `${specialty.name}`
                                                }
                                            })
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Phân quyền"
                                    name="permission"
                                    validateStatus={errors.permission ? 'error' : ''}
                                    help={errors.permission}
                                >
                                    <Select
                                        placeholder="Phân quyền"
                                        value={data.permission}
                                        onChange={(value) => setData('permission', value)}
                                        options={[
                                            {
                                                value: '',
                                                label: 'Lựa chọn'
                                            },
                                            ...permissions.map((permission) => {
                                                return {
                                                    value: permission.value,
                                                    label: `${permission.text}`
                                                }
                                            })
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ảnh đại diện"
                            name="avatar"
                            validateStatus={errors.avatar ? 'error' : ''}
                            help={errors.avatar}
                        >
                            <PreviewImage
                                setFile={(file) => setData('avatar', file)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả về bản thân"
                            name="description"
                            validateStatus={errors.description ? 'error' : ''}
                            help={errors.description}
                        >
                            <Editor
                                data={data.description}
                                onChange={(event, editor) => {
                                    setData('description', editor.getData())
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button htmlType="submit" type="primary" icon={<PlusOutlined/>}>Tạo nhân viên mới</Button>
                    </Col>
                </Row>
            </Form>
        </LayoutCMMS>
    )
}
export default AddUser
