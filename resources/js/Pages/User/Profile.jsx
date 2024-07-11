import Layout from "@/Layouts/index.jsx";
import constant from "@/utils/constant.js";
import AvatarIcon from "rsuite/cjs/Avatar/AvatarIcon.js";
import {Avatar, Button, ButtonGroup, Heading, IconButton, Message, Panel, Text, Tooltip, Whisper} from "rsuite";
import dayjs from "dayjs";
import HelperFunction from "@/utils/HelperFunction.js";
import AttachmentIcon from "@rsuite/icons/Attachment.js";
import {Link} from "@inertiajs/react";
import QRCode from "@/Components/QRCode.jsx";

const Profile = (props)=>{
    const {user} = props;
    let avatar = user.files.find(file => file.file_type === constant.FileType.FILE_TYPE_AVATAR) || null;
    if (avatar) {
        avatar = route('file.show', {filepath: avatar.file_location})
    }
    let file_had_uploads = user.files.filter(file => file.file_type === constant.FileType.FILE_TYPE_UPLOAD);
    console.log(user)
    return (
        <Layout>
            <div className='grid grid-cols-2 gap-x-2 pb-4'>
                <Panel bordered shaded>
                    <div className='grid grid-cols-2 gap-x-2'>
                        <div className="space-y-2">
                            <div className="flex items-start justify-start gap-4 mb-8">
                                <Avatar size={'xxl'} bordered>
                                    {avatar ? (
                                        <img src={avatar} width="100%" height="100%"/>
                                    ) : (
                                        <AvatarIcon />
                                    )}
                                </Avatar>
                                <div className={`flex flex-col gap-2`}>
                                    <Text weight={'bold'} size={'xxl'} color={'blue'}>{user.name}</Text>
                                    <Text weight={'bold'} >Chức vụ: {user.permission.text} - {user.rank.title}</Text>
                                    <Text weight={'bold'} >Cơ sở làm việc: {user.facility.name} - {user.facility.address}</Text>
                                    <Text weight={'bold'} >Chuyên ngành: {user.specialties.name}</Text>
                                </div>
                            </div>
                            {file_had_uploads.length > 0 ? (
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
                                            </ButtonGroup>
                                        ))}
                                    </div>
                                ) :
                                (<Message type={`info`} showIcon={true} className="font-bold">Nhân viên không có file đính kèm !</Message>)
                            }
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Heading level={5}>Mã QRCode của nhân viên</Heading>
                            <QRCode url={route('short_url',{short_url:user.time_attendance.short_url})} />
                            <Text weight={'bold'} color={'blue'}>Mã PIN: {user.time_attendance.pin}</Text>
                            <a target="_blank" href={route('short_url',{short_url:user.time_attendance.short_url})}>{route('short_url',{short_url:user.time_attendance.short_url})}</a>
                        </div>
                    </div>
                </Panel>
                <Panel bordered shaded className={`!h-fit`}>
                    <ul className={`list-none m-0 p-0 space-y-3`}>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>Ngày sinh: </Text> {dayjs(user.birth).format('DD-MM-YYYY')} </li>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>Địa chỉ: </Text> {user.address}</li>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>Giới tính : </Text> {user.gender === 1 ? 'Nam' : 'Nữ'}</li>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>Lương cứng: </Text> {HelperFunction.toThousands(user.salary_per_month)} VNĐ</li>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>Ngân hàng: </Text> {user.bin_bank ?? 'Chưa điền'}</li>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>STK ngân hàng: </Text> {user.account_bank ? user.account_bank : 'Chưa điền'}</li>
                        <li className={`flex gap-2 items-center`}><Text weight={`semibold`} color={`blue`}>Chủ thể ngân hàng: </Text> {user.account_bank_name ? user.account_bank_name : 'Chưa điền'}</li>
                    </ul>
                </Panel>
            </div>
           <div className="flex items-center justify-end gap-2">
               <Button as={Link} href={route('user.view_edit',{user_id:user.id})} appearance={'primary'} color={'green'}>
                   Chỉnh sửa cá nhân
               </Button>
           </div>
        </Layout>
    )
}

export default Profile
