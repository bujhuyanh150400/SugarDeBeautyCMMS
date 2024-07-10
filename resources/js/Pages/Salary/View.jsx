import Layout from "@/Layouts/index.jsx";
import {Accordion, Button, Divider, Input, List, Message, Panel, Text} from "rsuite";
import _ from "lodash";
import HelperFunction from "@/utils/HelperFunction.js";
import dayjs from "dayjs";

const View = (props) => {
    const {schedules, user, day_offs, pay_offs, statistical, salary,} = props;
    return (
        <Layout className={`space-y-4`}>
            <Accordion bordered>
                <Accordion.Panel header="Thống kê" eventKey={2} defaultExpanded={true}>
                    <div className={`grid grid-cols-2 gap-4 `}>
                        <div className={` flex flex-col gap-4 border-0 border-r border-solid border-white/20`}>
                            <Text weight={'bold'} color={`blue`} size={'md'}>Về lịch làm</Text>
                            {_.map(statistical.info_salary, (info_salary, key) => (
                                <div className={`grid grid-cols-2 gap-2`} key={key}>
                                    <Text weight={`bold`} className={`!m-0 self-center`}>{info_salary.title}</Text>
                                    <Text weight={`medium`} className={`!m-0 self-center`}
                                          color={`blue`}>{HelperFunction.toThousands(info_salary.money)} VND</Text>
                                </div>
                            ))}
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng số giờ làm:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{statistical.total_work_hour} giờ</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng số giờ tăng ca:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{statistical.total_work_overtime_hour} giờ</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng số đi hỗ trợ cơ sở
                                    khác:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{statistical.total_work_supported_hour} giờ</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Đi muộn:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={statistical.total_go_late > 0 ? `red` : `blue`}>{statistical.total_go_late} lần</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Bỏ ca làm:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={statistical.total_go_off > 0 ? `red` : `blue`}>{statistical.total_go_off} lần</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng lương theo giờ làm</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{HelperFunction.toThousands(statistical.total_salary_workday)} VND</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng lương theo giờ tăng ca</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{HelperFunction.toThousands(statistical.total_salary_overtime)} VND</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng lương theo giờ đi hỗ
                                    trợ</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{HelperFunction.toThousands(statistical.total_salary_supported)} VND</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Phạt đi muộn</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`red`}>{HelperFunction.toThousands(statistical.fine_go_late)} VND</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Phạt bỏ ca</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`red`}>{HelperFunction.toThousands(statistical.fine_go_off)} VND</Text>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-4`}>
                            <Text weight={'bold'} color={`blue`} size={'md'}>Về nghỉ phép, thưởng/phạt</Text>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Số ngày xin nghỉ phép tháng
                                    này:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{statistical.day_off_statistical.total_day_off} ngày</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Số ngày vượt quá nghỉ phép:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={statistical.day_off_statistical.total_day_offs_excess > 0 ? `red` : `blue`}>{statistical.day_off_statistical.total_day_offs_excess} ngày</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Số tiền bị trừ nghỉ quá
                                    buổi </Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`red`}>{HelperFunction.toThousands(statistical.day_off_statistical.total_fine_day_off)} VND</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng tiền thưởng:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{HelperFunction.toThousands(statistical.reward_pay_off)} VND</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tổng tiền phạt:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`red`}>{HelperFunction.toThousands(statistical.punish_pay_off)} VND</Text>
                            </div>

                            <Text weight={'bold'} className={`pt-6`} color={`blue`} size={'md'}>Thông tin nhân
                                viên:</Text>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Tên:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{user.name} </Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Cơ sở:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{user.facility.name} - {user.facility.address} </Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Số ngày được nghỉ phép trong 1
                                    tháng:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{user.number_of_day_offs} ngày</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Cấp bậc:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{user.rank.title}</Text>
                            </div>
                            <div className={`grid grid-cols-2 gap-2`}>
                                <Text weight={`bold`} className={`!m-0 self-center`}>Phần trăm mức lương:</Text>
                                <Text weight={`medium`} className={`!m-0 self-center`}
                                      color={`blue`}>{user.rank.percent_rank} %</Text>
                            </div>
                        </div>
                    </div>
                    <Divider/>
                    <div className={`flex items-center justify-center gap-2`}>
                        <Text weight={`bold`} className={`!m-0 self-center`}>Số tiền sau khi tính toán (tạm
                            tính):</Text>
                        <span
                            className="text-green-400 font-medium px-2.5 py-0.5 rounded border border-solid border-green-400">{HelperFunction.toThousands(statistical.total_salary)} VND</span>
                    </div>
                </Accordion.Panel>
                <Accordion.Panel header="Bảng theo dõi lịch làm" eventKey={3}>
                    <div className={`d-block h-fit`}>
                        <div className="grid grid-cols-4 gap-4 my-2">
                            {schedules.map((schedule, key) => {
                                return (
                                    <div key={schedule.id}
                                         className={`border-2 p-4 rounded-md border-dotted border-blue-700/50 `}>
                                        <div className={`flex flex-col gap-1`}>
                                            <div className={`flex items-center justify-between`}>
                                                <Text weight={`bold`}
                                                      size={`xl`}>{key + 1}/ {schedule.day_registered} </Text>
                                                <Text weight="bold"
                                                      color={schedule.status.color}>{schedule.status.text}</Text>
                                            </div>
                                            {!_.isEmpty(schedule.attendance_at) &&
                                                <Text size={'sm'}>Chấm công lúc: {schedule.attendance_at}</Text>}
                                        </div>
                                        <Divider className={`!my-4`}/>
                                        <ul className={`list-none m-0 p-0 space-y-2`}>
                                            <li className={`flex items-center gap-2`}>
                                                <Text weight="bold"
                                                      color={schedule.type.color}>{schedule.type.text}</Text>
                                            </li>
                                            <li className={`flex items-center gap-2`}>
                                                <Text weight={`medium`}>Ca
                                                    làm: </Text><span>{schedule.start_time_registered}h - {schedule.end_time_registered}h</span>
                                            </li>
                                            <li className={`flex items-center gap-2`}>
                                                <Input as="textarea" rows={5}
                                                       value={schedule.note ? schedule.note : 'Không có ghi chú'}
                                                       readOnly={true}/>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </Accordion.Panel>
                <Accordion.Panel header="Danh sách ngày nghỉ phép" eventKey={4}>
                    {!_.isEmpty(day_offs) ? (
                        <List className={`!my-4`} hover bordered>
                            {day_offs.map((dayoff) => {
                                const start_date = dayjs(dayoff.start_date).format('DD-MM-YYYY');
                                const end_date = dayjs(dayoff.end_date).format('DD-MM-YYYY');
                                return (
                                    <List.Item key={dayoff.id} className="grid grid-cols-5 gap-4">
                                        <Text weight={`bold`}>Ngày bắt đầu: {start_date}</Text>
                                        <Text weight={`bold`}>Ngày kết thúc: {end_date}</Text>
                                        <div className={`block col-span-3`}>
                                            <Text className={`mb-3`} weight={`bold`}>Tiêu đề đơn xin
                                                nghỉ: {dayoff.title}</Text>
                                            <div dangerouslySetInnerHTML={{__html: dayoff.description}}/>
                                        </div>
                                    </List.Item>
                                )
                            })}
                        </List>
                    ) : (
                        <Message className={`!my-4`} showIcon type="info">
                            <strong>Nhân viên tháng này không có ngày nghỉ nào!</strong>
                        </Message>
                    )}
                </Accordion.Panel>
                <Accordion.Panel header="Danh sách thưởng phạt" eventKey={5}>
                    {!_.isEmpty(pay_offs) ? (
                        <List className={`!my-4`} hover bordered>
                            {pay_offs.map((pay_off) => {
                                const payoff_at = dayjs(pay_off.payoff_at).format('DD-MM-YYYY');
                                const money = HelperFunction.toThousands(pay_off.money);
                                return (
                                    <List.Item key={pay_off.id} className="grid grid-cols-6 gap-4">
                                        <Text weight={`bold`}>Ngày: {payoff_at}</Text>
                                        <Text weight={`bold`}>Đơn: {pay_off.type.text}</Text>
                                        <Text weight={`bold`}>Số tiền: {money} VND</Text>
                                        <Text weight={`bold`}>Người tạo
                                            đơn: {pay_off.creator.name} - {pay_off.creator.facility.name}</Text>
                                        <div className={`block col-span-2`}>
                                            <Text className={`mb-3`} weight={`bold`}>Lý do</Text>
                                            <div dangerouslySetInnerHTML={{__html: pay_off.description}}/>
                                        </div>
                                    </List.Item>
                                )
                            })}
                        </List>
                    ) : (
                        <Message className={`!my-4`} showIcon type="info">
                            <strong>Nhân viên tháng này không có đơn Thưởng/Phạt</strong>
                        </Message>
                    )}
                </Accordion.Panel>
            </Accordion>
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
                    <div className={`grid grid-cols-2 gap-2`}>
                        <Text weight={`bold`} className={`!m-0 self-center`}>Trạng thái</Text>
                        <Text weight={`medium`} className={`!m-0 self-center`}
                              color={`blue`}>{salary.status.text} </Text>
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
                </div>
            </Panel>

        </Layout>
    )

}

export default View;
