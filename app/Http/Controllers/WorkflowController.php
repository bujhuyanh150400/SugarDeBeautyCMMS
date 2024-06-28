<?php

namespace App\Http\Controllers;

use App\Models\File as FileModels;
use App\Models\Specialties;
use App\Models\Workflow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): \Inertia\Response
    {

        $workflows = Workflow::KeywordFilter($request->get('keyword') ?? '')
            ->SpecialtiesFilter($request->integer('specialties_id') ?? 0)
            ->with('specialties')
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        $specialties = Specialties::all();
        return Inertia::render('Workflow/List', [
            'title' => "Danh sách quy trình",
            'specialties' => $specialties,
            'workflows' => fn() => $workflows,
        ]);
    }

    public function view_add(): \Inertia\Response
    {
        $specialties = Specialties::all();
        return Inertia::render('Workflow/Add', [
            'title' => "Tạo Workflow",
            'specialties' => fn() => $specialties,
        ]);
    }

    public function add(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required|max:255',
                'description' => [function ($attribute, $value, $fail) {
                    $value = trim(strip_tags($value));
                    if (empty($value)) {
                        $fail('Vui lòng nhập mô tả');
                    }
                }],
                'specialties_id' => ['required', Rule::exists('specialties', 'id')],
            ],
            [
                'title.required' => 'Vui lòng nhập tiêu đề.',
                'title.max' => 'Tiêu đề không được vượt quá :max ký tự.',
                'specialties_id.required' => 'Vui lòng chọn chuyên môn.',
                'specialties_id.exist' => 'Chuyên môn không tồn tại trong hệ thống.',
            ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            $data = [
                'id' => $this->getIdAsTimestamp(),
                'title' => $request->input('title'),
                'specialties_id' => $request->integer('specialties_id'),
                'description' => $request->input('description'),
            ];
            $workflow = Workflow::create($data);
            if ($request->hasFile('file_upload')) {
                $files = $request->file('file_upload');
                foreach ($files as $file) {
                    $file_upload = FileController::saveFile($file);
                    $savedFileUpload = FileModels::create($file_upload);
                    $workflow->files()->attach($savedFileUpload->id);
                }
            }
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('workflow.list');
        } catch (\Exception $exception) {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view(int $workflow_id): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $workflow = Workflow::with('specialties', 'files')->find($workflow_id);
        if ($workflow) {
            return Inertia::render('Workflow/View', [
                'title' => "Xem chi tiết Workflow",
                'workflow' => fn() => $workflow,
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy workflow');
            return redirect()->back();
        }
    }


    public function view_edit(int $workflow_id)
    {

    }

    public function edit(int $workflow_id, Request $request)
    {

    }


}
