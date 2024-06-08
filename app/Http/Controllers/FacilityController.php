<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Models\Facilities;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }


    public function list(): Response
    {
        $facilities = Facilities::KeywordFilter(request()->get('keyword') ?? '')
            ->ActiveFilter(request()->get('active') ?? '')
            ->with(['users' => function ($query) {
                $query->where('is_deleted', AppConstant::NOT_DELETED);
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('Facility/List', [
            'title' => "Danh sách cơ sở",
            'facilities' => fn() => $facilities,
            'query' => request()->query() ?: null,
        ]);
    }

    public function view_add(): Response
    {
        $title = "Thêm cơ sở mới";
        return Inertia::render('Facility/Add', [
            'title' => $title,
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'address' => 'required|max:255',
                'active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])],
            ],
            [
                'name.required' => 'Vui lòng nhập tên cơ sở.',
                'address.required' => 'Vui lòng nhập địa chỉ.',
                'address.max' => 'Địa chỉ không được vượt quá :max ký tự.',
                'active.required' => 'Vui lòng chọn trạng thái hoạt động.',
                'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
            ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'name' => $request->input('name'),
            'address' => $request->input('address'),
            'active' => $request->input('active'),
        ];
        $facility = Facilities::create($data);
        if ($facility) {
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('facilities.list');
        } else {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view_edit($facility_id): Response|RedirectResponse
    {
        $facility = Facilities::find($facility_id);
        if ($facility) {
            $title = "Sửa cơ sở : " . $facility->name;
            return Inertia::render('Facility/Edit', [
                'title' => $title,
                'facility' => $facility
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy cơ sở');
            return redirect()->back();
        }
    }

    public function edit($facility_id, Request $request): RedirectResponse
    {
        $facility = Facilities::find($facility_id);
        if ($facility) {
            $validator = Validator::make(
                $request->all(),
                [
                    'name' => 'required',
                    'address' => 'required|max:255',
                    'active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])],
                ],
                [
                    'name.required' => 'Vui lòng nhập tên cơ sở.',
                    'address.required' => 'Vui lòng nhập địa chỉ.',
                    'address.max' => 'Địa chỉ không được vượt quá :max ký tự.',
                    'active.required' => 'Vui lòng chọn trạng thái hoạt động.',
                    'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
                ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $facility->name = $request->input('name');
            $facility->address = $request->input('address');
            $facility->active = $request->integer('active');
            $facility->save();
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('facilities.list');
        } else {
            session()->flash('error', 'Không tìm thấy cơ sở');
            return redirect()->back();
        }
    }

    public function change_active($facility_id): RedirectResponse
    {
        $facility = Facilities::find($facility_id);
        if ($facility) {
            $validator = Validator::make(
                ['active' => request()->get('active')],
                ['active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])]],
                [
                    'active.required' => 'Vui lòng chọn trạng thái hoạt động.',
                    'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
                ]);
            if ($validator->fails()) {
                $errors_active = $validator->errors()->get('active');
                $errors_active = reset($errors_active);
                session()->flash('error', $errors_active);
            }else{
                $facility->active = request()->get('active');
                $facility->save();
                session()->flash('success', 'Thay đổi trạng thái thành công');
            }
        } else {
            session()->flash('error', 'Không tìm thấy cơ sở');
        }
        return redirect()->back();
    }

}
