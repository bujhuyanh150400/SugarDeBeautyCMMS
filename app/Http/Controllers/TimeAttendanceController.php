<?php

namespace App\Http\Controllers;

use App\Helpers\AppConstant;
use App\Models\Facilities;
use App\Models\TimeAttendance;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Carbon;

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
                        'pin' => ['required', 'numeric', 'digits_between:1,6'],
                    ],
                    [
                        'expires_at.required' => 'Vui lòng nhập thời gian được phép đi muộn.',
                        'pin.required' => 'Vui lòng nhập mã PIN.',
                        'expires_at.date' => 'thời gian được phép đi muộn phải là kiểu thời gian hợp lệ.',
                        'pin.numeric' => 'Trường mã PIN phải là số.',
                        'pin.digits_between' => 'Trường mã PIN phải có độ dài từ 1 đến 6 chữ số.'
                    ]
                );
                if ($validator->fails()) {
                    return redirect()->back()->withErrors($validator)->withInput();
                }
                else {
                    $minutes = Carbon::parse($request->expires_at)->format('i');
                    $seconds = Carbon::parse($request->expires_at)->format('s');
                    $expires_at = Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute($minutes)->second($seconds)->toDateTimeString();
                    try {
                        // Nếu tồn tại thì cập nhật
                        if ($time_attendance) {
                            $time_attendance->pin = $request->integer('pin');
                            $time_attendance->expires_at = $expires_at;
                            $time_attendance->save();
                        } // Không thì tạo mới
                        else {
                            $data_qrcode = [
                                'id' => $this->getIdAsTimestamp(),
                                'pin' => $request->integer('pin'),
                                'short_url' => Str::random(10),
                                'expires_at' => $expires_at,
                                'user_id' => $user->id,
                            ];
                            $time_attendance = TimeAttendance::create($data_qrcode);
                        }
                        session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                    }catch (QueryException $exception){
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


    public function handle_short_url($short_url)
    {
    }


    public function timekeeping(Request $request)
    {

    }
}
