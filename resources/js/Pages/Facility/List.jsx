import Layout from "@/Layouts/index.jsx";
import {useState} from "react";
import {Link, router} from "@inertiajs/react";
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    Grid, Modal,
    Pagination,
    Panel,
    Row,
    SelectPicker,
    Table,
    Text
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search.js";
import PlusIcon from "@rsuite/icons/Plus.js";
import constant from "@/utils/constant.js";
import EditIcon from "@rsuite/icons/Edit.js";
import OffIcon from '@rsuite/icons/Off';
import RemindIcon from "@rsuite/icons/legacy/Remind.js";

const List = (props) => {
    const {facilities} = props;

    const [filter, setFilter] = useState({
        keyword: '',
        active: '',
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
        only: ['facilities']
    }
    const handlePagination = async (page) => {
        await router.get(route('facilities.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('facilities.list'), filter, optionsRouter);
    }
    const [alertActiveStatus, setAlertActiveStatus] = useState({
        id: null,
        openAlert: false,
        active: null,
    });
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
                                        placeholder="ID, Tên, Địa chỉ Cơ sở"/>
                                </Form.Group>
                            </Col>
                            <Col xl={6} lg={12} md={24}>
                                <Form.Group controlId="permission">
                                    <Form.ControlLabel>Lọc theo Trạng thái hoạt động</Form.ControlLabel>
                                    <SelectPicker
                                        block
                                        data={constant.ActiveStatus}
                                        value={filter.active}
                                        onChange={(value) => handleChangeFilter('active', value)}
                                        name="active"
                                        id="active"
                                        placeholder="Tìm kiếm theo trạng thái hoạt động"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col xl={24} as={"div"} className="flex items-center gap-2">
                                <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                    Tìm kiếm
                                </Button>
                                <Button type="button" startIcon={<PlusIcon/>}
                                        onClick={() => router.get(route('facilities.view_add'))} color="green"
                                        appearance="primary">
                                    Thêm cơ sở
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>
            <Table affixHeader rowHeight={100} autoHeight data={facilities.data}>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tên cơ sở</Table.HeaderCell>
                    <Table.Cell dataKey="name"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Địa chỉ</Table.HeaderCell>
                    <Table.Cell dataKey="address"/>
                </Table.Column>
                <Table.Column flexGrow={0.5} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Số nhân viên hiện có</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{rowData.users.length} nhân sự</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <ButtonGroup>
                                <Button as={Link} href={route('facilities.view_edit', {facility_id: rowData.id})}
                                        startIcon={<EditIcon/>} color="green" appearance="primary">Sửa</Button>
                                {rowData.active === constant.ACTIVE ? (
                                    <Button startIcon={<OffIcon/>} color="blue" appearance="primary"
                                            onClick={() => {
                                                setAlertActiveStatus({
                                                    id: rowData.id,
                                                    active: constant.IN_ACTIVE,
                                                    openAlert: true
                                                });
                                            }}
                                    >Hoạt động</Button>
                                ) : (
                                    <Button startIcon={<OffIcon/>} color="red" appearance="primary"
                                            onClick={() => {
                                                setAlertActiveStatus({
                                                    id: rowData.id,
                                                    active: constant.ACTIVE,
                                                    openAlert: true
                                                });
                                            }}
                                    >Không hoạt động</Button>
                                )}
                            </ButtonGroup>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {facilities.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={facilities.per_page}
                                activePage={facilities.current_page} total={facilities.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
            {/*Modal alert đổi trạng thái */}
            <Modal backdrop="static" role="alertdialog" open={alertActiveStatus.openAlert} size="xs">
                <Modal.Body>
                    <RemindIcon className="text-amber-500 text-2xl"/>
                    Bạn có muốn cho cơ sở
                    này {alertActiveStatus.active === constant.ACTIVE ? 'hoạt động' : 'không hoạt động'}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setAlertActiveStatus(value => ({
                            ...value,
                            openAlert: false
                        }));
                        router.patch(route('facilities.change_active', {facility_id: alertActiveStatus.id}), {active: alertActiveStatus.active}, {preserveScroll: true})
                    }} appearance="primary" color="red">
                        Có
                    </Button>
                    <Button onClick={() => {
                        setAlertActiveStatus(value => ({
                            ...value,
                            openAlert: false
                        }));
                    }} appearance="subtle">
                        Không
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}
export default List
