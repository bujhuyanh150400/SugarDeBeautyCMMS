import Layout from "@/Layouts/index.jsx";
import {useCallback, useState} from "react";
import {router} from "@inertiajs/react";
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    Grid, Input, Modal,
    Pagination,
    Panel,
    Placeholder,
    Row,
    Table,
} from "rsuite";
import dayjs from "dayjs";
import constant from "@/utils/constant.js";
import SearchIcon from "@rsuite/icons/Search";
import PlusIcon from "@rsuite/icons/Plus";
import _ from "lodash";
import {setLoading} from "@/redux/reducers/AppSlice.js";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const List = (props) => {
    let {configs, errors} = props;

    const dispatch = useDispatch();

    const [filter, setFilter] = useState({
        config_key: '',
    })
    const handleChangeFilter = (key, value) => {
        setFilter(values => ({
            ...values,
            [key]: value,
        }))
    }
    const optionsRouter = {
        replace: true,
        preserveState: true,
        only: ['configs']
    }
    const handlePagination = async (page) => {
        await router.get(route('config.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('config.list'), filter, optionsRouter);
    }

    const [formModal, setFormModal] = useState(false);

    const initForm = {
        id: '',
        config_key: '',
        config_value: '',
        description: '',
    }
    const [form, setForm] = useState(initForm);

    const setDataForm = (key, value) => setForm((prevState) => ({...prevState, [key]: value}));

    const getInfoConfig = async (id) => {
        try {
            dispatch(setLoading(true));
            const {data} = await axios.get(route('config.edit', {config_id: id}), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Inertia': true,
                },
            });
            setForm(data);
            setFormModal(true);
        } catch (error) {
            toast.error(error?.response?.data ? error.response.data : 'Lỗi hệ thống, vui lòng liên hệ với quản trị viên')
        } finally {
            dispatch(setLoading(false));
        }
    }


    const submitFormConfig = async () => {
        if (form.id > 0) {
            router.patch(route('config.edit', {config_id: form.id}), form, {
                onSuccess: () => {
                    setForm(initForm);
                    setFormModal(false);
                }
            });
        } else {
            router.post(route('config.add'), form, {
                onSuccess: () => {
                    setForm(initForm);
                    setFormModal(false);
                }
            });
        }
    }
    return (
        <>
            <Layout>
                <Panel header={<div className="roboto">Tìm kiếm <SearchIcon/></div>} bordered shaded className="mb-8">
                    <Form onSubmit={filterForm} fluid>
                        <Grid gutter={16} fluid>
                            <Row gutter={12} className="mb-4">
                                <Col xl={6} lg={12} md={24}>
                                    <Form.Group controlId="filter_config_key">
                                        <Form.ControlLabel>Lọc theo Keyword</Form.ControlLabel>
                                        <Form.Control
                                            value={filter.config_key}
                                            onChange={(value) => handleChangeFilter('config_key', value)}
                                            name="filter_config_key"
                                            id="filter_config_key"
                                            placeholder="Tìm theo config_key"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col xl={24} as={"div"} className="flex items-center gap-2">
                                    <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                        Tìm kiếm
                                    </Button>
                                    <Button type="button" startIcon={<PlusIcon/>}
                                            onClick={() => setFormModal(true)}
                                            color={'green'}
                                            appearance="primary">
                                        Tạo config mới
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Form>
                </Panel>
                <Table affixHeader rowHeight={100} autoHeight data={configs.data}>
                    <Table.Column flexGrow={1.5} verticalAlign="center" align="center" fullText>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.Cell dataKey="id"/>
                    </Table.Column>
                    <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                        <Table.HeaderCell>KEY</Table.HeaderCell>
                        <Table.Cell dataKey="config_key"/>
                    </Table.Column>
                    <Table.Column flexGrow={2} verticalAlign="center" align="center" fullText>
                        <Table.HeaderCell>VALUE</Table.HeaderCell>
                        <Table.Cell dataKey="config_value"/>
                    </Table.Column>
                    <Table.Column flexGrow={2} verticalAlign="center" align="start" fullText>
                        <Table.HeaderCell>Mô tả</Table.HeaderCell>
                        <Table.Cell dataKey="description"/>
                    </Table.Column>
                    <Table.Column verticalAlign="center" flexGrow={1} align="center" fullText>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.Cell>
                            {rowData =>
                                (<ButtonGroup>
                                    <Button appearance={'primary'} color={`green`}
                                            onClick={() => getInfoConfig(rowData.id)}>
                                        Sửa
                                    </Button>
                                    <Button appearance={'primary'} color={`red`} onClick={() => {
                                        Swal.fire({
                                            title: 'Bạn có muốn xoá config này, xóa config có thể sẽ làm ảnh hưởng đên hệ thống',
                                            text: 'Bạn có chắc chắn muốn làm điều này?',
                                            icon: 'error',
                                            showCancelButton: true,
                                            confirmButtonText: 'Có, tôi chắc chắn!',
                                            cancelButtonText: 'Không, hủy bỏ!'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                router.delete(route('config.deleted', {config_id: rowData.id}))
                                            }
                                        });
                                    }}>
                                        Xóa
                                    </Button>
                                </ButtonGroup>)
                            }
                        </Table.Cell>
                    </Table.Column>
                </Table>
                {configs.total > 0 && (
                    <div className="my-8 flex w-full justify-center items-center">
                        <Pagination prev next ellipsis size="lg" limit={configs.per_page}
                                    activePage={configs.current_page} total={configs.total}
                                    onChangePage={handlePagination}/>
                    </div>
                )}
            </Layout>
            <Modal open={formModal} onClose={() => setFormModal(false)}>
                <Modal.Header>
                    <Modal.Title>{form.id > 0 ? `Sửa` : 'Tạo'} Config</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <Form.Group controlId="config_key">
                            <Form.ControlLabel>Config Key</Form.ControlLabel>
                            <Form.Control
                                value={form.config_key}
                                onChange={(value) => setDataForm('config_key', value.toUpperCase())}
                                name="config_key"
                                id="config_key"
                                placeholder="config_key"/>
                            <Form.ErrorMessage show={!!errors.config_key}>{errors.config_key}</Form.ErrorMessage>
                        </Form.Group>
                        <Form.Group controlId="config_key">
                            <Form.ControlLabel>Config Value</Form.ControlLabel>
                            <Form.Control
                                value={form.config_value}
                                onChange={(value) => setDataForm('config_value', value)}
                                name="config_value"
                                id="config_value"
                                placeholder="config_value"/>
                            <Form.ErrorMessage show={!!errors.config_value}>{errors.config_value}</Form.ErrorMessage>
                        </Form.Group>
                        <Form.Group controlId="config_key">
                            <Form.ControlLabel>Ghi chú</Form.ControlLabel>
                            <Input name="description"
                                   id="description"
                                   rows={5}
                                   value={form.description}
                                   as="textarea"
                                   onChange={(value) => setDataForm('description', value)}
                            />
                            <Form.ErrorMessage show={!!errors.description}>{errors.description}</Form.ErrorMessage>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className={`flex items-center justify-end gap-2`}>
                        <Button type={`button`} onClick={submitFormConfig} appearance="primary">
                            Lưu
                        </Button>
                        <Button onClick={() => setFormModal(false)} appearance="subtle">
                            Đóng
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>


    )
}

export default List;
