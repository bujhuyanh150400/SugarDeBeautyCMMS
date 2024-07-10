import Layout from "@/Layouts/index.jsx";
import {
    Button,
    ButtonGroup,
    Col,
    DateRangePicker, Divider,
    Form,
    Grid, Pagination,
    Panel,
    Popover,
    Row,
    SelectPicker,
    Table, Text,
    Whisper
} from "rsuite";
import {Link, router} from "@inertiajs/react";
import {useState} from "react";
import SearchIcon from "@rsuite/icons/Search.js";
import _ from "lodash";
import HelperFunction from "@/utils/HelperFunction.js";
import dayjs from "dayjs";
import PlusIcon from "@rsuite/icons/Plus";
import toast from "react-hot-toast";
import constant from "@/utils/constant.js";

const List = (props) => {
    const {salaries, users, query, salaryStatus, facilities, is_pay} = props
    const currentMonth = dayjs().month() + 1;

    const [filter, setFilter] = useState({
        facility: null,
        status: null,
        start_date: undefined,
        end_date: undefined,
        pay_start: undefined,
        pay_end: undefined,
    })
    const [employee, setEmployee] = useState(null);
    const [month, setMonth] = useState(null);

    const previousMonths = _.filter(constant.MONTHS_VIETNAMESE, month => month.value < currentMonth);
    const handleChangeFilter = (key, value) => {
        setFilter(values => ({
            ...values,
            [key]: value,
        }))
    }
    const optionsRouter = {
        replace: true,
        preserveState: true,
        only: ['salaries']
    }
    const handlePagination = async (page) => {
        await router.get(route('salary.list'), {
            page: page,
            ...filter,
            start_date: HelperFunction.convertDateTime(filter.start_date),
            end_date: HelperFunction.convertDateTime(filter.end_date),
            pay_start: HelperFunction.convertDateTime(filter.pay_start),
            pay_end: HelperFunction.convertDateTime(filter.pay_end),
        }, optionsRouter);

    }
    const filterForm = async () => {
        await router.get(route('salary.list'), {
            ...filter,
            start_date: HelperFunction.convertDateTime(filter.start_date),
            end_date: HelperFunction.convertDateTime(filter.end_date),
            pay_start: HelperFunction.convertDateTime(filter.pay_start),
            pay_end: HelperFunction.convertDateTime(filter.pay_end),
        }, optionsRouter);
    }
    const createSalary = () => {
        if (!employee) {
            return toast.error('Hãy chọn nhân viên trước');
        }
        if (!month) {
            return toast.error('Hãy chọn tháng trước');
        }
        router.get(route('salary.add', {user_id: employee, month}), optionsRouter);
    }

    return (
        <Layout>
            <Panel header={<div className="roboto">Tìm kiếm <SearchIcon/></div>} bordered shaded className="mb-8">
                <Form onSubmit={filterForm} fluid>
                    <Grid gutter={16} fluid>
                        <Row gutter={12} className="mb-4">
                            <Col xl={4} lg={12} md={24}>
                                <Form.Group controlId="facility">
                                    <Form.ControlLabel>Lọc cơ sở</Form.ControlLabel>
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
                                        placeholder="Tìm kiếm theo cơ sở"/>
                                </Form.Group>
                            </Col>
                            <Col xl={4} lg={12} md={24}>
                                <Form.Group controlId="status">
                                    <Form.ControlLabel>Lọc theo trạng thái lương</Form.ControlLabel>
                                    <SelectPicker
                                        block
                                        data={[
                                            {label: 'Lựa chọn', value: ""},
                                            ..._.map(salaryStatus, (status) => ({
                                                label: status.text,
                                                value: status.value
                                            }))
                                        ]}
                                        value={filter.status}
                                        onChange={(value) => handleChangeFilter('status', value)}
                                        name="status"
                                        id="status"
                                        placeholder="Tìm kiếm theo trạng thái"/>
                                </Form.Group>

                            </Col>
                            <Col xl={4} lg={12} md={24}>
                                <Form.Group controlId="created_at">
                                    <Form.ControlLabel>Lọc theo ngày tạo bảng lương</Form.ControlLabel>
                                    <DateRangePicker
                                        block={true}
                                        name="created_at"
                                        id="created_at"
                                        appearance={`subtle`}
                                        isoWeek={true}
                                        showWeekNumbers={true}
                                        format={`dd-MM-yyyy`}
                                        defaultValue={[filter.start_date, filter.end_date]}
                                        value={[filter.start_date, filter.end_date]}
                                        onChange={(value_date) => {
                                            if (value_date) {
                                                handleChangeFilter('start_date', value_date[0]);
                                                handleChangeFilter('end_date', value_date[1])
                                            } else {
                                                handleChangeFilter('start_date', undefined);
                                                handleChangeFilter('end_date', undefined);
                                            }
                                        }}/>
                                </Form.Group>
                            </Col>
                            <Col xl={4} lg={12} md={24}>
                                <Form.Group controlId="pay_day">
                                    <Form.ControlLabel>Lọc theo ngày trả lương</Form.ControlLabel>
                                    <DateRangePicker
                                        block={true}
                                        name="pay_day"
                                        id="pay_day"
                                        isoWeek={true}
                                        appearance={`subtle`}
                                        showWeekNumbers={true}
                                        format={`dd-MM-yyyy`}
                                        defaultValue={[filter.pay_start, filter.pay_end]}
                                        value={[filter.pay_start, filter.pay_end]}
                                        onChange={(value_date) => {
                                            if (value_date) {
                                                handleChangeFilter('pay_start', value_date[0]);
                                                handleChangeFilter('pay_end', value_date[1])
                                            } else {
                                                handleChangeFilter('pay_start', undefined);
                                                handleChangeFilter('pay_end', undefined);
                                            }
                                        }}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Divider/>
                        <Row gutter={12}>
                            <Col xl={24} as={"div"} className="flex items-center gap-2">
                                <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">
                                    Tìm kiếm
                                </Button>
                                <Button type="button" startIcon={<PlusIcon/>} appearance="primary" color={`green`}
                                        onClick={createSalary}>
                                    Tạo bảng lương
                                </Button>
                                <SelectPicker
                                    block
                                    data={[
                                        {label: 'Lựa chọn', value: ""},
                                        ..._.map(users, (user) => ({
                                            label: `${user.name} - ${user.facility.name}`,
                                            value: user.id
                                        }))
                                    ]}
                                    value={employee}
                                    onChange={(value) => setEmployee(value)}
                                    name="user"
                                    id="user"
                                    placeholder="Chọn nhân viên để tạo bảng lương"/>
                                <SelectPicker
                                    block
                                    searchable={false}
                                    data={[
                                        {label: 'Lựa chọn', value: ""},
                                        ..._.map(previousMonths, (prevMonth) => ({
                                            label: prevMonth.text,
                                            value: prevMonth.value
                                        }))
                                    ]}
                                    value={month}
                                    onChange={(value) => setMonth(value)}
                                    name="month"
                                    id="month"
                                    placeholder="Chọn tháng"/>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>
            <Table affixHeader rowHeight={100} autoHeight data={salaries.data}>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Nhân viên</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <div className={``}>
                                {rowData.user.name} - {rowData.user.specialties.name} - {rowData.user.facility.name}
                            </div>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tổng lương</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <Text weight={`bold`} color={`green`}
                                  className={``}>{HelperFunction.toThousands(rowData.total_salary)} VND</Text>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Ngày trả lương</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            if (!_.isEmpty(rowData.day_pay)) {
                                return (<Text weight={`bold`}>{dayjs(rowData.day_pay).format('DD-MM-YYYY')}</Text>)
                            }
                            return (<>Chưa trả lương</>)
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Ngày tạo bảng lương</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (<Text weight={`bold`}>{dayjs(rowData.created_at).format('DD-MM-YYYY')}</Text>)}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <Text weight={`bold`} className={``}>{rowData.status.text}</Text>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <ButtonGroup>
                                {rowData.status.value !== is_pay &&
                                    <Button as={Link} href={route('salary.detail', {salary_id: rowData.id})}
                                            appearance={`primary`} color={`green`}>
                                        Thanh toán lương
                                    </Button>
                                }
                                <Button as={Link} href={route('salary.view', {salary_id: rowData.id})}
                                        appearance={`primary`} color={`blue`}>
                                    Chi tiết
                                </Button>
                            </ButtonGroup>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {salaries.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={salaries.per_page}
                                activePage={salaries.current_page} total={salaries.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}


export default List;
