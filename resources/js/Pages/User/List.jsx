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
    let {facilities, query = null, users} = props;
    query = query || {};
    const permissions = Object.values(props.auth.permission);
    const setQueryChange = async (name, value) => {
        if (value) {
            query[name] = value;
        } else {
            delete query[name];
        }

    };
    const handlePagination = async (pagination) => {
        await router.get('/user/list', {
            page: pagination.current,
            ...query
        },{ preserveState: true });
    }
    const filterForm = async () => {
        await router.get('/user/list', {
            ...query
        },{ preserveState: true });
    }
    return (
        <LayoutCMMS title={props.title}>
            <Form
                layout="vertical"
                name="basic"
                onFinish={filterForm}
                autoComplete="off"
                style={{
                    marginBottom: "2rem"
                }}
            >
                <Row wrap={true} gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            label="Tìm kiếm"
                            name="keyword"
                        >
                            <Input
                                value={query.keyword}
                                onChange={(e) => setQueryChange('keyword', e.target.value)}
                                placeholder="Tìm theo ID, tên nhân viên, email nhân viên"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Lọc theo cơ sở"
                            name="facility"
                        >
                            <Select
                                placeholder="Chọn cơ sở"
                                value={query.facility}
                                onChange={(value) => setQueryChange('facility', value)}
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
                                placeholder="Chọn cơ sở"
                                value={query.permission}
                                onChange={(value) => setQueryChange('permission', value)}
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
