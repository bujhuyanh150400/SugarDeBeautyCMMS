import Layout from "@/Layouts/index.jsx";
import {Link, router} from "@inertiajs/react";
import {useState} from "react";
import {
    Avatar,
    Text,
    Col,
    Grid,
    Row,
    Table,
    Divider,
    Button,
    Pagination,
    Form,
    Panel, SelectPicker, Modal, Whisper, Popover
} from "rsuite";
import constant from "@/utils/constant.js";
import EditIcon from '@rsuite/icons/Edit';
import SearchIcon from '@rsuite/icons/Search';
import QRCode from "@/Components/QRCode.jsx";

const List = (props) => {
    let {facilities, users} = props;
    const [filter, setFilter] = useState({
        keyword: '',
        permission: '',
        facility: '',
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
        only: ['users']
    }
    const handlePagination = async (page) => {
        await router.get(route('time_attendance.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('time_attendance.list'), filter, optionsRouter);
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
                                        placeholder="ID,Email,SĐT nhân viên"/>
                                </Form.Group>
                            </Col>
                            <Col xl={6} lg={12} md={24}>
                                <Form.Group controlId="facility">
                                    <Form.ControlLabel>Lọc theo cơ sở</Form.ControlLabel>
                                    <SelectPicker
                                        block
                                        data={[
                                            {label: 'Lựa chọn', value: ""},
                                            ...facilities.map(facility => ({
                                                label: `${facility.name} - ${facility.address}`,
                                                value: facility.id
                                            }))
                                        ]}
                                        value={filter.facility}
                                        onChange={(value) => handleChangeFilter('facility', value)}
                                        name="facility"
                                        id="facility"
                                        placeholder="Tìm kiếm theo cơ sở làm việc"/>
                                </Form.Group>
                            </Col>
                            <Col xl={6} lg={12} md={24}>
                                <Form.Group controlId="permission">
                                    <Form.ControlLabel>Lọc theo quyền hành</Form.ControlLabel>
                                    <SelectPicker
                                        block
                                        data={[
                                            {label: 'Lựa chọn', value: ""},
                                            ...Object.values(props.auth.permission).map(permission => ({
                                                label: permission.text,
                                                value: permission.value
                                            }))
                                        ]}
                                        value={filter.permission}
                                        onChange={(value) => handleChangeFilter('permission', value)}
                                        name="permission"
                                        id="permission"
                                        placeholder="Tìm kiếm theo quyền hành"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col xl={24} as={"div"} className="flex items-center gap-2">
                                <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                    Tìm kiếm
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>

            <Table affixHeader rowHeight={100} autoHeight data={users.data}>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id"/>
                </Table.Column>

                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tên nhân viên</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <div className="flex items-center">
                                <Text color="blue"
                                      weight="bold">{props.auth.permission[rowData.permission]?.text}</Text>
                                <Divider vertical/>
                                {rowData.name}
                            </div>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1} align="start" fullText>
                    <Table.HeaderCell>Cơ sở</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (<div className="flex items-center">
                            <Text color="blue" weight="bold">{rowData.facility.name}</Text>
                            <Divider vertical/>
                            <Text>{rowData.facility.address}</Text>
                        </div>)}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>QR code</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            if (rowData.time_attendance) {
                                const short_url = route('short_url', {short_url: rowData.time_attendance.short_url});
                                return (<Whisper
                                    placement="topStart"
                                    trigger="click"
                                    speaker={<Popover arrow={true}><QRCode url={short_url} size={150}></QRCode></Popover>}
                                >
                                    <Button>
                                        Xem QR code
                                    </Button>
                                </Whisper>);
                            } else {
                                return (<p>None</p>)
                            }
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center">
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            return (
                                <div className="flex items-center gap-4">
                                    <Button as={Link} href={route('time_attendance.control', {user_id: rowData.id})}
                                            startIcon={<EditIcon/>} color="blue" appearance="primary">Sửa chấm công</Button>
                                </div>
                            )
                        }}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {users.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={users.per_page} activePage={users.current_page}
                                total={users.total} onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}

export default List;
