<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Models\Service;
use App\Models\Specialties;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            ->with(['users','service'])
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
                'description' => [function ($attribute, $value, $fail) {
                    $value = trim(strip_tags($value));
                    if (empty($value)) {
                        $fail('Vui lòng nhập mô tả');
                    }
                }],
                'active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])],
                'service.*.title' => ['required', 'string'],
                'service.*.money' => ['required', 'numeric', 'min:1000'],
                'service.*.percent' => ['required', 'numeric', 'min:1', 'max:100'],
            ],
            [
                'name.required' => 'Vui lòng nhập tên chuyên môn.',
                'active.required' => 'Vui lòng chọn trạng thái hoạt động.',
                'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
                'service.*.title' => ['required' => 'Vui lòng nhập tên dịch vụ', 'string' => 'Tên dịch vụ phải là chuỗi'],
                'service.*.money' => ['required' => 'Vui lòng nhập số tiền cho dịch vụ', 'numeric' => 'Số tiền phải là số', 'min' => 'Số tiền phải lớn hơn hoặc bằng :min VND'],
                'service.*.percent' => ['required' => 'Vui lòng nhập phần trăm hoa hồng', 'numeric' => 'Phần trăm hoa hồng phải là số', 'min' => 'Số % phải lớn hơn hoặc bằng :min %', 'max' => 'Số % phải nhỏ hơn hoặc bằng :max %'],
            ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'id' => $this->getIdAsTimestamp(),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'active' => $request->input('active'),
        ];
        DB::beginTransaction();
        try {
            $specialty = Specialties::create($data);
            $services = array_values($request->input('service'));
            array_walk($services, function (&$service) use ($data) {
                $service['id'] = $this->getIdAsTimestamp();
            });
            $specialty->service()->createMany($services);
            DB::commit();
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('specialties.list');
        } catch (Exception $e) {
            // Nếu có lỗi xảy ra, rollback transaction
            DB::rollBack();
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view_edit($specialty_id): Response|RedirectResponse
    {
        $specialty = Specialties::with(['service'])->find($specialty_id);
        if ($specialty) {
            $title = "Sửa chuyên môn: " . $specialty->name;
            return Inertia::render('Specialty/Edit', [
                'title' => $title,
                'specialty' => fn() => $specialty
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
                    'description' => [function ($attribute, $value, $fail) {
                        $value = trim(strip_tags($value));
                        if (empty($value)) {
                            $fail('Vui lòng nhập mô tả');
                        }
                    }],
                    'active' => ['required', Rule::in([AppConstant::ACTIVE, AppConstant::IN_ACTIVE])],
                    'service.*.title' => ['required', 'string'],
                    'service.*.money' => ['required', 'numeric', 'min:1000'],
                    'service.*.percent' => ['required', 'numeric', 'min:1', 'max:100'],
                ],
                [
                    'name.required' => 'Vui lòng nhập tên cơ sở.',
                    'active.in' => 'Bạn đang cố tình chọn sai trạng thái.',
                    'service.*.title' => ['required' => 'Vui lòng nhập tên dịch vụ', 'string' => 'Tên dịch vụ phải là chuỗi'],
                    'service.*.money' => ['required' => 'Vui lòng nhập số tiền cho dịch vụ', 'numeric' => 'Số tiền phải là số', 'min' => 'Số tiền phải lớn hơn hoặc bằng :min VND'],
                    'service.*.percent' => ['required' => 'Vui lòng nhập phần trăm hoa hồng', 'numeric' => 'Phần trăm hoa hồng phải là số', 'min' => 'Số % phải lớn hơn hoặc bằng :min %', 'max' => 'Số % phải nhỏ hơn hoặc bằng :max %'],
                ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            DB::beginTransaction();
            try {
                $specialty->name = $request->input('name');
                $specialty->description = $request->input('description');
                $specialty->active = $request->integer('active');
                $services = array_values($request->input('service'));
                array_walk($services, function (&$service) {
                    $service['id'] = $this->getIdAsTimestamp();
                });
                $specialty->service()->createMany($services);
                $specialty->save();
                DB::commit();
                session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                return redirect()->route('specialties.list');
            } catch (Exception $e) {
                // Nếu có lỗi xảy ra, rollback transaction
                DB::rollBack();
                session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
                return redirect()->back()->withInput();
            }
        } else {
            session()->flash('error', 'Không tìm thấy chuyên môn');
            return redirect()->back();
        }
    }

    public function edit_service(int $service_id, Request $request): RedirectResponse
    {
        $service = Service::find($service_id);
        if ($service) {
            $validator = Validator::make(
                $request->all(),
                [
                    'title' => ['required', 'string'],
                    'money' => ['required', 'numeric', 'min:1000'],
                    'percent' => ['required', 'numeric', 'min:1', 'max:100'],
                ],
                [
                    'title' => ['required' => 'Vui lòng nhập tên dịch vụ', 'string' => 'Tên dịch vụ phải là chuỗi'],
                    'money' => ['required' => 'Vui lòng nhập số tiền cho dịch vụ', 'numeric' => 'Số tiền phải là số', 'min' => 'Số tiền phải lớn hơn hoặc bằng :min VND'],
                    'percent' => ['required' => 'Vui lòng nhập phần trăm hoa hồng', 'numeric' => 'Phần trăm hoa hồng phải là số', 'min' => 'Số % phải lớn hơn hoặc bằng :min %', 'max' => 'Số % phải nhỏ hơn hoặc bằng :max %'],
                ]);
            if ($validator->fails()) {
                $errors = $validator->errors()->all();
                array_walk($errors, function ($error){
                    session()->flash('error', $error);
                });
            } else {
                $service->title = $request->input('title');
                $service->money = $request->input('money');
                $service->percent = $request->input('percent');
                $service->save();
                session()->flash('success', 'Thay đổi thành công');
            }
        } else {
            session()->flash('error', 'Không tìm thấy dịch vụ');
        }
        return redirect()->back();
    }

    public function deleted_service(int $service_id): RedirectResponse
    {
        $service = Service::find($service_id);
        if ($service) {
            $service->delete();
            session()->flash('success', 'Xoá thành công');
        } else {
            session()->flash('error', 'Không tìm thấy dịch vụ');
        }
        return redirect()->back();
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
            } else {
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
