import Layout from "@/Layouts/index.jsx";
import {SelectPicker, CheckPicker, Form, Uploader, Button, Input, InputNumber} from "rsuite";
import _ from "lodash";
import {useState} from "react";
import Editor from "@/Components/Editor.jsx";
import PlusIcon from "@rsuite/icons/Plus.js";
import {router} from "@inertiajs/react";


const Add = props => {
    const {users, workflows, test_questions,errors} = props;
    const initData = {
        title: '',
        description: '',
        time: 0,
        users: [],
        workflows: [],
        test_questions: [],
    }
    const [data, setData] = useState(initData);
    const setForm = (key, value) => setData((prevState) => ({...prevState, [key]: value}));
    const submit = () => {
        router.post(route('training_route.add'), data);
    }
    return (
        <Layout>
            <Form onSubmit={submit} fluid>
                <div className="flex flex-col gap-4 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tiêu đề đào tạo</Form.ControlLabel>
                        <Form.Control
                            name="title" id="title"
                            onChange={(value) => setForm('title', value)} value={data.title}
                            placeholder="Tiêu đề quy trình"
                            errorMessage={errors.title}
                        />
                    </Form.Group>
                    <Form.Group controlId="users">
                        <Form.ControlLabel>Các nhân viên chọn đào tạo</Form.ControlLabel>
                        <CheckPicker
                            block
                            data={[
                                ...users.map(user => ({
                                    label: `${user.name} - ${user.facility.name} - ${user.specialties.name}`,
                                    value: user.id
                                }))
                            ]}
                            value={data.users}
                            onChange={(value) => setForm('users', value)}
                            name="users"
                            id="users"
                            placeholder="Nhân viên"/>
                        <Form.ErrorMessage show={!!errors.users}>{errors.users}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="workflows">
                        <Form.ControlLabel>Quy trình đính kèm</Form.ControlLabel>
                        <CheckPicker
                            block
                            data={[
                                ...workflows.map(workflow => ({
                                    label: `${workflow.title} - ${workflow.specialties.name}`,
                                    value: workflow.id
                                }))
                            ]}
                            value={data.workflows}
                            onChange={(value) => setForm('workflows', value)}
                            name="workflows"
                            id="workflows"
                            placeholder="Quy trình đính kèm"/>
                        <Form.ErrorMessage show={!!errors.workflows}>{errors.workflows}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="test_questions">
                        <Form.ControlLabel>Các bài thi trong đào tạo</Form.ControlLabel>
                        <CheckPicker
                            block
                            data={[
                                ...test_questions.map(test_question => ({
                                    label: `${test_question.title} - ${test_question.specialties.name}`,
                                    value: test_question.id
                                }))
                            ]}
                            value={data.test_questions}
                            onChange={(value) => setForm('test_questions', value)}
                            name="test_questions"
                            id="test_questions"
                            placeholder="Bài thi trong đào tạo"/>
                        <Form.ErrorMessage show={!!errors.test_questions}>{errors.test_questions}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Thời gian làm bài thi</Form.ControlLabel>
                        <InputNumber
                            name="time" id="time"
                            min={0}
                            onChange={(value) => setForm('time', value)} value={data.time}
                            placeholder={'Tối thiều 10 phút'}
                            postfix="Phút"/>
                        <Form.ErrorMessage show={!!errors.time}>{errors.time}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.ControlLabel>Mô tả về đào tạo</Form.ControlLabel>
                        <Editor minHeight={200} data={data.description} onChange={(event, editor) => {
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
