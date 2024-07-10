import Layout from "@/Layouts/index.jsx";
import {router, useForm} from "@inertiajs/react";
import {Button, Form, SelectPicker, Uploader} from "rsuite";
import constant from "@/utils/constant.js";
import PlusIcon from "@rsuite/icons/Plus";
import {useState} from "react";
import Editor from "@/Components/Editor.jsx";
import FileUploadIcon from "@rsuite/icons/FileUpload.js";


const Add = (props) => {

    const {specialties, errors} = props;


    const initData = {
        title: '',
        description: '',
        specialties_id: '',
        file_upload: [],
    }

    const [data, setData] = useState(initData);


    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}))

    const [fileList, setFileList] = useState([]);

    const submit = () => {
        router.post(route('workflow.add'), data);
    }


    return (
        <Layout>
            <Form onSubmit={submit} fluid>
                <div className="flex flex-col gap-4 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tiêu đề quy trình</Form.ControlLabel>
                        <Form.Control
                            name="title" id="title"
                            onChange={(value) => setForm('title', value)} value={data.title}
                            placeholder="Tiêu đề quy trình"
                            errorMessage={errors.title}
                        />
                    </Form.Group>
                    <Form.Group controlId="specialties_id">
                        <Form.ControlLabel>Quy trình cho chuyên môn</Form.ControlLabel>
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
                            <Button type="button" appearance="primary" color="blue" startIcon={<FileUploadIcon/>}>Chọn file (có thể chọn nhiều file)</Button>
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
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green" startIcon={<PlusIcon/>}> Tạo </Button>
                </div>
            </Form>
        </Layout>
    )


}

export default Add;
