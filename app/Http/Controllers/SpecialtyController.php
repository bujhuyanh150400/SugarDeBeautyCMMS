<?php

namespace App\Http\Controllers;

use App\Helpers\AppConstant;
use App\Models\Facilities;
use App\Models\Specialties;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SpecialtyController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    public function list(): Response
    {
        $specialties = Specialties::KeywordFilter(request()->get('keyword') ?? '')
            ->ActiveFilter(request()->get('active') ?? '')
            ->with(['users' => function ($query) {
                $query->where('is_deleted', AppConstant::NOT_DELETED);
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('Specialty/List', [
            'title' => "Danh sách chuyên môn",
            'specialties' => fn() => $specialties,
            'query' => request()->query() ?: null,
        ]);
    }
    public function view_add(): Response
    {
        $title = "Thêm chuyên môn mới";
        return Inertia::render('Specialty/Add', [
            'title' => $title,
        ]);
    }
    public function add(Request $request): RedirectResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'description' => [function ($attribute, $value, $fail){
                    $value = trim(strip_tags($value));
                    if (empty($value)){
                        $fail('Vui lòng nhập mô tả');
                    }
                }],
                'active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])],
            ],
            [
                'name.required' => 'Vui lòng nhập tên chuyên môn.',
                'active.required' => 'Vui lòng chọn trạng thái hoạt động.',
                'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
            ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'active' => $request->input('active'),
        ];
        $specialty = Specialties::create($data);
        if ($specialty) {
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('specialties.list');
        } else {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view_edit($specialty_id): Response|RedirectResponse
    {
        $specialty = Specialties::find($specialty_id);
        if ($specialty) {
            $title = "Sửa chuyên môn: " . $specialty->name;
            return Inertia::render('Specialty/Edit', [
                'title' => $title,
                'specialty' => $specialty
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy chuyên môn');
            return redirect()->back();
        }
    }
    public function edit($specialty_id, Request $request): RedirectResponse
    {
        $specialty = Specialties::find($specialty_id);
        if ($specialty) {
            $validator = Validator::make(
                $request->all(),
                [
                    'name' => 'required',
                    'description' => [function ($attribute, $value, $fail){
                        $value = trim(strip_tags($value));
                        if (empty($value)){
                            $fail('Vui lòng nhập mô tả');
                        }
                    }],
                    'active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])],
                ],
                [
                    'name.required' => 'Vui lòng nhập tên cơ sở.',
                    'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
                ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            $specialty->name = $request->input('name');
            $specialty->description = $request->input('description');
            $specialty->active = $request->integer('active');
            $specialty->save();
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('specialties.list');
        } else {
            session()->flash('error', 'Không tìm thấy chuyên môn');
            return redirect()->back();
        }
    }

    public function change_active($specialty_id): RedirectResponse
    {
        $specialty = Specialties::find($specialty_id);
        if ($specialty) {
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
                $specialty->active = request()->get('active');
                $specialty->save();
                session()->flash('success', 'Thay đổi trạng thái thành công');
            }
        } else {
            session()->flash('error', 'Không tìm thấy chuyên môn');
        }
        return redirect()->back();
    }
}
