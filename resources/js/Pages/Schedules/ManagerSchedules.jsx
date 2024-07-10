import Layout from "@/Layouts/index.jsx";
import {
    Calendar,
    Panel,
    Button,
    Badge,
    Modal, Form, SelectPicker, Input, Whisper, Tooltip, Message, List, Text, Divider, ButtonGroup
} from 'rsuite';
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {router, usePage} from "@inertiajs/react";
import dayjs from "dayjs";
import PlusIcon from '@rsuite/icons/Plus';
import RemindIcon from "@rsuite/icons/legacy/Remind";
import {useDispatch, useSelector} from "react-redux";
import {setLoading} from "@/redux/reducers/AppSlice.js";
import Swal from "sweetalert2";

const initialScheduleForm = {
    schedule_id: '',
    day_registered: '',
    user_id: '',
    start_time_registered: '',
    end_time_registered: '',
    type: '',
    note: '',
    status: '',
};
const ManagerSchedules = (props) => {
    const page = usePage();
    const dispatch = useDispatch();
    const {
        facility,
        users,
        users_schedule,
        scheduleType,
        scheduleStatus,
        startOfWeek,
        endOfWeek,
        errors
    } = props;
    useEffect(() => {
        Object.values(errors).map((error) => toast.error(error))
    }, [errors])

    const [scheduleStates, setSchedulesState] = useState({
        form: false,
        alert: false,
        view: false,
        id_deleted: 0,
    });
    const [scheduleForm, setSchedulesForm] = useState(initialScheduleForm);
    const [dataViewSchedule, setDataViewSchedule] = useState([]);
    const editSchedule = (schedule) => {
        const day_registered = dayjs(schedule.day_registered).format('YYYY-MM-DD');
        const start_time_registered = dayjs(schedule.start_time_registered).format('HH:mm');
        const end_time_registered = dayjs(schedule.end_time_registered).format('HH:mm');
        setSchedulesForm({
            schedule_id: schedule.id,
            day_registered,
            start_time_registered,
            end_time_registered,
            note: schedule.note ?? '',
            type: schedule.type.value,
            status: schedule.status.value,
            user_id: schedule.user_id,
        })
        setSchedulesState((prevState) => ({
            ...prevState,
            form: true,
        }));
    }
    const submitSchedule = () => {
        if (scheduleForm.schedule_id > 0) {
            router.patch(route('schedules.edit', {schedule_id: scheduleForm.schedule_id}), scheduleForm, {
                onSuccess: () => {
                    setSchedulesForm(initialScheduleForm);
                    setSchedulesState((prevState) => ({
                        ...prevState,
                        form: false,
                    }));
                }
            })
        } else {
            router.post(route('schedules.register', {facilities_id: facility.id}), scheduleForm, {
                onSuccess: () => {
                    setSchedulesForm(initialScheduleForm);
                    setSchedulesState((prevState) => ({
                        ...prevState,
                        form: false,
                    }));
                }
            })
        }
    }
    const viewSchedule = (date) => {
        const date_format = dayjs(date).hour(0).minute(0).second(0).millisecond(0).format('YYYY/MM/DD HH:mm:ss');
        dispatch(setLoading(true));
        axios.get(route('schedules.view', {facilities_id: facility.id}), {
            headers: {
                'Content-Type': 'application/json',
                'X-Inertia': true,
                'X-Inertia-Version': page.version,
            },
            params: {day_registered: date_format}
        })
            .then(({data}) => {
                setDataViewSchedule(data);
                setSchedulesState(prevState => ({
                    ...prevState,
                    view: true,
                }))
            })
            .catch((error) => {
                const message = error.response.data ? error.response.data : 'Lỗi hệ thống, vui lòng liên hệ với quản trị viên';
                toast.error(message)
            })
            .finally(() => dispatch(setLoading(false)))
    }

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="flex flex-col gap-2">
                    <Calendar
                        value={scheduleStates.date}
                        bordered
                        compact
                        renderCell={(date) => {
                            const day = date.getDay();
                            if (day === 0) {
                                return <Whisper placement="top" trigger="hover"
                                                speaker={<Tooltip>Ngày đăng kí lịch làm cho cả tuần</Tooltip>}>
                                    <Badge content="dkl"/>
                                </Whisper>;
                            }
                        }}
                        onSelect={viewSchedule}
                    />
                    <Button
                        appearance="primary"
                        color="green"
                        block
                        startIcon={<PlusIcon/>}
                        onClick={() => {
                            setSchedulesForm(initialScheduleForm);
                            setSchedulesState((prevState) => ({
                                ...prevState,
                                form: true,
                            }));
                        }}>Tạo lịch làm mới</Button>
                </div>
                <Panel header={`Thống kê lịch làm tuần này (${startOfWeek} - ${endOfWeek}) :`}
                       className="roboto mb-4 h-fit col-span-2"
                       bordered shaded>
                    {(users_schedule && users_schedule.length > 0) ?
                        (<div className="flex flex-col gap-4">
                            {users_schedule.map((user) => (
                                <div key={user.id}>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center flex-wrap">
                                            <Text weight="bold" color="blue">{user.specialties.name}</Text>
                                            <Divider vertical/>
                                            <Text>{user.name}</Text>
                                        </div>
                                        <List className="col-span-3" bordered>
                                            {user.schedules.map((schedule_user) => {
                                                const day_registered = dayjs(schedule_user.day_registered).format('DD/MM');
                                                const start_time_registered = dayjs(schedule_user.start_time_registered).format('HH:mm');
                                                const end_time_registered = dayjs(schedule_user.end_time_registered).format('HH:mm');
                                                let attendance_at = null;
                                                if (schedule_user.attendance_at) {
                                                    attendance_at = dayjs(schedule_user.attendance_at).format('DD/MM/YYYY HH:mm:ss');
                                                }
                                                return (
                                                    <List.Item key={schedule_user.id}
                                                               className="grid grid-cols-5 gap-4">
                                                        <div className="flex flex-col gap-2 self-center">
                                                            <span>Ngày: {day_registered}</span>
                                                            <Text weight="bold"
                                                                  color={schedule_user.status.color}>{schedule_user.status.text}</Text>
                                                            {attendance_at &&
                                                                <Text size={'sm'}>Chấm công lúc: {attendance_at}</Text>}
                                                        </div>
                                                        <div className="flex flex-col gap-2 self-center">
                                                            <Text color={schedule_user.type.color}
                                                                  className="self-center">{schedule_user.type.text}</Text>
                                                            <Text className="self-center">Ca
                                                                làm: {start_time_registered} - {end_time_registered}</Text>
                                                        </div>
                                                        <Input className="col-span-2" as="textarea" readOnly rows={4}
                                                               value={schedule_user.note ? schedule_user.note : 'Không có ghi chú'}/>
                                                        <ButtonGroup className="self-center justify-self-center">
                                                            <Button appearance="primary" block={false}
                                                                    onClick={() => editSchedule(schedule_user)}>Chỉnh
                                                                sửa</Button>
                                                            <Button appearance="primary" color="red" block={false}
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            title: 'Hãy có muốn xóa lịch làm này không ?',
                                                                            text: 'Bạn có chắc chắn muốn làm điều này?',
                                                                            icon: 'error',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Có, tôi chắc chắn!',
                                                                            cancelButtonText: 'Không, hủy bỏ!'
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                router.patch(route('schedules.deleted', {schedule_id: schedule_user.id}), {}, {preserveScroll: true})
                                                                            }
                                                                        });
                                                                    }}>Xoá</Button>
                                                        </ButtonGroup>
                                                    </List.Item>
                                                )
                                            })}
                                        </List>
                                    </div>
                                </div>
                            ))}
                        </div>)
                        :
                        (<Message type="warning" showIcon>
                            <strong>Cảnh báo!</strong> Không có dữ liệu lịch làm
                        </Message>)}
                </Panel>
            </div>
            {/*Modal Form*/}
            <Modal size='md' open={scheduleStates.form}
                   onClose={() => setSchedulesState((prevState) => ({...prevState, form: false}))}>
                <Modal.Body>
                    <Form onSubmit={submitSchedule} fluid>
                        <div className="flex flex-col">
                            <Form.Group controlId="user_id" className="w-full">
                                <Form.ControlLabel className="text-start">Nhân viên đăng kí lịch</Form.ControlLabel>
                                {scheduleForm.schedule_id ? (
                                    <Text className="pt-2" weight="bold"
                                          color="blue">{users.find(user => user.id === scheduleForm.user_id).name}</Text>
                                ) : (
                                    <>
                                        <SelectPicker
                                            block
                                            data={[
                                                {label: 'Lựa chọn', value: ""},
                                                ...users.map(user => ({
                                                    label: `${user.name} - ${user.specialties.name}`,
                                                    value: user.id
                                                }))
                                            ]}
                                            value={scheduleForm.user_id}
                                            onChange={(value) => setSchedulesForm(prevState => ({
                                                ...prevState,
                                                user_id: value
                                            }))}
                                            name="user_id"
                                            id="user_id"
                                            placeholder="Chọn nhân viên"/>
                                    </>
                                )}
                            </Form.Group>
                            <Form.Group controlId="day_registered" className="w-full">
                                <Form.ControlLabel className="text-start">Ngày đăng kí</Form.ControlLabel>
                                <Input name="day_registered"
                                       id="day_registered"
                                       value={scheduleForm.day_registered}
                                       type="date"
                                       onChange={(value) => setSchedulesForm(prevState => ({
                                           ...prevState,
                                           day_registered: value
                                       }))}/>
                            </Form.Group>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Group controlId="start_time_registered" className="">
                                    <Form.ControlLabel className="text-start">Giờ bắt đầu</Form.ControlLabel>
                                    <Input name="start_time_registered"
                                           id="start_time_registered"
                                           value={scheduleForm.start_time_registered}
                                           type="time"
                                           onChange={(value) => setSchedulesForm(prevState => ({
                                               ...prevState,
                                               start_time_registered: value
                                           }))}/>
                                </Form.Group>
                                <Form.Group controlId="end_time_registered" className="">
                                    <Form.ControlLabel className="text-start">Giờ kết thúc</Form.ControlLabel>
                                    <Input name="end_time_registered"
                                           id="end_time_registered"
                                           value={scheduleForm.end_time_registered}
                                           type="time"
                                           onChange={(value) => setSchedulesForm(prevState => ({
                                               ...prevState,
                                               end_time_registered: value
                                           }))}/>
                                </Form.Group>
                            </div>
                            <Form.Group controlId="user_id" className="w-full">
                                <Form.ControlLabel className="text-start">Loại lịch làm</Form.ControlLabel>
                                <SelectPicker
                                    block
                                    searchable={false}
                                    data={[
                                        ...Object.values(scheduleType).map(status => ({
                                            label: status.text,
                                            value: status.value
                                        }))
                                    ]}
                                    value={scheduleForm.type}
                                    onChange={(value) => setSchedulesForm(prevState => ({
                                        ...prevState,
                                        type: value
                                    }))}
                                    name="type"
                                    id="type"
                                    placeholder="Loại lịch làm"/>
                            </Form.Group>
                            <Form.Group controlId="note" className="w-full">
                                <Form.ControlLabel className="text-start">Ghi chú</Form.ControlLabel>
                                <Input name="note"
                                       id="note"
                                       rows={5}
                                       value={scheduleForm.note}
                                       as="textarea"
                                       onChange={(value) => setSchedulesForm(prevState => ({
                                           ...prevState,
                                           note: value
                                       }))}/>
                            </Form.Group>
                            {scheduleForm.schedule_id && (
                                <Form.Group controlId="status" className="w-full">
                                    <Form.ControlLabel className="text-start">Trạng thái chấm công</Form.ControlLabel>
                                    <SelectPicker
                                        block
                                        searchable={false}
                                        data={[
                                            ...Object.values(scheduleStatus).map(status => ({
                                                label: status.text,
                                                value: status.value
                                            }))
                                        ]}
                                        value={scheduleForm.status}
                                        onChange={(value) => setSchedulesForm(prevState => ({
                                            ...prevState,
                                            status: value
                                        }))}
                                        name="status"
                                        id="status"
                                        placeholder="Trạng thái chấm công lịch làm"/>
                                </Form.Group>
                            )}
                            <Button type="submit" appearance="primary" color="green">Lưu</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {/*Modal View*/}
            <Modal size='70vw' open={scheduleStates.view}
                   onClose={() => setSchedulesState((prevState) => ({...prevState, view: false}))}>
                <Modal.Header>
                    <Modal.Title className="roboto">Lịch làm chi tiết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(dataViewSchedule && dataViewSchedule.length > 0) ?
                        (<div className="flex flex-col gap-4">
                            {dataViewSchedule.map((user) => (
                                <div key={user.id}>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center flex-wrap">
                                            <Text weight="bold" color="blue">{user.specialties.name}</Text>
                                            <Divider vertical/>
                                            <Text>{user.name}</Text>
                                        </div>
                                        <List className="col-span-3" bordered>
                                            {user.schedules.map((schedule_user) => {
                                                const day_registered = dayjs(schedule_user.day_registered).format('DD/MM');
                                                const start_time_registered = dayjs(schedule_user.start_time_registered).format('HH:mm');
                                                const end_time_registered = dayjs(schedule_user.end_time_registered).format('HH:mm');
                                                return (
                                                    <List.Item key={schedule_user.id}
                                                               className="grid grid-cols-5 gap-4">
                                                        <div className="flex flex-col gap-2 self-center">
                                                            <span>Ngày: {day_registered}</span>
                                                            <Text weight="bold"
                                                                  color={schedule_user.status.color}>{schedule_user.status.text}</Text>
                                                        </div>
                                                        <div className="flex flex-col gap-2 self-center">
                                                            <Text color={schedule_user.type.color}
                                                                  className="self-center">{schedule_user.type.text}</Text>
                                                            <Text className="self-center">Ca
                                                                làm: {start_time_registered} - {end_time_registered}</Text>
                                                        </div>
                                                        <Input className="col-span-2" as="textarea" readOnly rows={4}
                                                               value={schedule_user.note ? schedule_user.note : 'Không có ghi chú'}/>
                                                        <ButtonGroup className="self-center justify-self-center">
                                                            <Button appearance="primary" block={false}
                                                                    onClick={() => editSchedule(schedule_user)}>Chỉnh
                                                                sửa</Button>
                                                            <Button appearance="primary" color="red" block={false}
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            title: 'Hãy có muốn xóa lịch làm này không ?',
                                                                            text: 'Bạn có chắc chắn muốn làm điều này?',
                                                                            icon: 'error',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Có, tôi chắc chắn!',
                                                                            cancelButtonText: 'Không, hủy bỏ!'
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                router.patch(route('schedules.deleted', {schedule_id: schedule_user.id}), {}, {preserveScroll: true})
                                                                            }
                                                                        });
                                                                    }}>Xoá</Button>
                                                        </ButtonGroup>
                                                    </List.Item>
                                                )
                                            })}
                                        </List>
                                    </div>
                                </div>
                            ))}
                        </div>)
                        :
                        (<Message type="warning" showIcon>
                            Không có dữ liệu lịch làm
                        </Message>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setSchedulesState((prevState) => ({...prevState, view: false}))}
                            appearance="subtle">Đóng</Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}

export default ManagerSchedules
