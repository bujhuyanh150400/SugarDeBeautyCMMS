import {Head, router} from "@inertiajs/react";
import PinField from "react-pin-field";
import {useRef, useState, useEffect} from "react";
import {Text} from "rsuite";
import toast from "react-hot-toast";

const TimeAttendance = (props) => {
    const {user, start_time_registered, end_time_registered, short_url} = props;
    const ref = useRef()
    const [dateTime, setDateTime] = useState(new Date());
    const [statusAttendance, setStatusAttendance] = useState(false);
    useEffect(() => {
        const timerID = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timerID);
    }, []);
    const getCurrentHour = () => {
        return dateTime.getHours();
    };
    const getCurrentMinute = () => {
        return dateTime.getMinutes();
    };
    const getCurrentSecond = () => {
        return dateTime.getSeconds();
    };
    const submitPin = (pin) => {
        router.post(route('short_url', {short_url}), {pin}, {
            onSuccess: (page) => {
                setStatusAttendance(true);
            },
            onError: (errors) => {
                Object.values(errors).map((error) => toast.error(error))
                ref.current.forEach(input => (input.value = ""));
                ref.current[0].focus();
            },
        })
    }
    return (
        <>
            <Head title={props.title}></Head>
            <div className="fixed w-screen h-screen bg-sky-200">
                {statusAttendance === false ?
                    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                        <Text size={'xxl'} weight={'semibold'} className="roboto">Chấm công của nhân
                            viên {user.name}</Text>
                        <Text size={'lg'} weight={'semibold'} className="roboto">Chấm công ca
                            làm: {start_time_registered} - {end_time_registered}</Text>
                        <div className="grid grid-cols-3 gap-4">
                            <div
                                className={`p-4 flex items-center justify-center gap-2 bg-white/40 text-slate-900  border-t-white border-r-white backdrop-blur-2xl shadow-lg text-4xl text-center rounded-lg roboto`}>
                                {getCurrentHour()} <span className={'text-sm font-medium roboto self-end'}>Giờ</span>
                            </div>
                            <div
                                className={`p-4 flex items-center justify-center gap-2 bg-white/40 text-slate-900  border-t-white border-r-white backdrop-blur-2xl shadow-lg text-4xl text-center rounded-lg roboto`}>
                                {getCurrentMinute()} <span className={'text-sm font-medium roboto self-end'}>Phút</span>
                            </div>
                            <div
                                className={`p-4 flex items-center justify-center gap-2 bg-white/40 text-slate-900  border-t-white border-r-white backdrop-blur-2xl shadow-lg text-4xl text-center rounded-lg roboto`}>
                                {getCurrentSecond()} <span className={'text-sm font-medium roboto self-end'}>Giây</span>
                            </div>
                        </div>
                        <div>
                            <PinField validate="0123456789"
                                      inputMode="numeric"
                                      className="pin-field w-12 h-12"
                                      length={5} ref={ref}
                                      onComplete={submitPin}/>
                        </div>
                    </div> :
                    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                        <Text size={'xxl'} weight={'semibold'} className="roboto">Chấm công của nhân
                            viên {user.name}</Text>
                        <Text size={'lg'} weight={'semibold'} className="roboto">Đã chấm công</Text>
                    </div>
                }
            </div>
        </>
    )
}
export default TimeAttendance
