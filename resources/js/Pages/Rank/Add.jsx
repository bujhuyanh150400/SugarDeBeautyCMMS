import {useForm} from "@inertiajs/react";
import Layout from "@/Layouts/index.jsx";
import {Button, Form, InputNumber} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus.js";
import Editor from "@/Components/Editor.jsx";

const Add = () => {
    const {data, setData, post, errors} = useForm({
        title: '',
        percent_rank: 0,
        description: '',
    });
    const submit = async () => {
        await post(route('rank.add'), data);
    }
    return (
        <Layout back_to={route('facilities.list')}>
            <Form onSubmit={submit} fluid>
                <div className="flex flex-col gap-2 mb-4">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tiêu đề cấp bậc</Form.ControlLabel>
                        <Form.Control
                            name="name" id="name"
                            onChange={(value) => setData('title', value)} value={data.title}
                            placeholder="Tên cơ sở"
                            errorMessage={errors.title}
                        />
                    </Form.Group>
                    <Form.Group controlId="percent_rank">
                        <Form.ControlLabel>Phần trăm mức lương</Form.ControlLabel>
                        <InputNumber name="percent_rank" id="percent_rank"
                                     min={0}
                                     value={data.percent_rank}
                                     onChange={(value) => setData('percent_rank', value)}
                                     postfix="%"/>
                        <Form.ErrorMessage show={!!errors.percent_rank}>{errors.percent_rank}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.ControlLabel>Trạng thái hoạt động</Form.ControlLabel>
                        <Editor data={data.description} onChange={(event, editor) => {
                            let value = editor.getData();
                            setData('description', value);
                        }}/>
                        <Form.ErrorMessage show={!!errors.description}>{errors.description}</Form.ErrorMessage>
                    </Form.Group>
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" appearance="primary" color="green" startIcon={<PlusIcon/>}>Tạo cấp bậc mới</Button>
                </div>
            </Form>
        </Layout>
    )
}
export default Add
