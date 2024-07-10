import Layout from "@/Layouts/index.jsx";
import {
    Button,
    ButtonGroup, Checkbox,
    CheckboxGroup,
    Form,
    IconButton, Input,
    Message, Radio, RadioGroup,
    SelectPicker,
    Text,
    Tooltip,
    Uploader,
    Whisper
} from "rsuite";
import Editor from "@/Components/Editor.jsx";
import PlusIcon from "@rsuite/icons/Plus.js";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import AttachmentIcon from "@rsuite/icons/Attachment";
import TrashIcon from "@rsuite/icons/Trash.js";
import Swal from "sweetalert2";
import _ from "lodash";
import {v4 as uuidv4} from "uuid";
import constant from "@/utils/constant.js";
import toast from "react-hot-toast";

const TypeAnswers = (props) => {
    const {
        handleAnswerChange,
        handleDeleteAnswer,
        addAnswer,
        dataAnswers,
        type,
        handleAnswerChangeRadio,
        errors
    } = props;
    useEffect(() => {
        if (errors?.answers) {
            toast.error(errors.answers);
        }
    }, [errors])
    switch (type) {
        case constant.TYPE_CHECKBOX:
            return (
                <>
                    <Button className={`my-4`} size={'sm'} onClick={addAnswer} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm câu trả lời</Button>
                    <div className="flex flex-col gap-2">
                        {!_.isEmpty(dataAnswers) && _.map(dataAnswers, (answer, id) => {
                            return (
                                <Checkbox key={id} value={id}
                                          checked={!!answer.is_correct}
                                          onChange={(value, checked) => handleAnswerChange(value, 'is_correct', checked)}>
                                    <Input as={'textarea'} value={answer.answer}
                                           placeholder={`Nhập câu trả lời`}
                                           onChange={value => handleAnswerChange(id, 'answer', value)}/>
                                    <IconButton block={true} className={`my-4`} color={`red`} appearance={`ghost`}
                                                icon={<TrashIcon/>} onClick={() => handleDeleteAnswer(id)}/>
                                </Checkbox>
                            )
                        })}
                    </div>
                </>
            )
        case constant.TYPE_RADIO:
            return (
                <>
                    <Button className={`my-4`} size={'sm'} onClick={addAnswer} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm câu trả lời</Button>
                    <div className="flex flex-col gap-2">
                        {!_.isEmpty(dataAnswers) && _.map(dataAnswers, (answer, id) =>
                            <Radio key={id} value={id}
                                   checked={!!answer.is_correct}
                                   onChange={(value, checked) => handleAnswerChangeRadio(value, checked)}>
                                <Input as={'textarea'} value={answer.answer}
                                       placeholder={`Nhập câu trả lời`}
                                       onChange={value => handleAnswerChange(id, 'answer', value)}/>
                                <IconButton block={true} className={`my-4`} color={`red`} appearance={`ghost`}
                                            icon={<TrashIcon/>} onClick={() => handleDeleteAnswer(id)}/>
                            </Radio>
                        )}
                    </div>
                </>
            )
        default:
            return (
                <Message type={'warning'} showIcon={true}>
                    <b>Hãy chọn loại câu hỏi trước</b>
                </Message>
            )
    }
}

const Edit = (props) => {
    const {specialties, errors, test_question, types} = props;
    const initData = {
        title: test_question.title,
        description: test_question.description,
        specialties_id: test_question.specialties_id,
        type: test_question.type,
        file_upload: [],
        answers: _.reduce(test_question.answers, (acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {}),
    }
    const [data, setData] = useState(initData);
    const [fileList, setFileList] = useState([]);
    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}));
    const handleAnswerChange = (id, field, value) => {
        setData((prevState) => ({
            ...prevState,
            answers: {
                ...prevState.answers,
                [id]: {
                    ...prevState.answers[id],
                    [field]: value,
                },
            },
        }));
    };
    const handleAnswerChangeRadio = (id, checked) => {
        const prevAnswer = data.answers;
        const answers = _.reduce(prevAnswer, (acc, value, key_id) => {
            acc[key_id] = id !== key_id ? {...value, is_correct: false} : {...value, is_correct: checked}
            return acc;
        }, {});
        setData(prevState => ({...prevState, answers}))
    }
    const handleDeleteAnswer = (id) => {
        const updatedAnswer = {...data.answers};
        delete updatedAnswer[id];
        setData((prevData) => ({
            ...prevData,
            answers: updatedAnswer,
        }));
    };
    const addAnswer = () => {
        setForm("answers", {...data.answers, [uuidv4()]: {answer: '', is_correct: false}})
    }
    const submit = () => {
        router.post(route('test_question.edit', {test_question_id: test_question.id}), data);
    }
    return (
        <Layout}>
            <Form onSubmit={submit} fluid>
                <div className="flex flex-col gap-4 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tiêu đề bài kiểm tra</Form.ControlLabel>
                        <Form.Control
                            name="title" id="title"
                            onChange={(value) => setForm('title', value)} value={data.title}
                            placeholder="Tiêu đề "
                            errorMessage={errors.title}
                        />
                    </Form.Group>
                    <Form.Group controlId="specialties_id">
                        <Form.ControlLabel>Bài kiểm tra dành cho chuyên môn</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...specialties.map(specialty => ({
                                    label: specialty.name,
                                    value: specialty.id
                                }))
                            ]}
                            value={data.specialties_id}
                            onChange={(value) => setForm('specialties_id', value)}
                            name="specialties_id"
                            id="specialties_id"
                            placeholder="Chuyên môn"/>
                        <Form.ErrorMessage show={!!errors.specialties_id}>{errors.specialties_id}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="file_upload">
                        <Form.ControlLabel>File đã đính kèm</Form.ControlLabel>
                        {test_question.files.length > 0 ?
                            <div className="flex items-center gap-2">
                                {test_question.files.map((file_had_upload, index) => (
                                    <ButtonGroup block={true} key={index}>
                                        <Whisper placement="top"
                                                 speaker={<Tooltip>Ấn để tải</Tooltip>}>
                                            <IconButton as="a" target="_blank" appearance="ghost"
                                                        href={route('file.show', {filepath: file_had_upload.file_location})}
                                                        icon={
                                                            <AttachmentIcon/>}>{file_had_upload.file_real_name}</IconButton>
                                        </Whisper>
                                        <IconButton onClick={() => {
                                            Swal.fire({
                                                title: 'Bạn có muốn xóa file không ?',
                                                text: `Bạn có chắc chắn muốn xóa file ${file_had_upload.file_real_name}?`,
                                                icon: 'error',
                                                showCancelButton: true,
                                                confirmButtonText: 'Có, tôi chắc chắn!',
                                                cancelButtonText: 'Không, hủy bỏ!'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    router.patch(route('test_question.deleted_file'), {
                                                        test_question_id: test_question.id,
                                                        file_id: file_had_upload.id
                                                    }, {preserveScroll: true})
                                                }
                                            });
                                        }} icon={<TrashIcon/>} appearance="ghost" color="red"/>
                                    </ButtonGroup>
                                ))}
                            </div>
                            :
                            (<Message type={`info`} showIcon={true} className="font-bold">Không có file đính kèm
                                !</Message>)
                        }
                        <Form.ErrorMessage show={!!errors.file_upload}>{errors.file_upload}</Form.ErrorMessage>
                    </Form.Group>

                    <Form.Group controlId="file_upload">
                        <Form.ControlLabel>File đính kèm</Form.ControlLabel>
                        <Uploader
                            name="file_upload"
                            id="file_upload"
                            fileList={fileList}
                            autoUpload={false}
                            action=""
                            onChange={files => {
                                setFileList(files);
                                files = files.map((file) => {
                                    return file.blobFile;
                                })
                                setForm('file_upload', files)
                            }}
                        >
                            <Button type="button" appearance="primary" color="blue" startIcon={<FileUploadIcon/>}>Chọn
                                file (có thể chọn nhiều file)</Button>
                        </Uploader>
                        <Form.ErrorMessage show={!!errors.file_upload}>{errors.file_upload}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.ControlLabel>Nội dung</Form.ControlLabel>
                        <Editor minHeight={500} data={data.description} onChange={(event, editor) => {
                            let value = editor.getData();
                            setForm('description', value);
                        }}/>
                        <Form.ErrorMessage show={!!errors.description}>{errors.description}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.ControlLabel>Loại câu hỏi</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ..._.map(types, type => ({
                                    label: type.text,
                                    value: type.value
                                }))
                            ]}
                            value={data.type}
                            onChange={(value) => {
                                Swal.fire({
                                    title: 'Bạn có đổi loại câu hỏi ?',
                                    text: `Câu hỏi cũ sẽ bị mất nếu bạn đổi`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Có, tôi chắc chắn!',
                                    cancelButtonText: 'Không, hủy bỏ!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setForm('type', value)
                                        setForm('answers', {});
                                        if (value === constant.TYPE_TEXTAREA) {
                                            setForm('answers', {[uuidv4()]: {answer: '', is_correct: false}})
                                        }
                                    }
                                });

                            }}
                            name="type"
                            id="type"
                            placeholder="Chuyên môn"/>
                        <Form.ErrorMessage show={!!errors.type}>{errors.type}</Form.ErrorMessage>
                    </Form.Group>
                    <div className="my-8 space-y-4">
                        <Text size={'lg'} weight={'semibold'}>Câu trả lời</Text>
                        <TypeAnswers
                            handleAnswerChange={handleAnswerChange}
                            handleDeleteAnswer={handleDeleteAnswer}
                            addAnswer={addAnswer}
                            handleAnswerChangeRadio={handleAnswerChangeRadio}
                            setForm={setForm}
                            type={data.type}
                            errors={errors}
                            dataAnswers={data.answers}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green"> Chỉnh sửa </Button>
                </div>
            </Form>
        </Layout>
    )

}

export default Edit;
