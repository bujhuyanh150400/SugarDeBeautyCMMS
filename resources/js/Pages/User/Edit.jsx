import Layout from "@/Layouts/index.jsx";
import {Link, router, useForm} from "@inertiajs/react";
import {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    IconButton,
    Form,
    MaskedInput,
    Uploader,
    SelectPicker,
    Whisper,
    Tooltip,
    DatePicker, Modal, InputNumber
} from "rsuite";
import constant from "@/utils/constant.js";

import AvatarIcon from "rsuite/cjs/Avatar/AvatarIcon.js";
import TrashIcon from '@rsuite/icons/Trash';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import EditIcon from '@rsuite/icons/Edit';
import AttachmentIcon from '@rsuite/icons/Attachment';
import RemindIcon from "@rsuite/icons/legacy/Remind.js";
import HelperFunction from "@/utils/HelperFunction.js";


const Edit = (props) => {
    const {facilities, specialties, user, banks, ranks} = props;
    const {data, setData, post, errors} = useForm({
        name: user.name,
        email: user.email,
        birth: new Date(user.birth),
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        permission: user.permission,
        facility_id: user.facility_id,
        specialties_id: user.specialties_id,
        avatar: null,
        salary_per_month: user.salary_per_month,
        bin_bank: user.bin_bank,
        account_bank: user.account_bank,
        account_bank_name: user.account_bank_name,
        rank: user.rank_id,
        file_upload: [],
    });
    let avatar = user.files.find(file => file.file_type === constant.FileType.FILE_TYPE_AVATAR) || null;
    let id_avatar = null;
    if (avatar) {
        id_avatar = avatar.id;
        avatar = route('file.show', {filepath: avatar.file_location})
    }
    let file_had_uploads = user.files.filter(file => file.file_type === constant.FileType.FILE_TYPE_UPLOAD);

    const [alertDeleted, setAlertDeleted] = useState(false);
    const [alertDeletedAvatar, setAlertDeletedAvatar] = useState(false);
    const [idDeleted, setIdDeleted] = useState(null)

    const [demoAvatar, setDemoAvatar] = useState(avatar);
    const [fileList, setFileList] = useState([]);
    // cleanup các url khi component bị unmounted
    useEffect(() => {
        if (demoAvatar) {
            const url = demoAvatar;
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [demoAvatar]);
    const submit = async () => {
        await post(route('user.edit', {user_id: user.id}));
    }
    return (
        <Layout back_to={route('user.list')}>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    <Form.Group controlId="email">
                        <Form.ControlLabel>Email</Form.ControlLabel>
                        <Whisper placement="top" speaker={<Tooltip>Không thể chỉnh sửa Email</Tooltip>}>
                            <Form.Control
                                type="email" name="email" id="email" disabled
                                value={data.email}
                            />
                        </Whisper>
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tên nhân viên</Form.ControlLabel>
                        <Form.Control
                            name="name" id="name"
                            onChange={(value) => setData('name', value)} value={data.name}
                            placeholder="Tên nhân viên"
                            errorMessage={errors.name}
                        />
                    </Form.Group>
                    <Form.Group controlId="birth">
                        <Form.ControlLabel>Ngày sinh</Form.ControlLabel>
                        <DatePicker
                            oneTap block placeholder="Chọn ngày sinh"
                            name="birth" id="birth"
                            format="dd-MM-yyyy"
                            onChange={(value) => setData('birth', value)} value={data.birth}
                        />
                        <Form.ErrorMessage show={!!errors.birth}>{errors.birth}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="phone">
                        <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                        <MaskedInput
                            name="phone" id="phone"
                            mask={[
                                '+', // Dấu "+"
                                /[84]/, // Mã quốc gia không bắt đầu bằng 0
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                                /\d/, // Các chữ số từ 0 đến 9
                            ]}
                            onChange={(value) => setData('phone', value.replace('_', ''))} value={data.phone}
                            placeholder="+840917095494"
                        />
                        <Form.ErrorMessage show={!!errors.phone}>{errors.phone}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="address">
                        <Form.ControlLabel>Địa chỉ</Form.ControlLabel>
                        <Form.Control
                            name="address" id="address"
                            placeholder="Địa chỉ nơi ở nhân viên"
                            onChange={(value) => setData('address', value)} value={data.address}
                            errorMessage={errors.address}
                        />
                    </Form.Group>
                    <Form.Group controlId="gender">
                        <Form.ControlLabel>Giới tính</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={constant.Gender}
                            value={data.gender}
                            onChange={(value) => setData('gender', value)}
                            name="gender"
                            id="gender"
                            placeholder="Giới tính"/>
                        <Form.ErrorMessage show={!!errors.gender}>{errors.gender}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="facility_id">
                        <Form.ControlLabel>Cơ sở trực thuộc</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...facilities.map(facility => ({
                                    label: `${facility.name} - ${facility.address}`,
                                    value: facility.id
                                }))
                            ]}
                            value={data.facility_id}
                            onChange={(value) => setData('facility_id', value)}
                            name="facility_id"
                            id="facility_id"
                            placeholder="Cơ sở làm việc"/>
                        <Form.ErrorMessage show={!!errors.facility_id}>{errors.facility_id}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="permission">
                        <Form.ControlLabel>Quyền hành</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...Object.values(props.auth.permission).map(permission => ({
                                    label: permission.text,
                                    value: permission.value
                                }))
                            ]}
                            value={data.permission}
                            onChange={(value) => setData('permission', value)}
                            name="permission"
                            id="permission"
                            placeholder="Quyền hành"/>
                        <Form.ErrorMessage show={!!errors.facility_id}>{errors.facility_id}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="specialties_id">
                        <Form.ControlLabel>Chuyên môn</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...specialties.map(specialty => ({
                                    label: specialty.name,
                                    value: specialty.id
                                }))
                            ]}
                            value={data.specialties_id}
                            onChange={(value) => setData('specialties_id', value)}
                            name="specialties_id"
                            id="specialties_id"
                            placeholder="Chuyên môn"/>
                        <Form.ErrorMessage show={!!errors.specialties_id}>{errors.specialties_id}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="bin_bank">
                        <Form.ControlLabel>Ngân hàng sử dụng</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...banks.map(bank => ({
                                    label: `${bank.name} - ${bank.short_name}`,
                                    value: bank.bin
                                }))
                            ]}
                            value={data.bin_bank}
                            onChange={(value) => setData('bin_bank', value)}
                            name="bin_bank"
                            id="bin_bank"
                            placeholder="Ngân hàng sử dụng"/>
                        <Form.ErrorMessage show={!!errors.bin_bank}>{errors.bin_bank}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="account_bank">
                        <Form.ControlLabel>Mã ngân hàng</Form.ControlLabel>
                        <Form.Control
                            block
                            value={data.account_bank}
                            onChange={(value) => setData('account_bank', value)}
                            name="account_bank"
                            id="account_bank"
                            placeholder="Nhập mã ngân hàng"/>
                        <Form.ErrorMessage show={!!errors.account_bank}>{errors.account_bank}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="account_bank_name">
                        <Form.ControlLabel>Tên chủ thể ngân hàng</Form.ControlLabel>
                        <Form.Control
                            block
                            value={data.account_bank_name}
                            onChange={(value) => {
                                value = value.toUpperCase();
                                setData('account_bank_name', value)
                            }}
                            name="account_bank_name"
                            id="account_bank_name"
                            placeholder="Nhập tên chủ thể (Không viết có dấu)"/>
                        <Form.ErrorMessage show={!!errors.account_bank_name}>{errors.account_bank_name}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="salary_per_month">
                        <Form.ControlLabel>Luơng cứng</Form.ControlLabel>
                        <InputNumber
                            block
                            postfix="VND"
                            formatter={HelperFunction.toThousands}
                            value={data.salary_per_month}
                            onChange={(value) => setData('salary_per_month', value)}
                            name="salary_per_month"
                            id="salary_per_month"
                            placeholder="Lương cứng hàng tháng"/>
                        <Form.ErrorMessage show={!!errors.salary_per_month}>{errors.salary_per_month}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="rank">
                        <Form.ControlLabel>Cấp bậc</Form.ControlLabel>
                        <SelectPicker
                            block
                            data={[
                                {label: 'Lựa chọn', value: ""},
                                ...ranks.map(rank => ({
                                    label:rank.title,
                                    value: rank.id,
                                }))
                            ]}
                            value={data.rank}
                            onChange={(value) => setData('rank', value)}
                            name="rank"
                            id="rank"
                            placeholder="Cấp bậc"/>
                        <Form.ErrorMessage show={!!errors.rank}>{errors.rank}</Form.ErrorMessage>
                    </Form.Group>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <Form.Group controlId="avatar">
                        <Form.ControlLabel>Avatar</Form.ControlLabel>
                        <div className="flex flex-col gap-2">
                            <Uploader
                                name="avatar"
                                id="avatar"
                                accept="image/*"
                                multiple={false}
                                fileListVisible={false}
                                disableMultipart={true}
                                disabledFileItem={true}
                                listType="picture"
                                action=""
                                autoUpload={false}
                                onChange={files => {
                                    let file = files.pop().blobFile;
                                    setDemoAvatar(URL.createObjectURL(file));
                                    setData('avatar', file);
                                }}
                            >
                                <button type="button" style={{width: 150, height: 150}}>
                                    {demoAvatar ? (
                                        <img src={demoAvatar} width="100%" height="100%"/>
                                    ) : (
                                        <AvatarIcon/>
                                    )}
                                </button>
                            </Uploader>
                            {demoAvatar ? (
                                <Button
                                    className="!w-fit"
                                    type="button" appearance="primary" color="red"
                                    onClick={() => {
                                        if (avatar) {
                                            setAlertDeletedAvatar(true);
                                            setIdDeleted(id_avatar);
                                        } else {
                                            setDemoAvatar(null);
                                            setData('avatar', null);
                                        }
                                    }}
                                    startIcon={<TrashIcon/>}
                                > Huỷ chọn Avatar</Button>
                            ) : null}
                        </div>
                        <Form.ErrorMessage show={!!errors.avatar}>{errors.avatar}</Form.ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="file_upload">
                        <Form.ControlLabel>File liên quan</Form.ControlLabel>
                        <Uploader
                            name="file_upload"
                            id="file_upload"
                            fileList={fileList}
                            autoUpload={false}
                            action=""
                            onChange={files => {
                                setFileList(files);
                                files = files.map((file) => {
                                    return file.blobFile;
                                })
                                setData('file_upload', files)
                            }}
                        >
                            <Button type="button" appearance="primary" color="blue" startIcon={<FileUploadIcon/>}>Chọn
                                file (có thể chọn nhiều file)</Button>
                        </Uploader>
                        <Form.ErrorMessage show={!!errors.file_upload}>{errors.file_upload}</Form.ErrorMessage>
                    </Form.Group>
                    {file_had_uploads.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p>Các file liên quan đã tải lên</p>
                            {file_had_uploads.map((file_had_upload, index) => (
                                <ButtonGroup block={true} key={index}>
                                    <Whisper placement="top"
                                             speaker={<Tooltip>Ấn để xem chi tiết</Tooltip>}>
                                        <IconButton as="a" target="_blank" appearance="ghost"
                                                    href={route('file.show', {filepath: file_had_upload.file_location})}
                                                    icon={
                                                        <AttachmentIcon/>}>{file_had_upload.file_real_name}</IconButton>
                                    </Whisper>
                                    <IconButton onClick={() => {
                                        setAlertDeleted(true);
                                        setIdDeleted(file_had_upload.id);
                                    }} icon={<TrashIcon/>} appearance="ghost" color="red"/>
                                </ButtonGroup>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" size="lg" appearance="primary" color="green" startIcon={<EditIcon/>}>
                        Chỉnh sửa
                    </Button>
                </div>
            </Form>
            {/*Modal alert xoá file*/}
            <Modal backdrop="static" role="alertdialog" open={alertDeleted} size="xs">
                <Modal.Body>
                    <div className="flex items-center gap-2">
                        <RemindIcon className="text-amber-500 text-2xl"/>
                        Bạn có muốn xoá file này không ?
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setAlertDeleted(false)
                        router.patch(route('user.deleted_file'), {
                            user_id: user.id,
                            file_id: idDeleted
                        }, {preserveScroll: true})
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

            {/*Modal alert xoá avatar*/}
            <Modal backdrop="static" role="alertdialog" open={alertDeletedAvatar} size="xs">
                <Modal.Body>
                    <div className="flex items-center gap-2">
                        <RemindIcon className="text-amber-500 text-2xl"/>
                        Bạn có muốn xoá avatar này ko ?
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setAlertDeletedAvatar(false)
                        setDemoAvatar(null)
                        router.patch(route('user.deleted_file'), {
                            user_id: user.id,
                            file_id: idDeleted
                        }, {preserveScroll: true})
                    }} appearance="primary" color="red">
                        Có
                    </Button>
                    <Button onClick={() => {
                        setIdDeleted(null);
                        setAlertDeletedAvatar(false)
                    }} appearance="subtle">
                        Không
                    </Button>
                </Modal.Footer>
            </Modal>

        </Layout>
    )
}

export default Edit;
