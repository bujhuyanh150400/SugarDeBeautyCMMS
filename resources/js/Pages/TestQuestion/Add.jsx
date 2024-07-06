import Layout from "@/Layouts/index.jsx";
import {router, useForm} from "@inertiajs/react";
import {
    Button,
    Form,
    IconButton,
    Input,
    InputNumber,
    Message,
    SelectPicker,
    Text,
    Uploader,
    Checkbox,
    CheckboxGroup, RadioGroup, Radio
} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import {useEffect, useState} from "react";
import Editor from "@/Components/Editor.jsx";
import FileUploadIcon from "@rsuite/icons/FileUpload.js";
import _ from "lodash";
import constant from "@/utils/constant.js";
import HelperFunction from "@/utils/HelperFunction.js";
import TrashIcon from "@rsuite/icons/Trash.js";
import {v4 as uuidv4} from "uuid";
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
        if (errors?.answers){
            toast.error(errors.answers);
        }
    }, [errors])
    switch (type) {
        case constant.TYPE_CHECKBOX:
            return (
                <>
                    <Button className={`my-4`} size={'sm'} onClick={addAnswer} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm câu trả lời</Button>
                    <CheckboxGroup name="checkbox-answers">
                        {!_.isEmpty(dataAnswers) && _.map(dataAnswers, (answer, id) =>
                            <Checkbox key={id} value={id}
                                      checked={!!answer.is_correct}
                                      onChange={(value, checked) => handleAnswerChange(value, 'is_correct', checked)}>
                                <Input as={'textarea'} value={answer.answer}
                                       placeholder={`Nhập câu trả lời`}
                                       onChange={value => handleAnswerChange(id, 'answer', value)}/>
                                <IconButton block={true} className={`my-4`} color={`red`} appearance={`ghost`}
                                            icon={<TrashIcon/>} onClick={() => handleDeleteAnswer(id)}/>
                            </Checkbox>
                        )}
                    </CheckboxGroup>
                </>
            )
        case constant.TYPE_RADIO:
            return (
                <>
                    <Button className={`my-4`} size={'sm'} onClick={addAnswer} type="button" appearance="primary"
                            color="green" startIcon={<PlusIcon/>}>Thêm câu trả lời</Button>
                    <RadioGroup name="radio-answers">
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
                    </RadioGroup>
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

const Add = (props) => {
    const {specialties, types, errors} = props;

    const initData = {
        title: '',
        description: '',
        specialties_id: '',
        type: '',
        file_upload: [],
        answers: {},
    }
    const [data, setData] = useState(initData);
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
    const [fileList, setFileList] = useState([]);
    const submit = () => {
        router.post(route('test_question.add'), data);
    }
    return (
        <Layout back_to={route('test_question.list')}>
            <Form onSubmit={submit} fluid>
                <div className="flex flex-col gap-4 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tiêu đề bài kiểm tra</Form.ControlLabel>
                        <Form.Control
                            name="title" id="title"
                            onChange={(value) => setForm('title', value)} value={data.title}
                            placeholder="Tiêu đề"
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
                        <Editor minHeight={200} data={data.description} onChange={(event, editor) => {
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
                                setForm('type', value)
                                setForm('answers', {});
                                if (value === constant.TYPE_TEXTAREA) {
                                    setForm('answers', {[uuidv4()]: {answer: '', is_correct: false}})
                                }
                            }}
                            name="type"
                            id="type"
                            placeholder="Chuyên môn"/>
                        <Form.ErrorMessage show={!!errors.type}>{errors.type}</Form.ErrorMessage>
                    </Form.Group>
                </div>
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
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green" startIcon={<PlusIcon/>}> Tạo </Button>
                </div>
            </Form>
        </Layout>
    )


}

export default Add;
