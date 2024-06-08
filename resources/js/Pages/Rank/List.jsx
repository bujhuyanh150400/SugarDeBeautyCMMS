import Layout from "@/Layouts/index.jsx";
import {Button, ButtonGroup, Pagination, Table} from "rsuite";
import {Link, router} from "@inertiajs/react";
import constant from "@/utils/constant.js";
import OffIcon from "@rsuite/icons/Off.js";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";


const List = (props) => {
    const {ranks} = props;
    const optionsRouter = {
        replace: true,
        preserveState: true,
        only: ['ranks']
    }
    const handlePagination = async (page) => {
        await router.get(route('ranks.list'), {
            page: page,
        }, optionsRouter);
    }
    return (
        <Layout>
            <div className={`my-4`}>
                <Button as={Link} href={route('rank.view_add')} startIcon={<PlusIcon/>} color="green" appearance="primary">Thêm mới </Button>
            </div>
            <Table affixHeader rowHeight={100} autoHeight data={ranks.data}>
                <Table.Column flexGrow={1} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.Cell dataKey="id"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tiêu đề cấp bậc</Table.HeaderCell>
                    <Table.Cell dataKey="title"/>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Mô tả</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <div dangerouslySetInnerHTML={{ __html: rowData.description }}></div>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Phần trăm tăng lương</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <div>{rowData.percent_rank} % mức lương</div>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                                <Button as={Link} href={route('rank.view_edit', {rank_id: rowData.id})} startIcon={<EditIcon/>} color="green" appearance="primary">Sửa</Button>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {ranks.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={ranks.per_page}
                                activePage={ranks.current_page} total={ranks.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
        </Layout>
    )
}

export default List;
