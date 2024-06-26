import Layout from "@/Layouts/index.jsx";
import {Accordion, Button, Divider, Input, List, Message, Panel, Text} from "rsuite";
import _, {values} from "lodash";
import HelperFunction from "@/utils/HelperFunction.js";
import dayjs from "dayjs";
import {useState} from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {router} from "@inertiajs/react";

const Detail = (props) => {
    const {user, salary, bank_info, default_desc_banking} = props;

    const [description, setDescription] = useState(default_desc_banking)

    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const getQRcodeBank = () => {
        const apiUrl = `https://img.vietqr.io/image/${bank_info.bank_info.bin}-${bank_info.bank_account}-compact2.png?amount=${salary.total_salary}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bank_info.user_bank)}`;
        axios.get(apiUrl, { responseType: 'blob' })
            .then(response => {
                // Tạo URL từ Blob
                if (qrCodeUrl) {
                    URL.revokeObjectURL(qrCodeUrl);
                }
                const url = URL.createObjectURL(response.data);
                setQrCodeUrl(url);
            })
            .catch(error => {
                toast.error('Có lỗi khi lấy QR code');
            });
    }
    const ApproveSalary = () => {
        Swal.fire({
            title:'Bạn đã thanh toán lương',
            text: 'Xác nhận thanh toán lương',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đã thanh toán',
            cancelButtonText: 'Hủy bỏ việc thanh toán'
        }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                router.patch(route('salary.detail', {salary_id:salary.id}), {
                    description,
                    status:true,
                })
            }else if(result.dismiss === "cancel"){
                router.patch(route('salary.detail', {salary_id:salary.id}), {
                    description,
                    status:false,
                })
            }
        });
    }

    return (
        <Layout className={`space-y-4`} back_to={route('salary.list')}>

            <Panel bordered shaded header={`Thông tin về lương`}>
                <div className={`space-y-4`}>
                    <div className={`grid grid-cols-2 gap-2`}>
                        <Text weight={`bold`} className={`!m-0 self-center`}>Nhân viên:</Text>
                        <Text weight={`medium`} className={`!m-0 self-center`}
                              color={`blue`}>{user.name} - {user.facility.name} - {user.specialties.name}</Text>
                    </div>
                    <div className={`grid grid-cols-2 gap-2`}>
                        <Text weight={`bold`} className={`!m-0 self-center`}>Tổng lương giờ làm:</Text>
                        <Text weight={`medium`} className={`!m-0 self-center`}
                              color={`green`}>{HelperFunction.toThousands(salary.total_workday_money)} VND </Text>
                    </div>
                    <div className={`grid grid-cols-2 gap-2`}>
                        <Text weight={`bold`} className={`!m-0 self-center`}>Tổng tiền doanh thu dịch vụ:</Text>
                        <Text weight={`medium`} className={`!m-0 self-center`}
                              color={`green`}>{HelperFunction.toThousands(salary.service_money)} VND </Text>
                    </div>
                    <div className={`grid grid-cols-2 gap-2`}>
                        <Text weight={`bold`} className={`!m-0 self-center`}>Tổng luơng:</Text>
                        <Text weight={`medium`} className={`!m-0 self-center`}
                              color={`green`}>{HelperFunction.toThousands(salary.total_salary)} VND </Text>
                    </div>
                    <div className="border border-solid border-white/50 rounded-lg p-3 space-y-3">
                        {_.map(salary.services, (info_services, key) => (
                            <div className={`grid grid-cols-3 gap-2`} key={key}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Dịch
                                    vụ: {info_services.title}</Text>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Số
                                    lượng: {info_services.pivot.total_service}</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`} color={`green`}>Thàn
                                    tiền: {HelperFunction.toThousands(info_services.pivot.money)} VND</Text>
                            </div>
                        ))}
                    </div>
                    <div className={``}>
                        {!_.isEmpty(bank_info) ?
                            <div className={`my-4 grid grid-cols-2 gap-2`}>
                                <div className="flex flex-col gap-2">
                                    <div className={`grid grid-cols-2 gap-2`}>
                                        <Text weight={`bold`} className={`!m-0 self-center`}>Ngân hàng sử dụng:</Text>
                                        <Text weight={`medium`} className={`!m-0 self-center`} color={`blue`}>{bank_info.bank_info.short_name} -{bank_info.bank_info.name} </Text>
                                    </div>
                                    <div className={`grid grid-cols-2 gap-2`}>
                                        <Text weight={`bold`} className={`!m-0 self-center`}>Tài khoản:</Text>
                                        <Text weight={`medium`} className={`!m-0 self-center`}
                                              color={`blue`}>{bank_info.bank_account}
                                        </Text>
                                    </div>
                                    <div className={`grid grid-cols-2 gap-2`}>
                                        <Text weight={`bold`} className={`!m-0 self-center`}>Chủ thể:</Text>
                                        <Text weight={`medium`} className={`!m-0 self-center`}
                                              color={`blue`}>{bank_info.user_bank}
                                        </Text>
                                    </div>
                                    <div className={`flex flex-col gap-2 items-start justify-start`}>
                                        <Text weight={`bold`}>Nội dung chuyển khoản:</Text>
                                        <Input name='desc' as="textarea" rows={3} value={description}
                                               onChange={(values) => {
                                                   if (description.length > 50) {
                                                        return toast.error('Nội dung không được quá 50 kí tự')
                                                   }
                                                   setDescription(values);
                                               }}></Input>
                                    </div>
                                    <div className={`flex items-center gap-2`}>
                                        <Button onClick={getQRcodeBank} appearance={`primary`} color={`blue`}>Lấy QR code bank</Button>
                                        {qrCodeUrl &&  <Button onClick={ApproveSalary} appearance={`primary`} color={`green`}>Xác nhận lương</Button> }
                                    </div>
                                </div>
                                <div>
                                    {qrCodeUrl && (
                                       <div className={`flex items-center justify-center`}>
                                           <img src={qrCodeUrl} className={`w-[30rem] h-hull`} alt="QR Code"/>
                                       </div>
                                    )}
                                </div>
                            </div>
                            : <>
                                <Message className={`!my-4`} showIcon type="warning">
                                    <strong>Nhân viên chưa có thông tin ngân hàng, hãy báo nhân viên hoặc chỉnh sửa
                                        thông tin cho nhân viên</strong>
                                </Message>
                            </>}
                    </div>

                </div>
            </Panel>

        </Layout>
    )


}
export default Detail;
