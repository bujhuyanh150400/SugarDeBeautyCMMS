<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\PayoffStatus;
use App\Helpers\Constant\ScheduleStatus;
use App\Models\ConfigApp;
use App\Models\Schedule;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ConfigAppController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): \Inertia\Response
    {
        $configs = ConfigApp::KeywordFilter($request->get('config_key') ?? '')
            ->paginate(self::PER_PAGE)->toArray();
        return Inertia::render('Config/List', [
            'title' => "Quản lý config",
            'configs' => fn() => $configs,
            'query' => $request->query() ?: null,
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'config_key' => ['required', 'string', 'max:255',Rule::unique('config_app','config_key')],
            'config_value' => ['required'],
            'description' => [function ($attribute, $value, $fail) {
                $value = trim(strip_tags($value));
                if (empty($value)) {
                    $fail('Vui lòng nhập chi tiết nội dung');
                }
            }],
        ], [
            'config_key.required' => 'Trường :attribute là bắt buộc.',
            'config_key.string' => 'Trường :attribute phải là một chuỗi.',
            'config_key.max' => 'Trường :attribute không được vượt quá :max ký tự.',
            'config_key.unique' => ':attribute đã tồn tại',
            'config_value.required' => 'Trường :attribute là bắt buộc.',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        try {
            $data = [
                'id' => $this->getIdAsTimestamp(),
                'config_key' => $request->input('config_key'),
                'config_value' => $request->input('config_value'),
                'description' => $request->input('description'),
            ];
            ConfigApp::create($data);
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
        } catch (QueryException $exception) {
            session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
        }
        return redirect()->back();
    }

    public function edit(int $config_id,Request $request) :RedirectResponse|JsonResponse
    {
        $config = ConfigApp::find($config_id);
        if ($config){
            if ($request->method() === "GET"){
                return response()->json($config);
            }else{
                $validator = Validator::make($request->all(), [
                    'config_key' => ['required', 'string', 'max:255',Rule::unique('config_app','config_key')->ignore($config_id)],
                    'config_value' => ['required'],
                    'description' => [function ($attribute, $value, $fail) {
                        $value = trim(strip_tags($value));
                        if (empty($value)) {
                            $fail('Vui lòng nhập chi tiết nội dung');
                        }
                    }],
                ], [
                    'config_key.required' => 'Trường :attribute là bắt buộc.',
                    'config_key.string' => 'Trường :attribute phải là một chuỗi.',
                    'config_key.max' => 'Trường :attribute không được vượt quá :max ký tự.',
                    'config_key.unique' => ':attribute đã tồn tại',
                    'config_value.required' => 'Trường :attribute là bắt buộc.',
                ]);
                if ($validator->fails()) {
                    return redirect()->back()->withErrors($validator)->withInput();
                }
                try {
                    $config->config_key = $request->input('config_key');
                    $config->config_value = $request->input('config_value');
                    $config->description = $request->input('description');
                    $config->save();
                    session()->flash('success', 'Lưu trữ dữ liệu thành công!');
                }catch (QueryException $exception){
                    session()->flash('error', 'Có lỗi xảy ra');
                }
                return redirect()->back();
            }
        }else{
            return response()->json('Không tìm thấy Config', 422);
        }
    }


    public function deleted(int $config_id): RedirectResponse
    {
        $config = ConfigApp::find($config_id);
        if ($config) {
            try {
                $config->delete();
                session()->flash('success', 'Xoá lịch làm thành công');
            } catch (\Exception $exception) {
                session()->flash('error', 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên');
            }
        }else{
            session()->flash('error', 'Không tìm thấy config');
        }
        return redirect()->back();
    }

}
