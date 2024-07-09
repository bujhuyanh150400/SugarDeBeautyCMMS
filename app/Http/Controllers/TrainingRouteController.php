<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\PermissionAdmin;
use App\Helpers\Constant\TestQuestionType;
use App\Models\File as FileModels;
use App\Models\Specialties;
use App\Models\TestQuestion;
use App\Models\TrainingRoute;
use App\Models\User;
use App\Models\Workflow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TrainingRouteController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): \Inertia\Response
    {
        $training_routes = TrainingRoute::KeywordFilter($request->get('keyword') ?? '')
            ->withCount(['testQuestions', 'workflows'])
            ->with(['users' => function ($query) {
                $query->selectRaw('id');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('TrainingRoute/List', [
            'title' => "Danh sách đào tạo",
            'training_routes' => fn() => $training_routes,
        ]);
    }

    public function view_add(): \Inertia\Response
    {
        $users = User::PermissionFilter(PermissionAdmin::EMPLOYEE)->with('specialties', 'facility')->get();
//        $users = User::with('specialties', 'facility')->get();
        $workflows = Workflow::with('specialties')->get();
        $test_questions = TestQuestion::with('specialties')->get();
        return Inertia::render('TrainingRoute/Add', [
            'title' => "Tạo đào tạo",
            'users' => $users,
            'workflows' => $workflows,
            'test_questions' => $test_questions
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
                'users' => ['required', 'array', function ($attribute, $value, $fails) {
                    $count = User::whereIn('id', $value)->count();
                    if ($count !== count($value)) {
                        $fails('Có ít nhất 1 nhân viên không tồn tại trên hệ thống');
                    }
                }],
                'workflows' => ['required', 'array', function ($attribute, $value, $fails) {
                    $count = Workflow::whereIn('id', $value)->count();
                    if ($count !== count($value)) {
                        $fails('Có ít nhất 1 quy trình không tồn tại trên hệ thống');
                    }
                }],
                'test_questions' => ['required', 'array', function ($attribute, $value, $fails) {
                    $count = TestQuestion::whereIn('id', $value)->count();
                    if ($count !== count($value)) {
                        $fails('Có ít nhất 1 bài test không tồn tại trên hệ thống');
                    }
                }],
                'time' => ['required', 'integer', 'min:10']
            ],
            [
                'title.required' => 'Vui lòng nhập tiêu đề.',
                'title.max' => 'Tiêu đề không được vượt quá :max ký tự.',
                'users.required' => 'Vui lòng chọn nhân viên.',
                'users.array' => 'Danh sách nhân viên không hợp lệ.',
                'workflows.required' => 'Vui lòng chọn quy trình.',
                'workflows.array' => 'Danh sách quy trình không hợp lệ.',
                'test_questions.required' => 'Vui lòng chọn bài test.',
                'test_questions.array' => 'Danh sách bài test không hợp lệ.',
                'time.required' => 'Vui lòng nhập thời gian làm bài.',
                'time.integer' => 'Thời gian phải là số nguyên.',
                'time.min' => 'Thời gian phải lớn hơn hoặc bằng :min phút.',
            ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        DB::beginTransaction();

        try {
            $data = [
                'id' => $this->getIdAsTimestamp(),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'time' => $request->integer('time'),
            ];
            $training_route = TrainingRoute::create($data);
            $training_route->users()->attach($request->get('users'));
            $training_route->workflows()->attach($request->get('workflows'));
            $training_route->testQuestions()->attach($request->get('test_questions'));
            DB::commit();
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('training_route.list');
        }
        catch (\Exception $exception) {
            DB::rollBack();
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view_edit(int $training_route): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $training_route = TrainingRoute::where('id', $training_route)
            ->with(['testQuestions' => function ($query) {
                $query->selectRaw('id');
            }, 'users' => function ($query) {
                $query->selectRaw('id');
            }, 'workflows' => function ($query) {
                $query->selectRaw('id');
            }])->first();
        if ($training_route) {
            $users = User::with('specialties', 'facility')->get();
            $workflows = Workflow::with('specialties')->get();
            $test_questions = TestQuestion::with('specialties')->get();
            return Inertia::render('TrainingRoute/Edit', [
                'title' => "Chỉnh sửa đào tạo",
                'training_route' => fn() => $training_route,
                'users' => $users,
                'workflows' => $workflows,
                'test_questions' => $test_questions
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy bài thi đào tạo');
            return redirect()->route('training_route.list');
        }
    }

    public function edit(int $training_route, Request $request)
    {
        $training_route = TrainingRoute::find($training_route);
        if ($training_route) {
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
                    'users' => ['required', 'array', function ($attribute, $value, $fails) {
                        $count = User::whereIn('id', $value)->count();
                        if ($count !== count($value)) {
                            $fails('Có ít nhất 1 nhân viên không tồn tại trên hệ thống');
                        }
                    }],
                    'workflows' => ['required', 'array', function ($attribute, $value, $fails) {
                        $count = Workflow::whereIn('id', $value)->count();
                        if ($count !== count($value)) {
                            $fails('Có ít nhất 1 quy trình không tồn tại trên hệ thống');
                        }
                    }],
                    'test_questions' => ['required', 'array', function ($attribute, $value, $fails) {
                        $count = TestQuestion::whereIn('id', $value)->count();
                        if ($count !== count($value)) {
                            $fails('Có ít nhất 1 bài test không tồn tại trên hệ thống');
                        }
                    }],
                    'time' => ['required', 'integer', 'min:10']
                ],
                [
                    'title.required' => 'Vui lòng nhập tiêu đề.',
                    'title.max' => 'Tiêu đề không được vượt quá :max ký tự.',
                    'users.required' => 'Vui lòng chọn nhân viên.',
                    'users.array' => 'Danh sách nhân viên không hợp lệ.',
                    'workflows.required' => 'Vui lòng chọn quy trình.',
                    'workflows.array' => 'Danh sách quy trình không hợp lệ.',
                    'test_questions.required' => 'Vui lòng chọn bài test.',
                    'test_questions.array' => 'Danh sách bài test không hợp lệ.',
                    'time.required' => 'Vui lòng nhập thời gian làm bài.',
                    'time.integer' => 'Thời gian phải là số nguyên.',
                    'time.min' => 'Thời gian phải lớn hơn hoặc bằng :min phút.',
                ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            DB::beginTransaction();
            try {
                $training_route->title = $request->input('title');
                $training_route->time = $request->input('time');
                $training_route->description = $request->input('description');
                $training_route->save();
                $training_route->users()->sync($request->get('users'));
                $training_route->workflows()->sync($request->get('workflows'));
                $training_route->testQuestions()->sync($request->get('test_questions'));
                DB::commit();
                session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                return redirect()->route('training_route.list');
            } catch (\Exception $exception) {
                DB::rollBack();
                session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
                return redirect()->back()->withInput();
            }
        } else {
            session()->flash('error', 'Không tìm thấy bài thi đào tạo');
            return redirect()->route('training_route.list');
        }

    }

    public function view(int $training_route): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $training_route = TrainingRoute::find($training_route);
        if ($training_route) {
            return Inertia::render('TrainingRoute/View', [
                'title' => "Xem chi tiết đào tạo",
                'training_route' => fn() => $training_route,
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy bài thi đào tạo');
            return redirect()->route('training_route.list');
        }
    }

    public function view_test(int $training_route): \Inertia\Response|RedirectResponse
    {
        $user = auth()->user();
        $training_route = TrainingRoute::where('id', $training_route)->whereHas('users', function ($query) use ($user) {
            $query->where('id', $user->id)
                ->whereNull('score')
                ->whereNull('time_start')
                ->whereNull('time_did');
        })->withCount(['testQuestions'])->with(['users' => function ($query) use ($user) {
            $query->where('id', $user->id);
        }, 'workflows' => function ($query) {
            $query->select('title');
        }])->first();
        if ($training_route) {
            return Inertia::render('TrainingRoute/ViewTest', [
                'title' => "Chuẩn bị làm bài thi đào tạo chất lượng",
                'training_route' => fn() => $training_route,
            ]);
        } else {
            session()->flash('error', 'Không thấy bài thi của bạn hoặc bạn đã làm bài thi rồi');
            return redirect()->route('training_route.list');
        }

    }

    public function do_test(int $training_route, Request $request): \Illuminate\Http\JsonResponse|\Inertia\Response|RedirectResponse
    {
        $user = auth()->user();
        $training_route = TrainingRoute::where('id', $training_route)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('id', $user->id)
                    ->whereNull('score')
                    ->whereNull('time_start')
                    ->whereNull('time_did');
            })
            ->with(['testQuestions.files', 'testQuestions.answers' => function ($query) {
                $query->select('id', 'answer', 'test_question_id');
            }, 'workflows'])
            ->first();
        if ($training_route) {
            if ($request->method() === "GET") {
                return Inertia::render('TrainingRoute/DoTest', [
                    'title' => "Làm bài thi đào tạo chất lượng",
                    'training_route' => fn() => $training_route,
                ]);
            } else {
                try {
                    $training_route->users()->updateExistingPivot($user->id, [
                        'time_start' => now(),
                        'score' => 0,
                    ]);
                    $training_route->save();
                    return response()->json('Bắt đầu làm bài thi !!!');
                } catch (\Exception $exception) {
                    return response()->json('Có lỗi xảy ra , vui lòng liên hệ với quản trị viên', 500);
                }

            }
        } else {
            session()->flash('error', 'Không thấy bài thi của bạn hoặc bạn đã làm bài thi rồi');
            return redirect()->route('training_route.list');
        }
    }

    public function scoring(int $training_route, Request $request): RedirectResponse
    {
        $user = auth()->user();
        $training_route = TrainingRoute::where('id', $training_route)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('id', $user->id);
            })
            ->with(['testQuestions.files', 'testQuestions.answers'])
            ->first();
        if ($training_route) {
            if ($request->boolean('violating')){
                $training_route->users()->updateExistingPivot($user->id, [
                    'time_did' => now(),
                    'score' => 0,
                ]);
                $training_route->save();
                session()->flash('warning', 'Bạn đã vi phạm nội quy, bài làm của bạn sẽ đã chấm 0 điểm');
                return redirect()->route('training_route.list');
            }
            $test_questions = $training_route->testQuestions->toArray();
            $result = $request->input('result');
            $check_total_exam = array_reduce($test_questions, function ($carry, $test_question) use ($result) {
                $user_answer = $result[$test_question['id']];
                if (!empty($user_answer)){
                    $correct_answers_array = array_filter($test_question['answers'],function ($answer){
                        return $answer['is_correct'] === 1;
                    });
                    $correct_answers_array = array_column($correct_answers_array,'id');
                    if ($test_question['type'] === TestQuestionType::TYPE_CHECKBOX){
                        if (count($correct_answers_array) === count($user_answer) && !array_diff($correct_answers_array, $user_answer) && !array_diff($user_answer, $correct_answers_array)) {
                            return $carry + 1;
                        }
                    }
                    if ($test_question['type'] === TestQuestionType::TYPE_RADIO){
                        $correct_answer = reset($correct_answers_array);
                        if ($correct_answer === $user_answer){
                            return $carry + 1;
                        }
                    }
                }
            }, 0);
            $score = ($check_total_exam / count($test_questions)) * 100;
            $training_route->users()->updateExistingPivot($user->id, [
                'time_did' => now(),
                'score' => $score,
                'results' => json_encode($result),
            ]);
            $training_route->save();
            session()->flash('success', 'Bạn đã làm xong bài test, bài thi đã được chấm điểm');
            return redirect()->route('training_route.list');
        } else {
            session()->flash('error', 'Không thấy bài thi của bạn hoặc bạn đã làm bài thi rồi');
        }
        return redirect()->route('training_route.list');
    }

    public function deleted(int $training_route): RedirectResponse
    {
        $training_route = TrainingRoute::find($training_route);
        if ($training_route) {
            $training_route->is_deleted = AppConstant::DELETED;
            $training_route->save();
            session()->flash('success', 'Xoá bài thi đào tạo thành công');
        } else {
            session()->flash('error', 'Không tìm thấy bài thi đào tạo');
        }
        return redirect()->back();

    }
}
