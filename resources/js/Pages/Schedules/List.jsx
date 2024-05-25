import Layout from "@/Layouts/index.jsx";
import {Button, Pagination, Table, Text} from "rsuite";
import QRCode from "@/Components/QRCode.jsx";
import {Link, router} from "@inertiajs/react";
import EditIcon from "@rsuite/icons/Edit.js";

const List = (props) => {
    let {facilities} = props;
    const optionsRouter = {
        replace: true,
        preserveState: true,
        only: ['facilities']
    }
    const handlePagination = async (page) => {
        await router.get(route('schedules.list'), {page}, optionsRouter);
    }
    return (
        <Layout>
            <Table affixHeader rowHeight={100} autoHeight data={facilities.data}>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>Tên cơ sở</Table.HeaderCell>
                    <Table.Cell dataKey="name"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>Địa chỉ</Table.HeaderCell>
                    <Table.Cell dataKey="address"/>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center">
                    <Table.HeaderCell>Số nhân viên</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            return (
                                <Text>{rowData.users.length} nhân viên</Text>
                            )
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center">
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            return (
                                <div className="flex items-center gap-4">
                                    <Button as={Link} href={route('schedules.managerSchedules', {facilities_id: rowData.id})}
                                            startIcon={<EditIcon/>} color="blue" appearance="primary">Xem lịch làm của cơ sở</Button>
                                </div>
                            )
                        }}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {facilities.total > 0 && facilities.total > facilities.per_page && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={facilities.per_page} activePage={facilities.current_page}
                                total={facilities.total} onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}

export default List
