<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\TestQuestionType;
use App\Models\File as FileModels;
use App\Models\Specialties;
use App\Models\TestQuestion;
use App\Models\TestQuestionAnswer;
use App\Models\Workflow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TestQuestionController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): \Inertia\Response
    {
        $test_questions = TestQuestion::KeywordFilter($request->get('keyword') ?? '')
            ->SpecialtiesFilter($request->integer('specialties_id') ?? 0)
            ->with('specialties')
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        $specialties = Specialties::all();
        return Inertia::render('TestQuestion/List', [
            'title' => "Danh sách bài kiểm tra",
            'test_questions' => fn() => $test_questions,
            'specialties' => $specialties,
        ]);
    }

    public function view_add(): \Inertia\Response
    {
        $specialties = Specialties::all();
        $types = TestQuestionType::getList();
        return Inertia::render('TestQuestion/Add', [
            'title' => "Tạo câu hỏi",
            'specialties' => fn() => $specialties,
            'types' => $types,
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
                'answers' => [function ($attr, $value, $fails) use ($request) {
                    if (empty($value)) {
                        return $fails('Hãy thêm ít nhất 1 đáp án');
                    }
                    if (!in_array($request->integer('type'),[TestQuestionType::TYPE_RADIO,TestQuestionType::TYPE_CHECKBOX])){
                        return $fails('Hãy chọn 1 kiểu câu trả lời');
                    }
                    $check_answer = array_reduce($value, function ($carry, $item) {
                        if ((int)$item['is_correct']) {
                            $carry['validate_correct'][] = $item;
                        }
                        if (empty(trim($item['answer']))) {
                            $carry['validate_answer'][] = $item;
                        }
                        return $carry;
                    }, ['validate_answer' => [], 'validate_correct' => []]);
                    if (empty($check_answer['validate_correct'])) {
                        $fails('Hãy chọn ít nhất 1 kết quả đúng');
                    }
                    if (!empty($check_answer['validate_answer'])) {
                        $fails('Có 1 đáp án chưa điền kết quả');
                    }
                }]
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
        DB::beginTransaction();
        try {
            $data = [
                'id' => $this->getIdAsTimestamp(),
                'title' => $request->input('title'),
                'type' => $request->integer('type'),
                'specialties_id' => $request->integer('specialties_id'),
                'description' => $request->input('description'),
            ];
            $test_question = TestQuestion::create($data);
            if ($request->hasFile('file_upload')) {
                $files = $request->file('file_upload');
                foreach ($files as $file) {
                    $file_upload = FileController::saveFile($file);
                    $savedFileUpload = FileModels::create($file_upload);
                    $test_question->files()->attach($savedFileUpload->id);
                }
            }
            foreach ($request->input('answers') as $answer) {
                $data_answer = [
                    'id' => $this->getIdAsTimestamp(),
                    'answer' => $answer['answer'],
                    'is_correct' => $answer['is_correct'],
                    'test_question_id' => $test_question->id,
                ];
                TestQuestionAnswer::create($data_answer);
            }
            DB::commit();
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('test_question.list');
        }catch (\Exception $exception){
            DB::rollBack();
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }


    public function view_edit(int $test_question_id): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $test_question = TestQuestion::with('specialties', 'files','answers')->find($test_question_id);
        if ($test_question) {
            $specialties = Specialties::all();
            $types = TestQuestionType::getList();
            return Inertia::render('TestQuestion/Edit', [
                'title' => "Chỉnh sửa bài test",
                'specialties' => $specialties,
                'types' => $types,
                'test_question' => fn() => $test_question,
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy bài test');
            return redirect()->back();
        }
    }
    public function edit(int $test_question_id, Request $request)
    {
        $test_question = TestQuestion::with('specialties', 'files','answers')->find($test_question_id);
        if ($test_question) {
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
                    'answers' => [function ($attr, $value, $fails) use ($request) {
                        if (empty($value)) {
                            return $fails('Hãy thêm ít nhất 1 đáp án');
                        }
                        if (!in_array($request->integer('type'),[TestQuestionType::TYPE_RADIO,TestQuestionType::TYPE_CHECKBOX])){
                           return $fails('Hãy chọn 1 kiểu câu trả lời');
                        }
                        $check_answer = array_reduce($value, function ($carry, $item) {
                            if ((int)$item['is_correct']) {
                                $carry['validate_correct'][] = $item;
                            }
                            if (empty(trim($item['answer']))) {
                                $carry['validate_answer'][] = $item;
                            }
                            return $carry;
                        }, ['validate_answer' => [], 'validate_correct' => []]);
                        if (empty($check_answer['validate_correct'])) {
                            $fails('Hãy chọn ít nhất 1 kết quả đúng');
                        }
                        if (!empty($check_answer['validate_answer'])) {
                            $fails('Có 1 đáp án chưa điền kết quả');
                        }
                    }]
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
            DB::beginTransaction();
            try {
                $test_question->title = $request->input('title');
                $test_question->specialties_id = $request->input('specialties_id');
                $test_question->description = $request->input('description');
                $test_question->type = $request->integer('type');
                $test_question->updated_at = now();
                $test_question->save();
                if ($request->hasFile('file_upload')) {
                    $files = $request->file('file_upload');
                    foreach ($files as $file) {
                        $file_upload = FileController::saveFile($file);
                        $savedFileUpload = FileModels::create($file_upload);
                        $test_question->files()->attach($savedFileUpload->id);
                    }
                }
                TestQuestionAnswer::where('test_question_id', $test_question->id)->delete();
                foreach ($request->input('answers') as $answer) {
                    $data_answer = [
                        'id' => $this->getIdAsTimestamp(),
                        'answer' => $answer['answer'],
                        'is_correct' => $answer['is_correct'],
                        'test_question_id' => $test_question->id,
                    ];
                    TestQuestionAnswer::create($data_answer);
                }
                DB::commit();
                session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                return redirect()->route('test_question.list');
            }catch (\Exception $exception){
                DB::rollBack();
                session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
                return redirect()->back()->withInput();
            }
        }else{
            session()->flash('error', 'Không tìm thấy bài test');
            return redirect()->back()->withInput();
        }

    }


    public function deletedFile(Request $request): RedirectResponse
    {
        $test_question = TestQuestion::find($request->input('test_question_id'));
        $file = FileModels::find($request->input('file_id'));
        if ($test_question && $file) {
            $test_question->files()->detach($file->id);
            $filepath = base64_decode($file->file_location);
            if (Storage::exists($filepath)) {
                Storage::delete($filepath);
            }
            $file->delete();
            session()->flash('success', 'Thành công xoá file');
        } else {
            session()->flash('error', 'Không tìm thấy bài test hoặc file');
        }
        return redirect()->back();
    }
    public function deleted(int $test_question_id): RedirectResponse
    {
        $test_question = TestQuestion::find($test_question_id);
        if ($test_question) {
            $test_question->is_deleted = AppConstant::DELETED;
            $test_question->save();
            session()->flash('success', 'Xoá bài test thành công');
        } else {
            session()->flash('error', 'Không tìm thấy bài test');
        }
        return redirect()->back();

    }
}
