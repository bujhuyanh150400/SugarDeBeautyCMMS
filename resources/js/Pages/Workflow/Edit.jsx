import Layout from "@/Layouts/index.jsx";
import {Button, ButtonGroup, Form, IconButton, Message, SelectPicker, Tooltip, Uploader, Whisper} from "rsuite";
import Editor from "@/Components/Editor.jsx";
import PlusIcon from "@rsuite/icons/Plus.js";
import {useState} from "react";
import {router} from "@inertiajs/react";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import AttachmentIcon from "@rsuite/icons/Attachment";
import TrashIcon from "@rsuite/icons/Trash.js";
import Swal from "sweetalert2";


const Edit = (props) => {

    const {specialties, errors, workflow} = props;

    const initData = {
        title: workflow.title,
        description: workflow.description,
        specialties_id: workflow.specialties_id,
        file_upload: [],
    }
    const [data, setData] = useState(initData);
    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}))

    const [fileList, setFileList] = useState([]);

    const submit = () => {
        router.post(route('workflow.edit', {workflow_id: workflow.id}), data);
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
                        <Form.ControlLabel>File đã đính kèm</Form.ControlLabel>
                        {workflow.files.length > 0 ?
                            <div className="flex items-center gap-2">
                                {workflow.files.map((file_had_upload, index) => (
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
                                                    router.patch(route('workflow.deleted_file'), {
                                                        workflow_id: workflow.id,
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
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green"> Chỉnh sửa </Button>
                </div>
            </Form>
        </Layout>
    )

}

export default Edit;
