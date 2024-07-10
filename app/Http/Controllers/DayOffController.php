<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\DayOffStatus;
use App\Helpers\Constant\PermissionAdmin;
use App\Models\DayOff;
use App\Models\Facilities;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DayOffController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): Response
    {
        $list_day_off_query = DayOff::query();
        if (Gate::allows('allow_admin')) {
            $list_day_off_query->FacilityFilter($request->get('facility') ?? '');
        } else {
            $list_day_off_query->FacilityFilter(\auth()->user()->facility_id);
        }
        $list_day_off_query->KeywordFilter($request->get('keyword') ?? '')
            ->dayOffFilterBetween($request->get('start_date') ?? '', $request->get('end_date') ?? '');
        $list_day_off = $list_day_off_query
            ->with(['user', 'user.facility', 'user.specialties'])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        if (Gate::allows('allow_admin')){
            $facilities = Facilities::where('active', AppConstant::ACTIVE)->get();
        }
        return Inertia::render('DayOff/List', [
            'title' => "Quản lý xin nghỉ phép",
            'list_day_off' => fn() => $list_day_off,
            'query' => $request->query() ?: null,
            'facilities' => $facilities ?? [],
            'dayoffStatus' => DayOffStatus::getList()
        ]);
    }
    public function view_add(): Response
    {
        if (Gate::allows('just_manager')) {
            $users = User::FacilityFilter(\auth()->user()->facility_id)->with(['facility', 'specialties'])->get();
        } elseif (Gate::allows('allow_admin')){
            $users = User::with(['facility', 'specialties'])->get();
        }
        return Inertia::render('DayOff/Add', [
            'title' => "Tạo đơn xin nghỉ phép",
            'users' => fn() => $users ?? null,
        ]);
    }
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => ['required', 'date', 'after_or_equal:today', 'date_format:Y-m-d H:i:s'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date', 'date_format:Y-m-d H:i:s'],
            'user_id' => ['required', 'exists:users,id', function ($attribute, $value, $fail) use ($request) {
                $startDate = $request->input('start_date');
                $endDate = $request->input('end_date');
                $existingDayoff = DayOff::where('user_id', $value)
                    ->where(function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('start_date', [$startDate, $endDate])
                            ->orWhereBetween('end_date', [$startDate, $endDate])
                            ->orWhere(function ($query) use ($startDate, $endDate) {
                                $query->where('start_date', '<=', $startDate)
                                    ->where('end_date', '>=', $endDate);
                            });
                    })
                    ->exists();

                if ($existingDayoff) {
                    $fail('Nhân viên đã đăng ký lịch nghỉ trong khoảng thời gian này.');
                }
            }],
            'title' => 'required|max:255',
            'description' => [function ($attribute, $value, $fail) {
                $value = trim(strip_tags($value));
                if (empty($value)) {
                    $fail('Vui lòng nhập chi tiết nội dung xin nghỉ');
                }
            }],
        ], [
            'start_date.required' => 'Ngày nghỉ bắt đầu không được để trống.',
            'start_date.date' => 'Ngày nghỉ bắt đầu phải là định dạng ngày hợp lệ.',
            'start_date.after_or_equal' => 'Ngày nghỉ bắt đầu phải là hôm nay hoặc một ngày trong tương lai.',
            'start_date.date_format' => 'Ngày nghỉ bắt đầu phải có định dạng Y-m-d H:i:s.',
            'end_date.required' => 'Ngày nghỉ kết thúc không được để trống.',
            'end_date.date' => 'Ngày nghỉ kết thúc phải là định dạng ngày hợp lệ.',
            'end_date.after_or_equal' => 'Ngày nghỉ kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
            'end_date.date_format' => 'Ngày nghỉ kết thúc phải có định dạng Y-m-d H:i:s.',
            'user_id.required' => 'Người dùng không được để trống.',
            'user_id.exists' => 'Người dùng không tồn tại trong hệ thống.',
            'title.required' => 'Tiêu đề không được để trống.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'id' => $this->getIdAsTimestamp(),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'start_date' => $request->date('start_date')->setHour(0)->setMinute(0)->setSecond(0),
            'end_date' => $request->date('end_date')->setHour(0)->setMinute(0)->setSecond(0),
            'status' => DayOffStatus::WAIT,
            'created_at' => now(),
            'user_id' => $request->integer('user_id'),
        ];
        $dayoff = DayOff::create($data);
        if ($dayoff) {
            session()->flash('success', 'Tạo đơn xin nghỉ thành công, Hãy chờ cho quản lý xét duyệt');
            return redirect()->route('dayoff.list');
        } else {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function changeStatus(int $dayoff_id, Request $request)
    {

        $dayoff = DayOff::find($dayoff_id);
        if ($dayoff) {
            $validator = Validator::make(
                ['status' => $request->integer('status')],
                ['status' => ['required', Rule::in([DayOffStatus::ACTIVE, DayOffStatus::DENIED])]],
                [
                    'status.required' => 'Vui lòng chọn trạng thái hoạt động.',
                    'status.in' => 'Bạn đang cố tình chọn sai trạng thái.',
                ]);
            if ($validator->fails()) {
                $errors = $validator->errors()->get('status');
                $errors = reset($errors);
                session()->flash('error', $errors);
            } else {
                DB::beginTransaction();
                try {
                    $status = $request->integer('status');
                    $start_date = Carbon::parse($dayoff->start_date)->setHour(0)->setMinute(0)->setSecond(0);
                    $end_date = Carbon::parse($dayoff->end_date)->setHour(0)->setMinute(0)->setSecond(0);
                    $message = 'Cập nhật thành công';
                    if ($status === DayOffStatus::ACTIVE) {
                        $schedules = Schedule::whereBetween('day_registered', [$start_date, $end_date])->where('user_id', $dayoff->user_id)->get();
                        if ($schedules->isNotEmpty()) {
                            // Xóa các bản ghi
                            Schedule::whereIn('id', $schedules->pluck('id'))->update(['is_deleted' => AppConstant::DELETED]);
                            $message = "Nhân viên {$dayoff->user->name} có {$schedules->count()} lịch làm trong ngày nghỉ phép, hệ thống sẽ tự động xóa, đơn của bạn đã được duyệt";
                        }
                    }
                    $dayoff->status = $status;
                    $dayoff->save();
                    DB::commit();
                    session()->flash('success', $message);
                } catch (\Exception $exception) {
                    DB::rollBack();
                    session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
                }
            }
        } else {
            session()->flash('error', 'Không tìm đơn xin nghỉ');
        }
        return redirect()->back();

    }

}
