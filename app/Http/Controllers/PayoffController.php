<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\PayoffStatus;
use App\Models\DayOff;
use App\Models\Facilities;
use App\Models\PayOff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class PayoffController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): Response
    {
        $payoffs_query = PayOff::query();
        if (Gate::allows('allow_admin')) {
            $payoffs_query->FacilityFilter($request->get('facility') ?? '');
        } elseif (Gate::allows('just_manager')) {
            $payoffs_query->FacilityFilter(\auth()->user()->facility_id);
        }else{
            $payoffs_query->where('user_id',Auth::user()->id);
        }
        $payoffs_query->KeywordFilter($request->get('keyword') ?? '');
        $payoffs = $payoffs_query
            ->with(['user', 'user.facility', 'creator', 'creator.facility'])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        if (Gate::allows('allow_admin')){
            $facilities = Facilities::where('active', AppConstant::ACTIVE)->get();
        }
        return Inertia::render('Payoff/List', [
            'title' => "Quản lý Thưởng / Phạt",
            'payoffs' => fn() => $payoffs,
            'query' => $request->query() ?: null,
            'facilities' => $facilities ?? [],
            'payoffStatus' => PayoffStatus::getList()
        ]);
    }

    public function view_add(): Response
    {
        if (Gate::allows('just_manager')) {
            $users = User::FacilityFilter(\auth()->user()->facility_id)->with(['facility', 'specialties'])->get();
        } elseif (Gate::allows('allow_admin')){
            $users = User::with(['facility', 'specialties'])->get();
        }
        return Inertia::render('Payoff/Add', [
            'title' => "Tạo đơn Thưởng / Phạt",
            'users' => fn() => $users,
            'payoffStatus' => PayoffStatus::getList()
        ]);
    }
    public function add(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'payoff_at' => ['required', 'date', function ($attributes, $value, $fails) {
                $date = Carbon::parse($value);
                $now = Carbon::now();
                if (!($date->month === $now->month && $date->year === $now->year)) {
                    $fails('Ngày phải nằm trong tháng hiện tại.');
                }
            }],
            'type' => ['required', Rule::in(array_keys(PayoffStatus::getList()))],
            'user_id' => ['required', 'exists:users,id'],
            'money' => ['required', 'integer', 'min:10000'],
            'description' => [function ($attribute, $value, $fail) {
                $value = trim(strip_tags($value));
                if (empty($value)) {
                    $fail('Vui lòng nhập chi tiết nội dung');
                }
            }],
        ], [
            'payoff_at.required' => 'Vui lòng nhập ngày.',
            'payoff_at.date' => 'Ngày phải là một ngày hợp lệ.',
            'type.required' => 'Vui lòng chọn loại.',
            'type.in' => 'Loại không hợp lệ.',
            'user_id.required' => 'Vui lòng chọn nhân viên.',
            'user_id.exists' => 'Nhân viên bạn chọn không tồn tại.',
            'money.required' => 'Vui lòng nhập số tiền.',
            'money.integer' => 'Số tiền phải là số nguyên.',
            'money.min' => 'Số tiền phải lớn hơn hoặc bằng :min VND.',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'id' => $this->getIdAsTimestamp(),
            'description' => $request->input('description'),
            'payoff_at' => $request->date('payoff_at'),
            'money' => $request->integer('money'),
            'type' => $request->integer('type'),
            'user_id' => $request->integer('user_id'),
            'created_by' => auth()->user()->id,
            'created_at' => now(),
        ];
        $payoff = PayOff::create($data);
        if ($payoff) {
            session()->flash('success', 'Tạo đơn  thành công');
            return redirect()->route('payoff.list');
        } else {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }
}
