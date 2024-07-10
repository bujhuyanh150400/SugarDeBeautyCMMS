import Layout from "@/Layouts/index.jsx";
import {useState} from "react";
import {Link, router} from "@inertiajs/react";
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    Grid,
    Pagination,
    Panel,
    Popover,
    Row,
    SelectPicker,
    Table, Text,
    Whisper
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search.js";
import PlusIcon from "@rsuite/icons/Plus.js";
import constant from "@/utils/constant.js";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const List = (props) => {
    let {facilities, list_day_off, dayoffStatus} = props;
    const login = props.auth.user;
    const [filter, setFilter] = useState({
        keyword: '',
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
        only: ['list_day_off']
    }
    const handlePagination = async (page) => {
        await router.get(route('dayoff.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('dayoff.list'), filter, optionsRouter);
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
                                        placeholder="ID,Email,SĐT nhân viên, hoặc id của đơn"/>
                                </Form.Group>
                            </Col>
                            {login.permission === constant.PermissionAdmin.ADMIN &&
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
                            }
                        </Row>
                        <Row gutter={12}>
                            <Col xl={24} as={"div"} className="flex items-center gap-2">
                                <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                    Tìm kiếm
                                </Button>
                                <Button type="button" startIcon={<PlusIcon/>}
                                        onClick={() => router.get(route('dayoff.view_add'))} color="green"
                                        appearance="primary">
                                    Tạo đơn xin nghỉ phép
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>
            <Table affixHeader rowHeight={100} autoHeight data={list_day_off.data}>
                <Table.Column flexGrow={1.5} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>Nhân viên</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            return (
                                <Text>{rowData.user.name} - {rowData.user.facility.name}</Text>
                            )
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={2} verticalAlign="start" align="start" fullText>
                    <Table.HeaderCell>Tiêu đề</Table.HeaderCell>
                    <Table.Cell dataKey="title"/>
                </Table.Column>
                <Table.Column flexGrow={2} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Nội dung</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <Whisper
                                placement="leftStart"
                                trigger="click"
                                speaker={<Popover arrow={true}>
                                    <div dangerouslySetInnerHTML={{__html: rowData.description}}></div>
                                </Popover>}
                            >
                                <div className="!w-full" dangerouslySetInnerHTML={{__html: rowData.description}}></div>
                            </Whisper>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Ngày nghỉ</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            const startDate = dayjs(rowData.start_date).format('DD-MM-YYYY HH:mm:ss');
                            const endDate = dayjs(rowData.end_date).format('DD-MM-YYYY HH:mm:ss');
                            return (
                                <div className={`flex flex-col gap-2`}>
                                    <span>Từ: {startDate}</span>
                                    <span>Đến: {endDate}</span>
                                </div>
                            )
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{dayoffStatus[rowData.status].text}</span>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {(rowData) => {
                            if (login.permission === constant.PermissionAdmin.ADMIN || login.id !== rowData.user_id) {
                                return (rowData.status === constant.DayOffStatus.WAIT ?
                                    (<ButtonGroup>
                                        <Button
                                            onClick={() =>
                                                Swal.fire({
                                                    title: 'Bạn có muốn duyệt đơn',
                                                    text: 'Bạn có chắc chắn muốn làm điều này?',
                                                    icon: 'success',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Có, tôi chắc chắn!',
                                                    cancelButtonText: 'Không, hủy bỏ!'
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        router.patch(route('dayoff.change_status', {dayoff_id: rowData.id}), {status: constant.DayOffStatus.ACTIVE})
                                                    }
                                                })}
                                            color="green" appearance="primary">
                                            Đồng ý
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                Swal.fire({
                                                    title: 'Bạn không muốn không duyệt đơn',
                                                    text: 'Bạn có chắc chắn muốn làm điều này?',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Có, tôi chắc chắn!',
                                                    cancelButtonText: 'Không, hủy bỏ!'
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        router.patch(route('dayoff.change_status', {dayoff_id: rowData.id}), {status: constant.DayOffStatus.DENIED})
                                                    }
                                                })}
                                            color="red" appearance="primary">
                                            Huỷ
                                        </Button>
                                    </ButtonGroup>) :
                                    (<span>Đơn đã đuợc duyệt</span>))
                            } else {
                                return  (<span></span>)
                            }
                        }}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {list_day_off.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={list_day_off.per_page}
                                activePage={list_day_off.current_page} total={list_day_off.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}

export default List;
