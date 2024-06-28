import Layout from "@/Layouts/index.jsx";
import {useState} from "react";
import {Link, router} from "@inertiajs/react";
import {
    Avatar,
    Button,
    ButtonGroup,
    Col,
    Divider,
    Form,
    Grid, Pagination,
    Panel, Popover,
    Row,
    SelectPicker,
    Table,
    Text,
    Whisper
} from "rsuite";
import constant from "@/utils/constant.js";
import SearchIcon from "@rsuite/icons/Search";
import PlusIcon from "@rsuite/icons/Plus";
import dayjs from "dayjs";
import HelperFunction from "@/utils/HelperFunction.js";
import OffIcon from "@rsuite/icons/Off.js";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

const List = (props) => {
    const {specialties,workflows} = props;

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
        only: ['workflows']
    }
    const handlePagination = async (page) => {
        await router.get(route('workflow.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('workflows.list'), filter, optionsRouter);
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
                                        onClick={() => router.get(route('workflow.view_add'))} color="green"
                                        appearance="primary">
                                    Thêm quy trình
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>

            <Table affixHeader rowHeight={100} autoHeight data={workflows.data}>
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
                                <Button as={Link} href={route('workflow.view', {workflow_id: rowData.id})} color="blue" appearance="primary">Xem chi tiết</Button>
                                <Button as={Link} href={route('workflow.view_edit', {workflow_id: rowData.id})}
                                        startIcon={<EditIcon/>} color="green" appearance="primary">Sửa</Button>
                                <Button startIcon={<TrashIcon/>} color="red" appearance="primary"
                                        onClick={() => {}}
                                >Xóa</Button>
                            </ButtonGroup>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {workflows.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={workflows.per_page} activePage={workflows.current_page} total={workflows.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}

export default List;
