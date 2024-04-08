import LayoutCMMS from "@/Layouts/index.jsx";
import {Button, Form, Input, Col, Row, Select, Collapse, Flex, Typography, Table, Avatar} from "antd";
import {router, useForm} from "@inertiajs/react";
import {
    DeleteOutlined,
    EditOutlined,
    MenuOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined
} from "@ant-design/icons";
import {v4 as uuid} from 'uuid';
import {useEffect, useState} from "react";

const List = (props) => {
    const {facilities,filter, users} = props;
    const permissions = Object.values(props.auth.permission);
    const [dataFilter,setDataFilters] = useState({
        keyword:'',
        facility:'',
        permission: '',
    });
    useEffect(() => {
        let updatedFilters = {};
        if (filter.keyword) {
            updatedFilters = { ...updatedFilters, keyword: filter.keyword };
        }
        if (filter.facility) {
            updatedFilters = { ...updatedFilters, facility: filter.facility };
        }
        if (filter.permission) {
            updatedFilters = { ...updatedFilters, permission: filter.permission };
        }
        setDataFilters(prevState => ({
            ...prevState,
            ...updatedFilters
        }));
    }, []);
    const handlePagination = async (pagination) => {
        await router.get('/user/list', {
            page: pagination.current,
            filter: dataFilter
        });
    }
    const filterForm = async () => {
        await router.get('/user/list', {
            filter: dataFilter
        });
    }
    return (
        <LayoutCMMS title={props.title}>
            <Collapse
                size="middle"
                style={{
                    marginBottom: "3rem"
                }}
                defaultActiveKey={['searching']}
                items={[{
                    key: 'searching',
                    label: (<> <Typography.Title level={5}><SearchOutlined/> Tìm kiếm </Typography.Title></>),
                    children:
                        (
                            <Form
                                layout="vertical"
                                name="basic"
                                onFinish={filterForm}
                                autoComplete="off"
                            >
                                <Row wrap={true} gutter={24}>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Keyword"
                                            name="keyword"
                                        >
                                            <Input
                                                value={dataFilter.keyword}
                                                onChange={(e) => setDataFilters(prevState => ({
                                                    ...prevState,
                                                    keyword: e.target.value
                                                }))}
                                                placeholder="Tìm theo ID, tên nhân viên, email nhân viên"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Lọc theo cơ sở"
                                            name="facility"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Chọn cơ sở"
                                                value={dataFilter.facility}
                                                onChange={(value) => setDataFilters(prevState => ({
                                                    ...prevState,
                                                    facility: value
                                                }))}
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
                                    <Col span={6}>
                                        <Form.Item
                                            label="Lọc theo phân quyền"
                                            name="permission"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Chọn cơ sở"
                                                value={dataFilter.permission}
                                                onChange={(value) => setDataFilters(prevState => ({
                                                    ...prevState,
                                                    permission: value
                                                }))}
                                                filterOption={(input, option) => {
                                                    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
                                                }}
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
                                <Flex align="center" gap={16}>
                                    <Button htmlType="submit" type="primary" icon={<SearchOutlined/>}>
                                        Tìm kiếm
                                    </Button>
                                    <Button
                                        style={{
                                            backgroundColor: '#52c41a',
                                            borderColor: '#52c41a',
                                            color: '#fff',
                                        }}
                                        icon={<PlusOutlined/>}
                                        onClick={() => router.get('/user/view_add')}
                                    >
                                        Thêm nhân viên
                                    </Button>
                                </Flex>
                            </Form>
                        )
                }]}
            />
            <Table
                columns={[
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: 'Avatar',
                        dataIndex: 'avatar',
                        key: 'avatar',
                        render: (avatar) => {
                            if (avatar) {
                                return (
                                    <Avatar shape="square" size="large" src={<img src={avatar} alt="avatar user"/>}/>)
                            } else {
                                return (<Avatar shape="square" size="large" icon={<UserOutlined/>}/>)
                            }
                        }
                    },
                    {
                        title: 'Tên nhân viên',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Email/SDT nhân viên',
                        dataIndex: 'emailPhone',
                        key: 'emailPhone',
                    },
                    {
                        title: 'Thuộc cơ sở',
                        dataIndex: 'facility',
                        key: 'facility',
                    },
                    {
                        title: 'Chuyên viên',
                        dataIndex: 'specialty',
                        key: 'specialty',
                    },
                    {
                        title: 'Chức vụ',
                        dataIndex: 'permission',
                        key: 'permission',
                    },
                    {
                        title: 'Action',
                        dataIndex: 'action',
                        key: 'action',
                        render: (id) => (
                            <Flex gap={6} align="center">
                                <Button icon={<MenuOutlined/>}>Chi tiết</Button>
                                <Button type="primary" icon={<EditOutlined/>}>Chỉnh sửa</Button>
                                <Button danger type="primary" icon={<DeleteOutlined/>}>Xóa</Button>
                            </Flex>
                        )
                    },
                ]}
                pagination={{
                    current: users.current_page,
                    defaultCurrent: 1,
                    pageSize: users.per_page,
                    total: users.total,
                    position: ['bottomLeft'],
                    showSizeChanger: false,
                }}
                onChange={handlePagination}
                dataSource={users.data.map((user) => {
                    return {
                        key: uuid(),
                        id: user.id,
                        avatar: user.avatar ? `/view_file/${user.avatar}` : null,
                        name: user.name,
                        emailPhone: `${user.email} - ${user.phone}`,
                        facility: `${user.facility.name} - ${user.facility.address}`,
                        specialty: `${user.specialties.name}`,
                        permission: props.auth.permission[user.permission].text
                    }
                })}
            />
        </LayoutCMMS>
    )
}

export default List
