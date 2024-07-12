import Layout from "@/Layouts/index.jsx";
import {
    Badge,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    IconButton,
    Input,
    Message,
    Panel,
    Radio,
    Text,
    Timeline,
    Tooltip,
    Whisper
} from "rsuite";
import {useEffect, useMemo, useState} from "react";
import constant from "@/utils/constant.js";
import AttachmentIcon from "@rsuite/icons/Attachment";
import FancyBox from "@/Components/FancyBox.jsx";
import _ from "lodash";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {setLoading} from "@/redux/reducers/AppSlice.js";
import {router} from "@inertiajs/react";
import Swal from "sweetalert2";


const DoTest = ({training_route}) => {
    const test_questions = training_route.test_questions;
    const dispatch = useDispatch();

    const [data, setData] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTest, setActiveTest] = useState(test_questions[0].id);

    const test_question_active = useMemo(() => test_questions.filter(test => activeTest === test.id),
        [activeTest, test_questions]
    );

    const [beginExam, setBeginExam] = useState(false);

    const [timeLeft, setTimeLeft] = useState(training_route.time * 60);


    useEffect(() => {
        const handleContextMenu = (event) => {
            toast.error('Bạn đang cố tình vào devTool ?')
            event.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);
        const handleKeyDown = (event) => {
            const keyString = event.key.toLowerCase();
            const ctrlKey = event.ctrlKey || event.metaKey; // Xem xét cả phím Ctrl trên Mac
            const shiftKey = event.shiftKey;
            // Danh sách các phím tắt để mở Developer Tools và các công cụ khác
            const forbiddenKeys = ['f12', 'i', 'j', 'u', 'c', 'k', 'e', 's', 'm', 'escape'];
            if ((forbiddenKeys.includes(keyString) &&
                (ctrlKey || shiftKey)) || forbiddenKeys.includes(keyString)) {
                toast.error('Bạn đang cố tình vào devTool ?')
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        const handleVisibilityChange = () => {
            if (document.hidden) {
                router.post(route('training_route.scoring', {training_route_id: training_route.id}), {violating: true});
            }
        };
        document.addEventListener('blur', handleVisibilityChange);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            toast.success('Hết giờ làm bài !!');
            router.post(route('training_route.scoring', {training_route_id: training_route.id}), {result: data});
            return;
        }
        if (beginExam) {
            const intervalId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timeLeft, beginExam]);
    const openFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    };

    const startExam = async () => {
        dispatch(setLoading(true))
        try {
            await axios.patch(route('training_route.do_test', {training_route_id: training_route.id}), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Inertia': true,
                },
            });
            setBeginExam(true);
            openFullscreen();
        } catch (error) {
            const message = error.response.data ? error.response.data : 'Lỗi hệ thống, vui lòng liên hệ với quản trị viên';
            toast.error(message)
        } finally {
            dispatch(setLoading(false));
        }
    }
    const test_present = test_question_active[0];
    const {files, images} = useMemo(() => {
        return test_present.files.reduce(
            (acc, file) => {
                const type = constant.imageExtensions.includes(file.file_extension.toLowerCase()) ? 'images' : 'files';
                acc[type].push(file);
                return acc;
            },
            {files: [], images: []}
        );
    }, [test_present.files]);
    const handleAnswersChecked = (test_id, answer_id, checked, type = constant.TYPE_CHECKBOX) => {
        setData(prevState => {
            if (type === constant.TYPE_CHECKBOX) {
                let check_answer = prevState[test_id] || [];
                if (checked) {
                    if (!check_answer.includes(answer_id)) {
                        check_answer = [...check_answer, answer_id];
                    }
                } else {
                    check_answer = check_answer.filter(item => item !== answer_id);
                }
                return {...prevState, [test_id]: check_answer};
            } else if (type === constant.TYPE_RADIO) {
                return {...prevState, [test_id]: answer_id};
            }
        });
    };
    const Answers = () => {
        const {type, answers} = test_present;
        const renderCheckboxes = () => (
            <div className="flex flex-col gap-2">
                {answers.map(answer => {
                    const id_checked = _.isArray(data[test_present.id]) ? data[test_present.id].includes(answer.id) : false;
                    return (
                        <Checkbox
                            key={answer.id}
                            checked={id_checked}
                            value={answer.id}
                            name={`checkbox-answer-${test_present.id}`}
                            onChange={(value, checked) => handleAnswersChecked(test_present.id, value, checked, type)}
                        >
                            {answer.answer}
                        </Checkbox>
                    );
                })}
            </div>
        );
        const renderRadios = () => (
            <div className="flex flex-col gap-2">
                {answers.map(answer => (
                    <Radio
                        key={answer.id}
                        value={answer.id}
                        checked={answer.id === data[test_present.id]}
                        name={`radio-answer-${test_present.id}`}
                        onChange={(value, checked) => handleAnswersChecked(test_present.id, value, checked, type)}
                    >
                        {answer.answer}
                    </Radio>
                ))}
            </div>
        );

        if (type === constant.TYPE_CHECKBOX) return renderCheckboxes();
        if (type === constant.TYPE_RADIO) return renderRadios();
        return (
            <Message type="warning" showIcon>
                <b>Bài làm không có đáp án ?</b>
            </Message>
        );
    };

    const submitExam = () => {
        Swal.fire({
            title: 'Kiểm tra cẩn thận bài làm',
            text: `Bạn đã chắc chắn về việc nộp bài chưa, vẫn còn thời gian làm bài `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, tôi chắc chắn!',
            cancelButtonText: 'Làm bài tiếp'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('training_route.scoring', {training_route_id: training_route.id}), {result: data});
            }
        });
    }

    const formatMinutes = (time) => {
        return Math.floor(time / 60);
    };
    const formatSeconds = (time) => {
        return time % 60;
    }
    return (
        <Layout hiddenHeader hiddenLeftMenu>
            <div
                className={`fixed z-[99] inset-0 w-screen h-screen bg-black/90 flex items-center flex-col justify-center space-y-4 ${beginExam && '!hidden'}`}>
                <Message type={'warning'} showIcon={true}>
                    <b>Lưu ý:</b>
                    <ul>
                        <li>Khi làm bài thi sẽ bật full màn hình</li>
                        <li>Không được đổi tab hay thoát khỏi trình duyệt, nếu thoát sẽ tự động nộp bài và chấm 0 điểm
                        </li>
                        <li>Không được nghịch các nút mở devTool</li>
                        <li>Hết giờ làm bài, hệ thống sẽ tự động nộp bài</li>
                    </ul>
                </Message>
                <Button appearance={'primary'} color={'green'} onClick={startExam}>Bắt đầu làm bài kiểm tra</Button>
            </div>

            <div className="grid grid-cols-12 space-x-2 w-full h-full">
                <div className="col-span-2 h-full">
                    <Timeline className="custom-timeline" isItemActive={index => index === activeIndex}>
                        {test_questions.map((test, key) => (
                            <Timeline.Item key={key}>
                                <Button
                                    appearance={activeIndex === key ? 'primary' : 'ghost'}
                                    color="blue"
                                    onClick={() => {
                                        setActiveTest(test.id);
                                        setActiveIndex(key);
                                    }}
                                >
                                    Câu hỏi số {key + 1}
                                </Button>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
                <div className="col-span-10 space-y-4 h-full">
                    <div className='flex items-center justify-center gap-4'>
                        <div
                            className="p-4 flex items-center  justify-center gap-2 dark:bg-white dark:text-slate-900 bg-slate-800 text-white border-t-white border-r-white backdrop-blur-2xl shadow-lg text-4xl text-center rounded-lg roboto">
                            {formatMinutes(timeLeft)} <span
                            className={'text-sm font-medium roboto self-end'}>Phút</span>
                        </div>
                        <div
                            className="p-4 flex items-center  justify-center gap-2 dark:bg-white dark:text-slate-900 bg-slate-800 text-white border-t-white border-r-white backdrop-blur-2xl shadow-lg text-4xl text-center rounded-lg roboto">
                            {formatSeconds(timeLeft)} <span
                            className={'text-sm font-medium roboto self-end'}>Giây</span>
                        </div>
                        <Button appearance={'primary'} color={'green'} onClick={submitExam}>Nộp bài thi</Button>
                    </div>
                    <Panel bordered shaded>
                        <Text as="div" color="blue" size="xxl" weight="bold">
                            <Badge content={`câu hỏi số ${activeIndex + 1}`} color="blue" className="!px-3 !py-2 me-3"/>
                            Câu hỏi: {test_present.title}
                        </Text>
                        <Divider/>
                        <div className="space-y-4">
                            {files.length > 0 && (
                                <>
                                    <Text color="blue" weight="bold">File đính kèm:</Text>
                                    <div className="flex items-center gap-2">
                                        {files.map((file_had_upload, index) => (
                                            <ButtonGroup block key={index}>
                                                <Whisper placement="top" speaker={<Tooltip>Ấn để tải</Tooltip>}>
                                                    <IconButton
                                                        as="a"
                                                        target="_blank"
                                                        appearance="ghost"
                                                        href={route('file.show', {filepath: file_had_upload.file_location})}
                                                        icon={<AttachmentIcon/>}
                                                    >
                                                        {file_had_upload.file_real_name}
                                                    </IconButton>
                                                </Whisper>
                                            </ButtonGroup>
                                        ))}
                                    </div>
                                </>
                            )}
                            {images.length > 0 && (
                                <>
                                    <Text color="blue" weight="bold">Ảnh đính kèm:</Text>
                                    <div className="space-x-4 space-y-2 flex items-center gap-2 flex-col justify-center">
                                        {images.map((image, index) => {
                                            return (
                                                <div className={`!max-w-[800px]`}>
                                                    <img key={index} src={route('file.show', {filepath: image.file_location})} className="w-full h-full" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                            <Text color="blue" weight="bold">Nội dung câu hỏi:</Text>
                            <div dangerouslySetInnerHTML={{__html: test_present.description}}/>
                        </div>
                        <Divider/>
                        <Text color="blue" weight="bold">Câu trả lời:</Text>
                        <Answers/>
                    </Panel>
                </div>
            </div>
        </Layout>
    );
};

export default DoTest;
