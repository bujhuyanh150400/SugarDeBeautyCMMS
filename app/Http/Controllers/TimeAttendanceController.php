<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\ScheduleStatus;
use App\Helpers\Helpers;
use App\Models\Facilities;
use App\Models\Schedule;
use App\Models\TimeAttendance;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TimeAttendanceController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): Response
    {
        $facilities = Facilities::all();
        $users = User::KeywordFilter($request->get('keyword') ?? '')
            ->PermissionFilter($request->get('permission') ?? '')
            ->FacilityFilter($request->get('facility') ?? '')
            ->with('facility')
            ->with('specialties')
            ->with('files')
            ->with('timeAttendance')
            ->where('is_deleted', AppConstant::NOT_DELETED)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('TimeAttendance/List', [
            'title' => "Quản lý QR code chấm công",
            'users' => fn() => $users,
            'query' => $request->query() ?: null,
            'facilities' => $facilities
        ]);
    }

    public function control(Request $request, $user_id)
    {
        $user = User::find($user_id);
        if ($user) {
            $time_attendance = TimeAttendance::where('user_id', $user_id)->first();
            if ($request->method() === 'POST') {
                $validator = Validator::make(
                    $request->all(),
                    [
                        'expires_at' => ['required', 'date'],
                        'pin' => ['required', 'numeric', 'digits_between:1,5'],
                    ],
                    [
                        'expires_at.required' => 'Vui lòng nhập thời gian được phép đi muộn.',
                        'expires_at.date' => 'thời gian được phép đi muộn phải là kiểu thời gian hợp lệ.',
                        'pin.required' => 'Vui lòng nhập mã PIN.',
                        'pin.numeric' => 'Trường mã PIN phải là số.',
                        'pin.digits_between' => 'Trường mã PIN phải có độ dài từ 1 đến 5 chữ số.'
                    ]
                );
                if ($validator->fails()) {
                    return redirect()->back()->withErrors($validator)->withInput();
                } else {
                    $minutes = Carbon::parse($request->expires_at)->format('i');
                    $seconds = Carbon::parse($request->expires_at)->format('s');
                    $expires_at = Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute($minutes)->second($seconds)->toDateTimeString();
                    try {
                        // Nếu tồn tại thì cập nhật
                        if ($time_attendance) {
                            $time_attendance->pin = $request->input('pin');
                            $time_attendance->expires_at = $expires_at;
                            $time_attendance->save();
                        } // Không thì tạo mới
                        else {
                            $data_qrcode = [
                                'id' => $this->getIdAsTimestamp(),
                                'pin' => $request->input('pin'),
                                'short_url' => Str::random(10),
                                'expires_at' => $expires_at,
                                'user_id' => $user->id,
                            ];
                            $time_attendance = TimeAttendance::create($data_qrcode);
                        }
                        session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                    } catch (QueryException $exception) {
                        session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
                        return redirect()->back()->withInput();
                    }
                }
            }
            $short_url = !empty($time_attendance) ? route('short_url', ['short_url' => $time_attendance->short_url]) : null;
            return Inertia::render('TimeAttendance/Control', [
                'title' => 'QR code chấm công của nhân sự: ' . $user->name,
                'user' => $user,
                'users' => fn() => $user,
                'time_attendance' => fn() => $time_attendance,
                'short_url' => $short_url,
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy người dùng');
            return redirect()->back();
        }
    }


    public function timeAttendance(Request $request, string $short_url): Response
    {
        $time_attendance = TimeAttendance::where('short_url', $short_url)->with('user')->first();
        if (empty($time_attendance)) {
            abort(404);
        }
        $today = now()->startOfDay()->format('Y-m-d');
        $time_now = now()->format('H:i:s');
        $schedule = Schedule::where(function ($query) use ($today, $time_now) {
            // được cho phép chấm công sớm hơn 1 tiếng
            $time_allowed_go_soon = now()->addHours(1)->format('H:i:s');
            $query->whereDate('day_registered', '=', $today)
                ->whereTime('start_time_registered', '<=', $time_allowed_go_soon)
                ->whereTime('end_time_registered', '>=', $time_now)
                ->where('status', '=', ScheduleStatus::WAIT);
        })->orderBy('start_time_registered', 'asc')->first();
        if (empty($schedule)) {
            abort(404);
        }
        if (strtoupper($request->method()) === 'POST') {
            $request->validate([
                'pin' => ['required', 'between:1,5', function ($attribute, $value, $fail) use ($time_attendance) {
                    if ($time_attendance->pin !== trim($value)) {
                        $fail('Mã pin bạn nhập không đúng');
                    }
                }],
            ], [
                'pin.required' => 'Vui lòng nhập mã PIN.',
                'pin.between' => 'Trường mã PIN phải có độ dài từ 1 đến 5 chữ số.'
            ]);
            // Tính toán thời gian cho phép đi muộn
            $time_allowed_late = Carbon::createFromFormat('H:i:s', Carbon::parse($time_attendance->expires_at)->format('H:i:s'));
            $start_time_registered = Carbon::createFromFormat('H:i:s', Carbon::parse($schedule->start_time_registered)->format('H:i:s'));
            $totalTime = $time_allowed_late->copy()->addHours($start_time_registered->hour)->addMinutes($start_time_registered->minute)->addSeconds($start_time_registered->second);
            // Thời gian hiện tại
            $currentTime = now();
            if ($totalTime->lessThanOrEqualTo($currentTime)) {
                $schedule->status = ScheduleStatus::LATE;
            } else {
                $schedule->status = ScheduleStatus::DONE;
            }
            $schedule->attendance_at = now();
            $schedule->save();
            redirect()->back();
        }
        return Inertia::render('TimeAttendance/TimeAttendance', [
            'title' => '!!CHẤM CÔNG!!',
            'short_url' => $short_url,
            // Cho phép lấy 1 số trường
            'user' => [
                'name' => $time_attendance->user->name,
                'facility_name' => $time_attendance->user->facility->name,
                'specialty_name' => $time_attendance->user->specialties->name
            ],
            'start_time_registered' => Carbon::parse($schedule->start_time_registered)->format('H:i'),
            'end_time_registered' => Carbon::parse($schedule->end_time_registered)->format('H:i'),
        ]);
    }


    public function timekeeping(Request $request)
    {

    }
}
