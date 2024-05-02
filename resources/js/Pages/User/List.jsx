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
    ButtonGroup,
    Pagination,
    Form,
    Panel, SelectPicker, Modal
} from "rsuite";
import constant from "@/utils/constant.js";

import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import RemindIcon from '@rsuite/icons/legacy/Remind';

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
        await router.get(route('user.list'), {
            page: page,
            ...filter
        }, optionsRouter);
    }
    const filterForm = async () => {
        await router.get(route('user.list'), filter, optionsRouter);
    }

    const [alertDeleted, setAlertDeleted] = useState(false);
    const [idDeleted, setIdDeleted] = useState(null)
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
                                <Button type="button" startIcon={<PlusIcon/>}
                                        onClick={() => router.get(route('user.view_add'))} color="green"
                                        appearance="primary">
                                    Thêm nhân sự
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
                <Table.Column flexGrow={0} verticalAlign="center" align="center" fullText>
                    <Table.HeaderCell>Avatar</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => {
                            let src = null;
                            if (rowData.files.length > 0) {
                                let avatar = rowData.files.find(file => {
                                    return parseInt(file.file_type) === constant.FileType.FILE_TYPE_AVATAR
                                })
                                if (avatar) {
                                    src = route('file.show', {filepath: avatar.file_location})
                                }
                            }
                            return (
                                <Avatar src={src} size="lg"/>
                            )
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column flexGrow={1.5} verticalAlign="center" align="start" fullText>
                    <Table.HeaderCell>Tên nhân viên</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <div className="flex items-center"><Text color="blue"
                                                                     weight="bold">{props.auth.permission[rowData.permission]?.text}</Text><Divider
                                vertical/>{rowData.name}</div>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={3} align="start" fullText>
                    <Table.HeaderCell>Thông tin nhân viên</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <Grid>
                                <Row>
                                    <Col xl={12} lg={24} as={"div"} className="flex items-center gap-2">
                                        <Text color="blue" weight="bold">Email:</Text>{rowData.email}
                                    </Col>
                                    <Col xl={12} lg={24} as={"div"} className="flex items-center gap-2">
                                        <Text color="blue" weight="bold">SĐT:</Text>{rowData.phone}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={12} lg={24} as={"div"} className="flex items-center gap-2">
                                        <Text color="blue" weight="bold">Cơ sở làm
                                            việc:</Text><span>{rowData?.facility?.name} - {rowData?.facility?.address}</span>
                                    </Col>
                                    <Col xl={12} lg={24} as={"div"} className="flex items-center gap-2">
                                        <Text color="blue" weight="bold">Chyên viên:</Text>{rowData.specialties.name}
                                    </Col>
                                </Row>
                            </Grid>
                        )}
                    </Table.Cell>
                </Table.Column>
                <Table.Column verticalAlign="center" flexGrow={1.5} align="center" fullText>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>
                        {rowData => (
                            <ButtonGroup>
                                <Button as={Link} href={route('user.view_edit',{user_id: rowData.id})} startIcon={<EditIcon/>} color="green" appearance="primary">Sửa</Button>
                                <Button startIcon={<TrashIcon/>} color="red" appearance="primary"
                                        onClick={() => {
                                            setIdDeleted(rowData.id);
                                            setAlertDeleted(true);
                                        }}
                                >Xoá</Button>
                            </ButtonGroup>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
            {users.total > 0 && (
                <div className="my-8 flex w-full justify-center items-center">
                    <Pagination prev next ellipsis size="lg" limit={users.per_page} activePage={users.current_page} total={users.total}
                                onChangePage={handlePagination}/>
                </div>
            )}
            {/*Modal alert xoá nhân viên*/}
            <Modal backdrop="static" role="alertdialog" open={alertDeleted} size="xs">
                <Modal.Body>
                    <RemindIcon className="text-amber-500 text-2xl"/>
                    Bạn có muốn xoá người dùng này
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setAlertDeleted(false)
                        router.patch(route('user.deleted', {user_id: idDeleted}),null,{ preserveScroll: true })
                    }} appearance="primary" color="red">
                        Có
                    </Button>
                    <Button onClick={() => {
                        setIdDeleted(null);
                        setAlertDeleted(false)
                    }} appearance="subtle">
                        Không
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}

export default List
