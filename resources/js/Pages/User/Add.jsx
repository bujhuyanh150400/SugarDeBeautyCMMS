import Layout from "@/Layouts/index.jsx";
import {useForm} from "@inertiajs/react";
import {
    Button,
    Form,
    MaskedInput,
    Uploader,
    SelectPicker,
    DatePicker, Loader, InputNumber
} from "rsuite";
import constant from "@/utils/constant.js";
import {useEffect, useState} from "react";
import AvatarIcon from "rsuite/cjs/Avatar/AvatarIcon.js";
import TrashIcon from '@rsuite/icons/Trash';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import PlusIcon from '@rsuite/icons/Plus';
import HelperFunction from "@/utils/HelperFunction.js";

const Add = (props) => {
    const {facilities, specialties, banks, ranks} = props;
    const {data, setData, post, errors} = useForm({
        name: '',
        email: '',
        password: '',
        birth: null,
        gender: '',
        phone: '',
        address: '',
        permission: '',
        facility_id: '',
        specialties_id: '',
        salary_per_month: 0,
        bin_bank: '',
        account_bank: '',
        account_bank_name: '',
        number_of_day_offs: 0,
        rank: 0,
        avatar: null,
        file_upload: [],
    })
    const [demoAvatar, setDemoAvatar] = useState(null);
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
        await post(route('user.add'), data);
    }
    return (
        <Layout back_to={route('user.list')}>
            <Form onSubmit={submit} fluid>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tên nhân viên</Form.ControlLabel>
                        <Form.Control
                            name="name" id="name"
                            onChange={(value) => setData('name', value)} value={data.name}
                            placeholder="Tên nhân viên"
                            errorMessage={errors.name}
                        />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.ControlLabel>Email</Form.ControlLabel>
                        <Form.Control
                            type="email" name="email" id="email"
                            placeholder="Emai@email.com"
                            onChange={(value) => setData('email', value)} value={data.email}
                            errorMessage={errors.email}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
                        <Form.Control
                            name="password" id="password" type="password"
                            placeholder="Mật khẩu từ 8 - 16 kí tự"
                            onChange={(value) => setData('password', value)} value={data.password}
                            errorMessage={errors.password}
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
                        <Form.Control
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
                    <Form.Group controlId="account_bank">
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
                    <InputNumber
                        block
                        postfix="Ngày"
                        formatter={HelperFunction.toThousands}
                        value={data.number_of_day_offs}
                        onChange={(value) => setData('number_of_day_offs', value)}
                        name="number_of_day_offs"
                        id="number_of_day_offs"
                        placeholder="Lương cứng hàng tháng"/>
                    <Form.ErrorMessage show={!!errors.number_of_day_offs}>{errors.number_of_day_offs}</Form.ErrorMessage>
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
                                        setDemoAvatar(null);
                                        setData('avatar', null);
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
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit"  appearance="primary" color="green" startIcon={<PlusIcon/>}>Tạo nhân
                        viên</Button>
                </div>
            </Form>
        </Layout>
    )
}
export default Add
