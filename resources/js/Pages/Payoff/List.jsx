import Layout from "@/Layouts/index.jsx";
import {useState} from "react";
import {router} from "@inertiajs/react";
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
    Table,
    Whisper
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search.js";
import PlusIcon from "@rsuite/icons/Plus.js";
import dayjs from "dayjs";
import constant from "@/utils/constant.js";
import HelperFunction from "@/utils/HelperFunction.js";

const List = (props) => {
    const {facilities, payoffs, payoffStatus} = props;
    const [filter, setFilter] = useState({
        keyword: '',
        facility: '',
        start_date: '',
        end_date: '',
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
        only: ['payoffs']
    }
    const handlePagination = async (page) => {
        await router.get(route('payoff.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('payoff.list'), filter, optionsRouter);
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
                        </Row>
                        <Row gutter={12}>
                            <Col xl={24} as={"div"} className="flex items-center gap-2">
                                <Button type="submit" startIcon={<SearchIcon/>} appearance="primary">Tìm kiếm</Button>
                                <Button type="button" startIcon={<PlusIcon/>} onClick={() => router.get(route('payoff.view_add'))} color="green" appearance="primary">Tạo đơn Thưởng / Phạt</Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>
            <Table affixHeader rowHeight={100} autoHeight data={payoffs.data}>
                <Table.Column flexGrow={1.5} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Đơn</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <span>{payoffStatus[rowData.type].text}</span>
                        )}
                    </Table.Cell>
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
                    <Table.HeaderCell>Số tiền</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (<span>{HelperFunction.toThousands(rowData.money)} VND</span>)}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Người nhận</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (<span>{rowData.user.name} - {rowData.user.facility.name}</span>)}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Người tạo</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (<span>{rowData.creator.name} - {rowData.creator.facility.name}</span>)}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Ngày làm đơn</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (<span>{dayjs(rowData.payoff_at).format('DD-MM-YYYY')}</span>)}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {payoffs.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={payoffs.per_page}
                                activePage={payoffs.current_page} total={payoffs.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )


}

export default List
