import {useEffect} from "react";
import {useForm} from '@inertiajs/react'
import {Button, Checkbox, Form, FormField, Input, Transition, Message, FormInput} from "semantic-ui-react";
import toast from "react-hot-toast";

const Login = (props) => {
    const {data, setData, post, processing, errors} = useForm({
        email: '',
        password: '',
        remember: false
    })
    useEffect(() => {
        if (props.errors?.login) {
            toast.error(props.errors.login)
        }
    }, [props.errors])

    const handleSubmit = async () => {
        await post('/login', data);
    };
    return (
        <>
            <div className="relative w-screen h-screen bg-gray-100 p-0 md:p-6">
                <div
                    className="w-full h-full rounded-lg bg-gradient-to-br from-blue-400 via-teal-200 to-lime-300 shadow-2xl p-2 border-t border-t-white border-l border-l-white  backdrop-blur-2xl flex items-center justify-center">
                    <div className="rounded-lg p-1 shadow-2xl backdrop-blur-2xl bg-white/60 w-full max-w-xl">
                        <Form className="p-4 flex flex-col gap-2"  onSubmit={handleSubmit}>
                            <FormInput
                                disabled={processing}
                                error={errors.email ? {content: errors.email, pointing: "below"} : false}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                name="email" label='Email đăng nhập' placeholder='bha@gmail.com'/>
                            <FormInput
                                disabled={processing}
                                error={errors.password ? {content: errors.password, pointing: "below"} : false}
                                label='Mật khẩu đăng nhập'
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder='********'/>
                            <Message
                                header='Lưu ý khi đăng nhập'
                                list={[
                                    'Email phải đúng định dạng, là tài khoản được đăng kí hệ thống',
                                    'Mật khẩu sẽ từ 8 - 16 kí tự'
                                ]}
                            />
                            <Button type="submit" loading={processing} primary>Đăng nhập</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login
