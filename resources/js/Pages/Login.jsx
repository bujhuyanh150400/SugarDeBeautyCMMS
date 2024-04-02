import { useState } from "react";
import Constant from "@/utils/constant.js";
import { Button, Flex, Card, Form, Input, Image, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/reducers/AppSlice.js'
import { openToast } from "@/redux/reducers/ToastSlice.js";
import {handleErrorApi} from "@/utils/function.js"
import logo from '@/assets/logo.png'

const Login = () => {
    const dispatch = useDispatch();
    const [login, setLogin] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const handleValidate = () => {
        let formIsValid = true;
        const newErrors = {};
        if (!login.email) {
            formIsValid = false;
            newErrors.email = 'Vui lòng nhập email';
        } else if (!login.email.match(Constant.Validate.EMAIL_REGEX)) {
            formIsValid = false;
            newErrors.email = 'Email sai định dạng';
        }
        if (!login.password) {
            formIsValid = false;
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (login.password.length < 8) {
            formIsValid = false;
            newErrors.password = 'Mật khẩu phải trong lớn hơn 8 kí tự';
        }
        formIsValid === false ? setErrors(newErrors) : setErrors(prevState => ({
            ...prevState,
            email: '',
            password: '',
        }));
        return formIsValid
    }
    const handleSubmit = () => {
        const formIsValid = handleValidate();
        if (formIsValid) {
            // dispatch(setLoading(true))
            dispatch(openToast({
                id: Math.random(),
                type: Constant.ToastType.SUCCESS,
                message: 'Server response',
                description: 'Đăng nhập thành công',
            }));
            console.log('test')
        }
    };
    return (
        <Flex style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: "linear-gradient(to right, #a5f3fc, #3182CE)"
        }} justify="center" align="center">
            <Card
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
                        <Image
                            preview={false}
                            width={300}
                            src={logo}
                            style={{
                                paddingBottom: "20px"
                            }}
                        />
                        <Form.Item
                            name="username"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email}
                        >
                            <Input size="large"
                                   value={login.email}
                                   onChange={(e) => setLogin((prevState) => ({
                                       ...prevState,
                                       email: e.target.value,
                                   }))}
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
                                value={login.password}
                                onChange={(e) => setLogin((prevState) => ({
                                    ...prevState,
                                    password: e.target.value,
                                }))}
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />

                        </Form.Item>
                        <Form.Item>
                            <Flex align="center" justify="center">
                                <Button type="primary" block htmlType="submit">
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
