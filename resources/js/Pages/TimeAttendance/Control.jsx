import Layout from "@/Layouts/index.jsx";
import {useForm} from "@inertiajs/react";
import {
    Button,
    Form,
    MaskedInput, Heading, HeadingGroup, Text, Animation, DatePicker, InputGroup,Whisper,Tooltip
} from "rsuite";

import {useState} from "react";


import QrcodeIcon from '@rsuite/icons/Qrcode';
import TimeRoundIcon from '@rsuite/icons/TimeRound';
import QRCode from "@/Components/QRCode.jsx";

const Control = (props) => {
    const {user, time_attendance, short_url} = props;
    const [openForm, setOpenForm] = useState(!!time_attendance);
    const {data, setData, post, errors} = useForm({
        expires_at: time_attendance ? new Date(time_attendance.expires_at) : null,
        pin: time_attendance ? time_attendance.pin : '',
    });
    const setRandomPin = () => {
        let code = String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
        setData('pin', parseInt(code))
    }
    const setDefaultExpiresAt = () => {
        const defaultTime = new Date();
        defaultTime.setMinutes(5);
        defaultTime.setSeconds(0);
        setData('expires_at', defaultTime)
    };
    const submit = async () => {
        await post(route('time_attendance.control', {user_id: user.id}), data);
    }
    return (
        <Layout back_to={route('time_attendance.list')}>
            <>
                <Animation.Fade in={!openForm}>
                    {(props, ref) =>
                        (
                            <div
                                {...props}
                                ref={ref}
                                className={openForm ? 'hidden' : ''}
                            >
                                <HeadingGroup className="flex flex-col items-center justyfy-center gap-8">
                                    <Heading className="roboto">Nhân viên chưa có QR code</Heading>
                                    <Text muted>Hãy tạo QR cho nhân viên</Text>
                                    <Button startIcon={<QrcodeIcon/>} onClick={() => setOpenForm(!openForm)}
                                            appearance="primary"> Tạo QR code cho nhân viên </Button>
                                </HeadingGroup>
                            </div>
                        )
                    }
                </Animation.Fade>
                <Animation.Bounce in={openForm}>
                    {(props, ref) => (
                       <>
                           <Form onSubmit={submit} fluid {...props} ref={ref} hidden={!openForm}>
                               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                                   <div className='grid grid-cols-1  gap-4'>
                                       <Form.Group controlId="expires_at">
                                           <Form.ControlLabel>Số phút được phép đi muộn</Form.ControlLabel>
                                           <div className="grid grid-cols-4 gap-2">
                                               <DatePicker
                                                   className="col-span-3"
                                                   block placeholder="Phút : giây"
                                                   name="expires_at" id="expires_at"
                                                   format="mm:ss" caretAs={TimeRoundIcon}
                                                   onChange={(value) => setData('expires_at', value)}
                                                   value={data.expires_at}
                                               />
                                               <Button onClick={setDefaultExpiresAt}>Mặc định</Button>
                                           </div>
                                           <Form.ErrorMessage
                                               show={!!errors.expires_at}>{errors.expires_at}</Form.ErrorMessage>
                                       </Form.Group>
                                       <Form.Group controlId="pin">
                                           <Form.ControlLabel>Mã PIN</Form.ControlLabel>
                                           <InputGroup>
                                                   <MaskedInput
                                                       name="pin" id="pin"
                                                       mask={[
                                                           /\d/, // Các chữ số từ 0 đến 9
                                                           /\d/, // Các chữ số từ 0 đến 9
                                                           /\d/, // Các chữ số từ 0 đến 9
                                                           /\d/, // Các chữ số từ 0 đến 9
                                                           /\d/, // Các chữ số từ 0 đến 9
                                                           /\d/, // Các chữ số từ 0 đến 9
                                                       ]}
                                                       placeholder="Nhập 6 số"
                                                       onChange={(value) => setData('pin', value)} value={data.pin}
                                                   />
                                                   <InputGroup.Button onClick={setRandomPin}>Random Mã
                                                       số</InputGroup.Button>
                                               </InputGroup>
                                           <Form.ErrorMessage show={!!errors.pin}>{errors.pin}</Form.ErrorMessage>
                                       </Form.Group>
                                       <div>
                                           <Button type="submit"
                                                   startIcon={<QrcodeIcon/>}
                                                   appearance="primary"
                                                   color="green">
                                               {!!time_attendance ? 'Sửa' : 'Tạo'}QR code</Button>
                                       </div>
                                   </div>
                                   {short_url && (
                                       <div className="flex flex-col gap-3">
                                           <Heading level={5}>Mã QRCode của nhân viên</Heading>
                                           <QRCode url={short_url} />
                                       </div>
                                   )}
                               </div>
                           </Form>

                       </>
                    )}
                </Animation.Bounce>
            </>
        </Layout>
    )
}

export default Control
