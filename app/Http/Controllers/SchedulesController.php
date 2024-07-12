<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\ScheduleStatus;
use App\Models\Facilities;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Mockery\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;

class SchedulesController extends Controller
{
    public function list(): Response
    {
        $facilities = Facilities::with('users')
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('Schedules/List', [
            'title' => "Quản lý lịch làm",
            'facilities' => fn() => $facilities,
        ]);
    }

    public function managerSchedules(int $facilities_id): Response|RedirectResponse
    {
        $facility = Facilities::find($facilities_id);
        if ($facility) {
            if ((Gate::allows('just_manager') && \auth()->user()->facility_id !== $facilities_id)
            ){
                session()->flash('error', 'Bạn không có quyền truy cập');
                return redirect()->route('dashboard');
            }
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();
            $users_schedule = User::whereHas('facility', function ($query) use ($facilities_id) {
                $query->where('id', $facilities_id);
            })->whereHas('schedules', function ($query) use ($startOfWeek, $endOfWeek) {
                $query->whereDate('day_registered', '>=', $startOfWeek)
                    ->whereDate('day_registered', '<=', $endOfWeek);
            })->with(['specialties', 'schedules' => function ($query) use ($startOfWeek, $endOfWeek) {
                $query->whereDate('day_registered', '>=', $startOfWeek)
                    ->whereDate('day_registered', '<=', $endOfWeek);
            }])->get();
            $users = User::whereHas('facility', function ($query) use ($facilities_id) {
                $query->where('id', $facilities_id);
            })->with('specialties')->get();

            return Inertia::render('Schedules/ManagerSchedules', [
                'title' => "Quản lý lịch làm: " . $facility->name,
                'facility' => $facility,
                'users_schedule' => fn() => $users_schedule,
                'users' => $users,
                'startOfWeek' => $startOfWeek->format('d/m/Y'),
                'endOfWeek' => $endOfWeek->format('d/m/Y'),
                'scheduleType' => ScheduleStatus::getListType(),
                'scheduleStatus' => ScheduleStatus::getList(),
                'scheduleStatusConstant' => ScheduleStatus::getConstants(),
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy cơ sở');
            return redirect()->back();
        }
    }
    public function selfSchedules(): Response
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        $self_schedules = User::where('id', auth()->user()->id)->whereHas('schedules', function ($query) use ($startOfWeek, $endOfWeek) {
            $query->whereDate('day_registered', '>=', $startOfWeek)
                ->whereDate('day_registered', '<=', $endOfWeek);
        })->with(['specialties', 'schedules' => function ($query) use ($startOfWeek, $endOfWeek) {
            $query->whereDate('day_registered', '>=', $startOfWeek)
                ->whereDate('day_registered', '<=', $endOfWeek);
        }])->first();
        return Inertia::render('Schedules/SelfSchedules', [
            'title' => "Lịch làm cá nhân",
            'self_schedules' => fn() => $self_schedules,
            'startOfWeek' => $startOfWeek->format('d/m/Y'),
            'endOfWeek' => $endOfWeek->format('d/m/Y'),
            'scheduleType' => ScheduleStatus::getListType(),
            'scheduleStatus' => ScheduleStatus::getList(),
            'scheduleStatusConstant' => ScheduleStatus::getConstants(),
        ]);
    }


    public function view(Request $request, int $facilities_id): JsonResponse
    {
        $facility = Facilities::find($facilities_id);
        if ($facility) {
            try {
                $day_registered = $request->date('day_registered');
                if (empty($day_registered)) {
                    return response()->json('Hãy chọn 1 ngày để tìm lịch làm', 422);
                }
                $users_schedule = User::whereHas('facility', function ($query) use ($facilities_id) {
                    $query->where('id', $facilities_id);
                })->whereHas('schedules', function ($query) use ($day_registered) {
                    $query->whereDate('day_registered', '=', $day_registered);
                })->with(['specialties', 'schedules' => function ($query) use ($day_registered) {
                    $query->whereDate('day_registered', '=', $day_registered);
                }])->get();
                return response()->json($users_schedule);
            } catch (Exception $exception) {
                return response()->json('Có lỗi xảy ra , vui lòng liên hệ với quản trị viên', 500);
            }
        } else {
            return response()->json('Không tìm thấy cơ sở', 422);
        }
    }


    public function viewSelfSchedules(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $day_registered = $request->date('day_registered');
            if (empty($day_registered)) {
                return response()->json('Hãy chọn 1 ngày để tìm lịch làm', 422);
            }
            $users_schedule = User::where('id', auth()->user()->id)->whereHas('schedules', function ($query) use ($day_registered) {
                $query->whereDate('day_registered', '=', $day_registered);
            })->with(['specialties', 'schedules' => function ($query) use ($day_registered) {
                $query->whereDate('day_registered', '=', $day_registered);
            }])->get();
            return response()->json($users_schedule);
        } catch (Exception $exception) {
            return response()->json('Có lỗi xảy ra , vui lòng liên hệ với quản trị viên', 500);
        }
    }

    public function register(Request $request, int $facilities_id): RedirectResponse
    {
        $facility = Facilities::find($facilities_id);
        if ($facility) {
            $validator = Validator::make($request->all(), [
                'day_registered' => ['required', 'date', 'after_or_equal:today'],
                'user_id' => ['required', 'exists:users,id,facility_id,' . $facility->id],
                'start_time_registered' => [
                    'required',
                    function ($attribute, $value, $fail) use ($request) {
                        // Kiểm tra nếu thời gian kết thúc được cung cấp
                        if ($request->has('end_time_registered')) {
                            $start_time = Carbon::parse($value);
                            $end_time = Carbon::parse($request->input('end_time_registered'));
                            if ($end_time->lessThan($start_time)) {
                                $fail('Giờ bắt đầu phải lớn hơn giờ kết thúc');
                            }
                            if ($start_time->diffInHours($end_time) < 4) {
                                $fail('Đăng kí lịch làm phải tối thiểu 4 tiếng 1 ca.');
                            }
                            // Kiểm tra xem có lịch trùng trong cơ sở dữ liệu không
                            $existingSchedule = Schedule::whereDate('day_registered', $request->date('day_registered'))
                                ->where('user_id', $request->integer('user_id'))
                                ->where(function ($query) use ($start_time, $end_time) {
                                    $query->where(function ($query) use ($start_time, $end_time) {
                                        $query->whereTime('start_time_registered', '<=', $end_time)->whereTime('end_time_registered', '>=', $start_time);
                                    });
                                })
                                ->exists();
                            if ($existingSchedule) {
                                $fail('Bạn đang chọn 1 khung giờ làm đè lên khung giờ hôm nay bạn đã đăng kí');
                            }
                        } else {
                            $fail('Hãy chọn giờ kết thúc làm việc');
                        }

                    },
                ],
                'end_time_registered' => 'required',
                'type' => ['required', 'numeric', Rule::in(array_keys(ScheduleStatus::getListType()))],
            ], [
                'day_registered.required' => 'Ngày đăng ký là bắt buộc.',
                'day_registered.date' => 'Ngày đăng ký phải là một ngày hợp lệ.',
                'day_registered.after_or_equal' => 'Ngày đăng ký phải là hôm nay hoặc một ngày trong tương lai.',
                'user_id.required' => 'Mã nhân viên là bắt buộc.',
                'user_id.exists' => 'Mã nhân viên không tồn tại hoặc không thuộc cơ sở này.',
                'start_time_registered.required' => 'Giờ bắt đầu làm việc là bắt buộc.',
                'end_time_registered.required' => 'Giờ kết thúc làm việc là bắt buộc.',
                'type.required' => 'Loại lịch làm việc là bắt buộc.',
                'type.numeric' => 'Loại lịch làm việc không hợp lệ.',
                'type.in' => 'Loại lịch làm việc không hợp lệ.',
            ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            $user = User::where('facility_id', $facility->id)->where('id', $request->integer('user_id'))->first();
            try {
                $schedule = [
                    'id' => $this->getIdAsTimestamp(),
                    'day_registered' => $request->date('day_registered')->setTimezone(config('app.timezone'))->setHour(0)->setMinute(0)->setSecond(0),
                    'start_time_registered' => $request->date('start_time_registered'),
                    'end_time_registered' => $request->date('end_time_registered'),
                    'type' => $request->integer('type'),
                    'status' => ScheduleStatus::WAIT,
                    'note' => $request->input('note'),
                    'user_id' => $user->id,
                    'facility_id' => $facility->id,
                    'time_attendance_id' => $user->timeAttendance->id
                ];
                Schedule::create($schedule);
                session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                return redirect()->back();
            } catch (QueryException $exception) {
                session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
                return redirect()->back()->withInput();
            }
        } else {
            session()->flash('error', 'Không tìm thấy cơ sở');
            return redirect()->back();
        }
    }

    public function register_self(Request $request) {
        $validator = Validator::make($request->all(),
            [
            'day_registered' => ['required', 'date', 'after_or_equal:today'],
            'start_time_registered' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    // Kiểm tra nếu thời gian kết thúc được cung cấp
                    if ($request->has('end_time_registered')) {
                        $start_time = Carbon::parse($value);
                        $end_time = Carbon::parse($request->input('end_time_registered'));
                        if ($end_time->lessThan($start_time)) {
                            $fail('Giờ bắt đầu phải lớn hơn giờ kết thúc');
                        }
                        if ($start_time->diffInHours($end_time) < 4) {
                            $fail('Đăng kí lịch làm phải tối thiểu 4 tiếng 1 ca.');
                        }
                        // Kiểm tra xem có lịch trùng trong cơ sở dữ liệu không
                        $existingSchedule = Schedule::whereDate('day_registered', $request->date('day_registered'))
                            ->where('user_id', Auth::user()->id)
                            ->where(function ($query) use ($start_time, $end_time) {
                                $query->where(function ($query) use ($start_time, $end_time) {
                                    $query->whereTime('start_time_registered', '<=', $end_time)->whereTime('end_time_registered', '>=', $start_time);
                                });
                            })
                            ->exists();
                        if ($existingSchedule) {
                            $fail('Bạn đang chọn 1 khung giờ làm đè lên khung giờ hôm nay bạn đã đăng kí');
                        }
                    } else {
                        $fail('Hãy chọn giờ kết thúc làm việc');
                    }

                },
            ],
            'end_time_registered' => 'required',
            'type' => ['required', 'numeric', Rule::in(array_keys(ScheduleStatus::getListType()))],
        ],
            [
            'day_registered.required' => 'Ngày đăng ký là bắt buộc.',
            'day_registered.date' => 'Ngày đăng ký phải là một ngày hợp lệ.',
            'day_registered.after_or_equal' => 'Ngày đăng ký phải là hôm nay hoặc một ngày trong tương lai.',
            'user_id.required' => 'Mã nhân viên là bắt buộc.',
            'user_id.exists' => 'Mã nhân viên không tồn tại hoặc không thuộc cơ sở này.',
            'start_time_registered.required' => 'Giờ bắt đầu làm việc là bắt buộc.',
            'end_time_registered.required' => 'Giờ kết thúc làm việc là bắt buộc.',
            'type.required' => 'Loại lịch làm việc là bắt buộc.',
            'type.numeric' => 'Loại lịch làm việc không hợp lệ.',
            'type.in' => 'Loại lịch làm việc không hợp lệ.',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        try {
            $schedule = [
                'id' => $this->getIdAsTimestamp(),
                'day_registered' => $request->date('day_registered')->setTimezone(config('app.timezone'))->setHour(0)->setMinute(0)->setSecond(0),
                'start_time_registered' => $request->date('start_time_registered'),
                'end_time_registered' => $request->date('end_time_registered'),
                'type' => $request->integer('type'),
                'status' => ScheduleStatus::WAIT,
                'note' => $request->input('note'),
                'user_id' => Auth::user()->id,
                'facility_id' => Auth::user()->facility_id,
                'time_attendance_id' => Auth::user()->timeAttendance->id
            ];
            Schedule::create($schedule);
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->back();
        } catch (QueryException $exception) {
            session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function edit(Request $request, int $schedule_id): RedirectResponse
    {
        $schedule = Schedule::find($schedule_id);
        if ($schedule) {
            $validator = Validator::make($request->all(), [
                'start_time_registered' => [
                    'required',
                    function ($attribute, $value, $fail) use ($request, $schedule) {
                        // Kiểm tra nếu thời gian kết thúc được cung cấp
                        if ($request->has('end_time_registered')) {
                            $start_time = Carbon::parse($value);
                            $end_time = Carbon::parse($request->input('end_time_registered'));
                            if ($end_time->lessThan($start_time)) {
                                $fail('Giờ bắt đầu phải lớn hơn giờ kết thúc');
                            }
                            if ($start_time->diffInHours($end_time) < 4) {
                                $fail('Đăng kí lịch làm phải tối thiểu 4 tiếng 1 ca.');
                            }
                            // Kiểm tra xem có lịch trùng trong cơ sở dữ liệu không
                            $existingSchedule = Schedule::whereDate('day_registered', $request->date('day_registered'))
                                ->where('user_id', $schedule->user_id)
                                ->where('id', '!=', $schedule->id)
                                ->where(function ($query) use ($start_time, $end_time) {
                                    $query->where(function ($query) use ($start_time, $end_time) {
                                        $query->whereTime('start_time_registered', '<=', $end_time)->whereTime('end_time_registered', '>=', $start_time);
                                    });
                                })
                                ->exists();
                            if ($existingSchedule) {
                                $fail('Bạn đang chọn 1 khung giờ làm đè lên khung giờ hôm nay bạn đã đăng kí');
                            }
                        } else {
                            $fail('Hãy chọn giờ kết thúc làm việc');
                        }
                    },
                ],
                'end_time_registered' => 'required',
                'type' => ['required', 'numeric', Rule::in(array_keys(ScheduleStatus::getListType()))],
                'status' => ['required', 'numeric', Rule::in(array_keys(ScheduleStatus::getList())), function ($attribute, $value, $fail) use ($request, $schedule) {
                    //  phân quyền làm sau
                }]
            ], [
                'start_time_registered.required' => 'Giờ bắt đầu làm việc là bắt buộc.',
                'end_time_registered.required' => 'Giờ kết thúc làm việc là bắt buộc.',
                'type.required' => 'Loại lịch làm việc là bắt buộc.',
                'type.numeric' => 'Loại lịch làm việc không hợp lệ.',
                'type.in' => 'Loại lịch làm việc không hợp lệ.',
                'status.required' => 'Loại chấm công lịch làm việc là bắt buộc.',
                'status.numeric' => 'Loại chấm công lịch làm việc không hợp lệ.',
                'status.in' => 'Loại chấm công lịch làm việc không hợp lệ.',
            ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            try {
                $schedule->start_time_registered = $request->date('start_time_registered');
                $schedule->end_time_registered = $request->date('end_time_registered');
                $schedule->type = $request->integer('type');
                $schedule->status = $request->integer('status');
                $schedule->note = $request->input('note');
                $schedule->updated_at = now();
                $schedule->save();
                session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                return redirect()->back();
            } catch (QueryException $exception) {
                session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
                return redirect()->back()->withInput();
            }
        } else {
            session()->flash('error', 'Không tìm thấy lịch làm');
            return redirect()->back();
        }
    }

    public function deleted(int $schedule_id): RedirectResponse
    {
        $schedule = Schedule::find($schedule_id);
        if ($schedule) {
            try {
                if (in_array($schedule->status, [ScheduleStatus::DONE, ScheduleStatus::LATE, ScheduleStatus::CANCEL])) {
                    session()->flash('error', 'Người làm đã chấm công');
                }
                $schedule->is_deleted = AppConstant::DELETED;
                $schedule->save();
                session()->flash('success', 'Xoá lịch làm thành công');
            } catch (QueryException $exception) {
                session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
            }
        } else {
            session()->flash('error', 'Không tìm thấy lịch làm');
        }
        return redirect()->back();
    }

}
