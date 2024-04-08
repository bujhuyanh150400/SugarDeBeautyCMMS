import {useEffect, useState} from "react";
import { Button, Flex, Card, Form, Input, Typography , Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useForm } from '@inertiajs/react'
import {useDispatch} from "react-redux";
import {openToast} from "@/redux/reducers/ToastSlice.js";
import {v4 as uuidv4} from "uuid";
import Constant from "@/utils/constant.js";

const Login = (props) => {
    const dispatch = useDispatch()
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    })

    useEffect(()=>{
        if (props.errors?.login){
            dispatch(openToast({
                id: uuidv4(),
                type: Constant.ToastType.ERROR,
                message: 'Xác thực tài khoản',
                description: errors?.login,
            }));
        }
    },[props.errors])

    const handleSubmit = async () => {
        await post('/login',data);
    };
    return (
        <Flex style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: "linear-gradient(to right, #a5f3fc, #3182CE)"
        }} justify="center" align="center">
            <Card
                size="default"
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "1rem"
                }}>
                <Form
                    name="HVLogin"
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                >
                    <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                        <Typography.Title level={3} className="flex items-center justify-center">CMMS Login</Typography.Title>
                        <Form.Item
                            name="username"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                        >
                            <Input size="large"
                                   value={data.email}
                                   onChange={(e) => setData('email', e.target.value)}
                                   prefix={<UserOutlined />}
                                   placeholder="Email đăng nhập" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password}
                        >
                            <Input.Password
                                size="large"
                                value={data.password}
                                autoComplete="true"
                                onChange={(e) => setData('password', e.target.value)}
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />

                        </Form.Item>
                        <Form.Item>
                            <Flex align="center" justify="center">
                                <Button type="primary"  loading={processing} block htmlType="submit">
                                    Đăng nhập
                                </Button>
                            </Flex>
                        </Form.Item>
                    </Space>
                </Form>
            </Card>
        </Flex>
    );
}
export default Login
