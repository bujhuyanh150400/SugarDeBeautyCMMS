import Layout from "@/Layouts/index.jsx";
import {Button, ButtonGroup, Col, Form, Grid, Pagination, Panel, Row, SelectPicker, Table} from "rsuite";
import {Link, router} from "@inertiajs/react";
import SearchIcon from "@rsuite/icons/Search.js";
import PlusIcon from "@rsuite/icons/Plus.js";
import {useState} from "react";
import EditIcon from "@rsuite/icons/Edit.js";
import TrashIcon from "@rsuite/icons/Trash.js";
import Swal from "sweetalert2";


const List = (props) => {
    const {specialties,test_questions} = props;

    const [filter, setFilter] = useState({
        keyword: '',
        specialties_id: '',
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
        only: ['test_questions']
    }
    const handlePagination = async (page) => {
        await router.get(route('test_question.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('test_question.list'), filter, optionsRouter);
    }

    return (
        <Layout>
            <Panel header={<div className="roboto">Tìm kiếm <SearchIcon/></div>} bordered shaded className="mb-8">
                <Form onSubmit={filterForm} fluid>
                    <Grid gutter={16} fluid>
                        <Row gutter={12} className="mb-4">
                            <Col xl={6} lg={12} md={24}>
                                <Form.Group controlId="keyword">
                                    <Form.ControlLabel>Lọc theo Keyword</Form.ControlLabel>
                                    <Form.Control
                                        value={filter.keyword}
                                        onChange={(value) => handleChangeFilter('keyword', value)}
                                        name="keyword"
                                        id="keyword"
                                        placeholder="ID, tiêu đề"/>
                                </Form.Group>
                            </Col>
                            <Col xl={6} lg={12} md={24}>
                                <Form.Group controlId="specialties_id">
                                    <Form.ControlLabel>Lọc theo chuyên ngành</Form.ControlLabel>
                                    <SelectPicker
                                        block
                                        data={[
                                            {label: 'Lựa chọn', value: ""},
                                            ...specialties.map(specialty => ({
                                                label: specialty.name,
                                                value: specialty.id
                                            }))
                                        ]}
                                        value={filter.specialties_id}
                                        onChange={(value) => handleChangeFilter('specialties_id', value)}
                                        name="specialties_id"
                                        id="specialties_id"
                                        placeholder="Chuyên môn"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col xl={24} as={"div"} className="flex items-center gap-2">
                                <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                    Tìm kiếm
                                </Button>
                                <Button type="button" startIcon={<PlusIcon/>}
                                        onClick={() => router.get(route('test_question.view_add'))} color="green"
                                        appearance="primary">
                                    Thêm bài test
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>
            <Table affixHeader rowHeight={100} autoHeight data={test_questions.data}>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id"/>
                </Table.Column>
                <Table.Column flexGrow={2} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tiêu đề</Table.HeaderCell>
                    <Table.Cell dataKey="title"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Dành cho chuyên ngành</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{rowData.specialties.name}</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <ButtonGroup>
                                <Button as={Link} href={route('test_question.view_edit', {test_question_id: rowData.id})} startIcon={<EditIcon/>} color="green" appearance="primary">Sửa</Button>
                                <Button startIcon={<TrashIcon/>} color="red" appearance="primary"
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Bạn có muốn xóa bài test không ?',
                                                text: `Bạn có chắc chắn muốn xóa bài test ?`,
                                                icon: 'error',
                                                showCancelButton: true,
                                                confirmButtonText: 'Có, tôi chắc chắn!',
                                                cancelButtonText: 'Không, hủy bỏ!'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    router.patch(route('test_question.deleted',{test_question_id: rowData.id}), {}, {preserveScroll: true})
                                                }
                                            });

                                        }}
                                >Xóa</Button>
                            </ButtonGroup>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {test_questions.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={test_questions.per_page} activePage={test_questions.current_page} total={test_questions.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )

}

export default List;
