<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\DayOffStatus;
use App\Helpers\Constant\PayoffStatus;
use App\Helpers\Constant\SalaryStatus;
use App\Helpers\Constant\ScheduleStatus;
use App\Helpers\Helpers;
use App\Models\ConfigApp;
use App\Models\DayOff;
use App\Models\Facilities;
use App\Models\PayOff;
use App\Models\Salary;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    private function calculatedSalaryPerHour(int $number_of_day_offs, int|float $salary_per_month, int $hour_work_per_day): int
    {
        $total_day_work = 30 - $number_of_day_offs;
        $total_hour = $total_day_work * $hour_work_per_day;
        return round($salary_per_month / $total_hour);
    }

    private function getConfigSalary(): \Illuminate\Support\Collection
    {
        $configs = ConfigApp::getConfigs(['HOUR_JOB_PER_DAY', 'MONEY_FINE_PAY_FOR_GO_OFF', 'MONEY_FINE_PAY_FOR_GO_LATE', 'PERCENT_BASE_SUPPORT_SALARY', 'PERCENT_PAY_OVERTIME_SALARY']);
        return collect($configs);
    }

    private function getDefaultBankDesc(Salary $salary): string
    {
        $month_salary = Carbon::parse($salary->created_at)->format('n');
        $bank_account_name = $salary->user->account_bank_name;
        return "LUONG T{$month_salary} NV {$bank_account_name}";
    }

    private function getDataSalaryMonth(User $user, Carbon $created_at = null): \Illuminate\Support\Collection
    {
        if (!empty($created_at)) {
            $start_month = $created_at->copy()->startOfMonth();
            $end_month = $created_at->copy()->endOfMonth();
        } else {
            $start_month = Carbon::now()->startOfMonth();
            $end_month = Carbon::now()->endOfMonth();
        }
        $schedules = Schedule::whereBetween('day_registered', [$start_month, $end_month])->where('user_id', $user->id)->orderBy('day_registered', 'asc')->get();

        if (!$schedules->isEmpty()) {
            $config = $this->getConfigSalary();
            $salary_per_hour = $this->calculatedSalaryPerHour($user->number_of_day_offs, $user->salary_per_month, $config->get('HOUR_JOB_PER_DAY'));
            // Thống kê
            $types = [
                ScheduleStatus::TYPE_DAILY => [
                    'key_type' => 'total_work_hour',
                    'key_salary' => 'total_salary_workday',
                    'title' => 'Luơng cơ bản / h',
                    'money' => $salary_per_hour,
                ],
                ScheduleStatus::TYPE_OVERTIME => [
                    'key_type' => 'total_work_overtime_hour',
                    'key_salary' => 'total_salary_overtime',
                    'title' => 'Luơng tăng ca / h',
                    'money' => round($salary_per_hour + ($salary_per_hour * ($config->get('PERCENT_PAY_OVERTIME_SALARY') / 100)))
                ],
                ScheduleStatus::TYPE_SUPPORTED => [
                    'key_type' => 'total_work_supported_hour',
                    'key_salary' => 'total_salary_supported',
                    'title' => 'Luơng đi hỗ trợ / h',
                    'money' => round($salary_per_hour + ($salary_per_hour * ($config->get('PERCENT_BASE_SUPPORT_SALARY') / 100)))
                ],
            ];
            $data_schedules = array_reduce($schedules->toArray(), function ($carry, $schedule) use ($user, $config, $salary_per_hour, $types) {
                $start_time = Carbon::parse($schedule['start_time_registered']);
                $end_time = Carbon::parse($schedule['end_time_registered']);
                $schedule['day_registered'] = Carbon::parse($schedule['day_registered'])->format('d-m-Y');
                $schedule['start_time_registered'] = $start_time->copy()->format('H:i');
                $schedule['end_time_registered'] = $end_time->copy()->format('H:i');
                if (!empty($schedule['attendance_at'])) {
                    $schedule['attendance_at'] = Carbon::parse($schedule['attendance_at'])->format('d-m-Y H:i:s');
                }
                $carry['data'][] = $schedule;
                // Thống kê
                $type_schedules = $schedule['type']['value'];
                $status_schedules = $schedule['status']['value'];
                $work_hour = $end_time->diffInHours($start_time);
                if (isset($types[$type_schedules])) {
                    $carry_type = $types[$type_schedules];
                    if ($status_schedules === ScheduleStatus::CANCEL) {
                        $carry['statistical']['total_go_off'] += 1;
                        $carry['statistical']['fine_go_off'] += (int)$config->get('MONEY_FINE_PAY_FOR_GO_OFF');
                    } else {
                        if ($status_schedules === ScheduleStatus::LATE) {
                            $carry['statistical']['total_go_late'] += 1;
                            $carry['statistical']['fine_go_late'] += (int)$config->get('MONEY_FINE_PAY_FOR_GO_LATE');
                        }
                        $carry['statistical'][$carry_type['key_type']] += $work_hour;
                        $carry['statistical'][$carry_type['key_salary']] += ($work_hour * $carry_type['money']);
                    }
                }
                return $carry;
            }, ['data' => [],
                'statistical' => [
                    'info_salary' => $types,
                    'total_work_hour' => 0,
                    'total_work_overtime_hour' => 0,
                    'total_work_supported_hour' => 0,
                    'total_salary_workday' => 0,
                    'total_salary_overtime' => 0,
                    'total_salary_supported' => 0,
                    'total_go_late' => 0,
                    'total_go_off' => 0,
                    'fine_go_late' => 0,
                    'fine_go_off' => 0,
                ]
            ]);
            $schedules = $data_schedules['data'];
            $statistical = $data_schedules['statistical'];
            $day_offs = DayOff::whereBetween('start_date', [$start_month, $end_month])->where('user_id', $user->id)->where('status', DayOffStatus::ACTIVE)->get();
            $day_offs_reduce = array_reduce($day_offs->toArray(), function ($carry, $dayoff) {
                $start_date = Carbon::parse($dayoff['start_date']);
                $end_date = Carbon::parse($dayoff['end_date']);
                return $carry + $start_date->diffInDays($end_date);
            }, 0);
            if ($day_offs_reduce > $user->number_of_day_offs) {
                $total_day_offs_excess = $day_offs_reduce - $user->number_of_day_offs;
                $total_salary_dayoff = $salary_per_hour * ($total_day_offs_excess * $config->get('HOUR_JOB_PER_DAY'));
                $statistical['day_off_statistical'] = [
                    'total_day_off' => $day_offs_reduce,
                    'total_day_offs_excess' => $total_day_offs_excess,
                    'total_fine_day_off' => $total_salary_dayoff,
                ];
            } else {
                $statistical['day_off_statistical'] = [
                    'total_day_off' => $day_offs_reduce,
                    'total_day_offs_excess' => 0,
                    'total_fine_day_off' => 0,
                ];
            }
            $pay_offs = PayOff::whereBetween('payoff_at', [$start_month, $end_month])->where('user_id', $user->id)->with(['creator' => function ($query) {
                $query->select('id', 'name', 'facility_id');
            }, 'creator.facility'])->get();

            $pay_off_reduce = array_reduce($pay_offs->toArray(), function ($carry, $pay_off) {
                $key = ($pay_off['type']['value'] === PayoffStatus::IS_REWARD) ? 'reward' : 'punish';
                $carry[$key] += $pay_off['money'] * 1;
                return $carry;
            }, ['reward' => 0, 'punish' => 0]);
            $statistical['reward_pay_off'] = $pay_off_reduce['reward'];
            $statistical['punish_pay_off'] = $pay_off_reduce['punish'];
            $statistical['total_salary'] = round(
                    $statistical['total_salary_workday'] +
                    $statistical['total_salary_overtime'] +
                    $statistical['total_salary_supported'] +
                    $statistical['reward_pay_off']
                    - $statistical['fine_go_late']
                    - $statistical['fine_go_off']
                    - $statistical['day_off_statistical']['total_fine_day_off']
                    - $statistical['punish_pay_off']) * ($user->rank->percent_rank / 100);
            return collect(compact('day_offs', 'schedules', 'pay_offs', 'statistical'));
        }
        return collect();
    }

    public function list(Request $request): \Inertia\Response
    {
        $title = "Danh sách lương nhân viên";
        $users = User::with('facility')->orderBy('facility_id', 'desc')->get();
        $salaries = Salary::FacilityFilter($request->get('facility') ?? '')
            ->StatusFilter($request->get('status') ?? '')
            ->CreatedAtFilter($request->date('start_date'), $request->date('end_date'))
            ->DayPayFilter($request->date('pay_start'), $request->date('pay_end'))
            ->with([
                'user',
                'user.facility',
                'user.specialties',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        $facilities = Facilities::all();
        return Inertia::render('Salary/List', [
            'title' => $title,
            'users' => $users,
            'is_pay' => SalaryStatus::CONFIRM,
            'salaries' => fn() => $salaries,
            'query' => $request->query() ?: null,
            'facilities' => $facilities,
            'salaryStatus' => SalaryStatus::getList()
        ]);
    }


    public function add(int $user_id, Request $request): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {

        $currentMonth = date('n'); // Lấy tháng hiện tại (1 đến 12)
        if ($request->integer('month') >= $currentMonth) {
            session()->flash('error', 'Chỉ tính được lương của tháng trước đó!');
            return redirect()->route('salary.list');
        }
        $user = User::with('facility', 'specialties', 'specialties.service', 'rank')->find($user_id);
        if ($user) {
            $start_month = Carbon::now()->startOfMonth();
            $end_month = Carbon::now()->endOfMonth();
            $salary_exist = Salary::whereBetween('created_at', [$start_month, $end_month])->where('user_id', $user_id)->exists();
            if ($salary_exist) {
                session()->flash('error', 'Nhân viên này tháng này đã có bảng lương');
            } else {
                $create_choose = Carbon::createFromFormat('m', $request->integer('month'))->setDay(1);
                $data_salary = $this->getDataSalaryMonth($user,$create_choose);
                if (!$data_salary->isEmpty()) {
                    if ($request->method() === 'POST') {
                        $validator = Validator::make($request->all(), [
                            'services.*.id' => ['required', 'numeric', Rule::exists('service', 'id')->where(function ($query) use ($user) {
                                $query->where('specialties_id', $user->specialties_id);
                            })],
                            'services.*.total' => ['required', 'numeric', 'min:0',],
                        ], [
                            'services.*.id.required' => 'Phải có dịch vụ',
                            'services.*.id.exists' => 'Dịch vụ phải phải đúng với chuyên ngành của người được trả lương',
                            'services.*.total.required' => 'Bạn hãy điền số lượng',
                            'services.*.total.numeric' => 'Số lượng phải là số',
                            'services.*.total.min' => 'Số lượng phải lớn hơn :min',
                        ]);
                        if ($validator->fails()) {
                            return redirect()->back()->withErrors($validator)->withInput();
                        }
                        $services_month = $request->get('services');
                        $total_service_money = array_reduce($services_month, function ($carry, $service) {
                            return $carry + $service['total_money'];
                        }, 0);
                        $statistical = $data_salary->get('statistical');
                        $total_salary = $statistical['total_salary'] + $total_service_money;


                        DB::beginTransaction();
                        try {
                            $data_insert = [
                                'id' => $this->getIdAsTimestamp(),
                                'total_salary' => $total_salary,
                                'total_workday_money' => $statistical['total_salary'],
                                'service_money' => $total_service_money,
                                'description' => $request->get('description'),
                                'status' => SalaryStatus::WAIT_CONFIRM,
                                'user_id' => $user->id,
                            ];
                            $salary = Salary::create($data_insert);
                            foreach ($services_month as $service) {
                                $salary->services()->attach($service['id'], [
                                    'total_service' => $service['total'],
                                    'money' => Helpers::encryptData($service['total_money'])
                                ]);
                            }
                            DB::commit();
                            session()->flash('success', 'Khởi tạo bảng lương thành công');
                        } catch (\Exception $exception) {
                            DB::rollBack();
                            return redirect()->back()->withErrors([
                                'system' => 'Có lỗi xảy ra, vui lòng liên hệ với quản trị viên',
                            ])->withInput();
                        }
                    } else {
                        return Inertia::render('Salary/Add', [
                            'title' => 'Tạo lương cho nhân viên ' . $user->name,
                            'user' => $user,
                            'schedules' => $data_salary->get('schedules'),
                            'day_offs' => $data_salary->get('day_offs'),
                            'pay_offs' => $data_salary->get('pay_offs'),
                            'statistical' => $data_salary->get('statistical'),
                        ]);
                    }
                } else {
                    session()->flash('error', 'Nhân viên không có lịch làm nào trong tháng đã chọn');
                }
            }
        } else {
            session()->flash('error', 'Không tìm thấy người dùng');
        }
        return redirect()->route('salary.list');
    }

    public function detail(int $salary_id, Request $request): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $salary = Salary::with(['user',
            'user.facility',
            'user.specialties',
            'services' => function ($query) {
                $query->withPivot('total_service', 'money');
            }])->find($salary_id);
        if ($salary) {
            if ($salary->status['value'] === SalaryStatus::CONFIRM) {
                session()->flash('error', 'Nhân viên này đã được thanh toán!');
            } else {
                if ($request->method() === "PATCH") {
                    $description = $request->string('description');
                    $salary->day_pay = now();
                    $salary->description_bank = $description->value();
                    if ($request->boolean('status') === true) {
                        $salary->status = SalaryStatus::CONFIRM;
                    } else {
                        $salary->status = SalaryStatus::DENIED;
                    }
                    $salary->save();
                    session()->flash('success', 'Lưu trữ thành công');
                } else {
                    foreach ($salary->services as $service) {
                        $service->pivot->money = Helpers::decryptData($service->pivot->money);
                    }
                    $bank_info = $this->checkBankUser($salary->user);
                    $month_salary = Carbon::parse($salary->created_at)->format('n');
                    return Inertia::render('Salary/Detail', [
                        'title' => "Thanh toán lương nhân viên {$salary->user->name} tháng {$month_salary}",
                        'user' => $salary->user,
                        'salary' => $salary,
                        'bank_info' => $bank_info,
                        'default_desc_banking' => $this->getDefaultBankDesc($salary),
                    ]);
                }
            }
        } else {
            session()->flash('error', 'Không tìm thấy người dùng');
        }
        return redirect()->route('salary.list');
    }

    public function view(int $salary_id): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $salary = Salary::with(['user',
            'user.facility',
            'user.specialties',
            'services' => function ($query) {
                $query->withPivot('total_service', 'money');
            }])->find($salary_id);
        if ($salary) {
            $data_salary = $this->getDataSalaryMonth($salary->user, $salary->created_at);
            foreach ($salary->services as $service) {
                $service->pivot->money = Helpers::decryptData($service->pivot->money);
            }
            $month_salary = Carbon::parse($salary->created_at)->format('n');
            return Inertia::render('Salary/View', [
                'title' => "Chi tiết lương nhân viên {$salary->user->name} tháng {$month_salary}",
                'user' => $salary->user,
                'salary' => $salary,
                'schedules' => $data_salary->get('schedules'),
                'day_offs' => $data_salary->get('day_offs'),
                'pay_offs' => $data_salary->get('pay_offs'),
                'statistical' => $data_salary->get('statistical'),
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy bảng lương');
        }
        return redirect()->route('salary.list');
    }


}
