import Layout from "@/Layouts/index.jsx";
import {useState} from "react";
import {Link, router} from "@inertiajs/react";
import {Button, ButtonGroup, Col, Form, Grid, Pagination, Panel, Row, SelectPicker, Table} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import PlusIcon from "@rsuite/icons/Plus";
import Swal from "sweetalert2";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import _ from 'lodash'
import PeoplesCostomizeIcon from '@rsuite/icons/PeoplesCostomize';
import constant from "@/utils/constant.js";

const List = (props) => {
    const {training_routes} = props;
    const login = props.auth.user;
    const [filter, setFilter] = useState({
        keyword: '',
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
        only: ['training_routes']
    }
    const handlePagination = async (page) => {
        await router.get(route('training_routes.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('training_routes.list'), filter, optionsRouter);
    }
    return (
        <Layout>
            {login.permission !== constant.PermissionAdmin.EMPLOYEE &&
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
                            </Row>
                            <Row gutter={12}>
                                <Col xl={24} as={"div"} className="flex items-center gap-2">
                                    <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                        Tìm kiếm
                                    </Button>
                                    <Button type="button" startIcon={<PlusIcon/>}
                                            onClick={() => router.get(route('training_route.view_add'))} color="green"
                                            appearance="primary">
                                        Thêm Đào tạo
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Form>
                </Panel>
            }
            <Table affixHeader rowHeight={100} autoHeight data={training_routes.data}>
                <Table.Column flexGrow={2} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tiêu đề</Table.HeaderCell>
                    <Table.Cell dataKey="title"/>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={0.5} align="center" fullText>
                    <Table.HeaderCell>Số câu hỏi</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{rowData.test_questions_count}</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={0.5} align="center" fullText>
                    <Table.HeaderCell>Số workflows đính kèm</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{rowData.workflows_count}</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={0.5} align="center" fullText>
                    <Table.HeaderCell>Số nhân viên làm bài</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{_.size(rowData.users)}</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={0.5} align="center" fullText>
                    <Table.HeaderCell>Thời gian làm bài</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{rowData.time} Phút</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {

                            const training_self =
                                login.permission == constant.PermissionAdmin.EMPLOYEE ?
                                rowData.users.find(user => user.id === login.id && user?.pivot?.score === null && user?.pivot?.time_did === null && user?.pivot?.time_start === null) : null;

                            return (
                                <ButtonGroup>
                                    {!_.isEmpty(training_self) ?
                                        <Button as={Link}
                                                href={route('training_route.view_test', {training_route_id: rowData.id})}
                                                startIcon={<PeoplesCostomizeIcon />} color="blue" appearance="primary">Làm bài thi</Button>
                                        :
                                        <Button as={Link}
                                                href={route('training_route.view', {training_route_id: rowData.id})}
                                                startIcon={<PeoplesCostomizeIcon />} color="blue" appearance="primary">Xem danh sách kết quả</Button>
                                    }
                                    {login.permission !== constant.PermissionAdmin.EMPLOYEE &&
                                        (
                                            <>
                                                <Button as={Link}
                                                        href={route('training_route.view_edit', {training_route_id: rowData.id})}
                                                        startIcon={<EditIcon/>} color="green" appearance="primary">Sửa</Button>
                                                <Button startIcon={<TrashIcon/>} color="red" appearance="primary"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: 'Bạn có muốn xóa bài thi đào tạo không ?',
                                                                text: `Bạn có chắc chắn muốn xóa bài thi đào tạo ?`,
                                                                icon: 'error',
                                                                showCancelButton: true,
                                                                confirmButtonText: 'Có, tôi chắc chắn!',
                                                                cancelButtonText: 'Không, hủy bỏ!'
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    router.patch(route('training_route.deleted', {training_route_id: rowData.id}), {}, {preserveScroll: true})
                                                                }
                                                            });

                                                        }}
                                                >Xóa</Button>
                                            </>
                                        )
                                    }
                                </ButtonGroup>

                            )
                        }}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {training_routes.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={training_routes.per_page}
                                activePage={training_routes.current_page} total={training_routes.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}


export default List;
