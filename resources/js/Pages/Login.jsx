import {useEffect} from "react";
import {Head, useForm} from '@inertiajs/react'
import {Button, CustomProvider, Form, Panel, Stack} from "rsuite";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";

const Login = (props) => {
    const {data, setData, post, processing, errors} = useForm({
        email: '',
        password: '',
        remember: false
    })
    const darkTheme = useSelector(state => state.app.darkTheme);
    useEffect(() => {
        if (props.errors?.login) {
            toast.error(props.errors?.login);
        }
    }, [props.errors])

    const handleSubmit = async () => {
        await post('/login', data);
    };
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <Head title={props.title}></Head>
            <div className={`w-screen h-screen ${darkTheme ? "bg-black" : "bg-gradient-to-br from-blue-400 via-teal-200 to-lime-300"}`}>
                <Stack
                    className="w-full h-full"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Panel className={`${darkTheme ? "bg-white/20" : "bg-white/60"} w-full`} bordered shaded
                           header="Đăng nhập vào Sugar de beaute">
                        <Form onSubmit={handleSubmit} fluid>
                            <Form.Group>
                                <Form.ControlLabel>Email đăng nhập</Form.ControlLabel>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Email@email.com"
                                    onChange={(value) => setData('email', value)}
                                    errorMessage={errors.email}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    value={data.password}
                                    onChange={(value) => setData('password', value)}
                                    errorMessage={errors.password}
                                />
                            </Form.Group>
                            <Button block appearance="primary" loading={processing} type="submit">Đăng nhập</Button>
                        </Form>
                    </Panel>
                </Stack>
            </div>
        </CustomProvider>
    );
}
export default Login
