<?php

namespace App\Http\Controllers;

use App\Helpers\Constant\AppConstant;
use App\Helpers\Constant\PermissionAdmin;
use App\Models\Facilities;
use App\Models\File as FileModels;
use App\Models\Rank;
use App\Models\Specialties;
use App\Models\TimeAttendance;
use App\Models\User;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private array $facilityIds;
    private array $specialtyIds;

    public function __construct()
    {
        parent::__construct();
        $this->facilityIds = Facilities::pluck('id')->toArray();
        $this->specialtyIds = Specialties::pluck('id')->toArray();
    }

    public function list(Request $request): Response
    {
        $title = "Danh sách nhân sự";
        $facilities = Facilities::all();
        $users = User::KeywordFilter($request->get('keyword') ?? '')
            ->PermissionFilter($request->get('permission') ?? '')
            ->FacilityFilter($request->get('facility') ?? '')
            ->with(['facility', 'specialties', 'files', 'rank'])
            ->where('is_deleted', AppConstant::NOT_DELETED)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('User/List', [
            'title' => $title,
            'users' => fn() => $users,
            'query' => $request->query() ?: null,
            'facilities' => $facilities
        ]);
    }

    public function view_add(): Response
    {
        $title = "Thêm nhân sự mới";
        $banks = $this->getListBanks();
        $facilities = Facilities::all();
        $specialties = Specialties::all();
        $ranks = Rank::all();
        return Inertia::render('User/Add', [
            'title' => $title,
            'facilities' => $facilities,
            'specialties' => $specialties,
            'banks' => $banks,
            'ranks' => $ranks
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $banks = $this->getListBanks();
        if (empty($banks)) {
            return redirect()->back()->withInput();
        }
        $banks = array_column($banks, 'bin');
        $validator = Validator::make(
            $request->all(),
            [
                'email' => ['required', 'email', Rule::unique('users')],
                'name' => 'required',
                'password' => 'required|min:8|max:16',
                'address' => 'required|max:255',
                'phone' => ['required', 'regex:/^\+\d{10,15}$/'],
                'birth' => 'required|date',
                'gender' => 'required|in:1,2',
                'permission' => ['required', Rule::in(array_keys(PermissionAdmin::getList()))],
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
                'facility_id' => ['required', Rule::in($this->facilityIds)],
                'specialties_id' => ['required', Rule::in($this->specialtyIds)],
                'bin_bank' => [Rule::in($banks)],
                'salary_per_month' => ['required', 'integer'],
                'number_of_day_offs' => ['required','integer','min:0'],
                'rank' => ['required', 'exists:ranks,id'],
            ],
            [
                'email.required' => 'Vui lòng nhập địa chỉ email.',
                'email.email' => 'Địa chỉ email không hợp lệ.',
                'email.unique' => 'Địa chỉ email đã tồn tại trong hệ thống.',
                'name.required' => 'Vui lòng nhập tên.',
                'password.required' => 'Vui lòng nhập mật khẩu.',
                'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
                'password.max' => 'Mật khẩu không được vượt quá :max ký tự.',
                'address.required' => 'Vui lòng nhập địa chỉ.',
                'address.max' => 'Địa chỉ không được vượt quá :max ký tự.',
                'phone.required' => 'Vui lòng nhập số điện thoại.',
                'phone.regex' => 'Số điện thoại phải tuân thủ định dạng E.164 và có từ 10 đến 15 chữ số.',
                'birth.required' => 'Vui lòng nhập ngày sinh.',
                'birth.date' => 'Ngày sinh không hợp lệ.',
                'gender.required' => 'Vui lòng chọn giới tính.',
                'gender.in' => 'Giới tính không hợp lệ.',
                'permission.required' => 'Vui lòng chọn vai trò của người dùng.',
                'permission.in' => 'Bạn đang cố tình chọn sai quyền.',
                'avatar.image' => 'Tệp phải là hình ảnh.',
                'avatar.mimes' => 'Tệp phải có định dạng jpeg, png, jpg, gif hoặc svg.',
                'avatar.max' => 'Tệp không được vượt quá 10240KB.',
                'facility_id.required' => 'Vui lòng chọn cơ sở.',
                'facility_id.in' => 'Cơ sở không tồn tại trong hệ thống.',
                'specialties_id.required' => 'Vui lòng chọn chuyên môn.',
                'specialties_id.in' => 'Chuyên môn không tồn tại trong hệ thống.',
                'bin_bank.in' => 'Mã ngân hàng không tồn tại.',
                'salary_per_month.required' => 'Hãy nhập lương cứng hàng tháng',
                'salary_per_month.integer' => 'Lương phải là số',
                'number_of_day_offs.required' => 'Số ngày được phép nghỉ trong 1 tháng không được để trống',
                'number_of_day_offs.integer' => 'Số ngày được phép nghỉ trong 1 tháng phải là một số nguyên.',
                'number_of_day_offs.min' => 'Số ngày được phép nghỉ trong 1 tháng phải lớn hơn :min',
                'rank.required' => 'Trường cấp bậc là bắt buộc.',
                'rank.integer' => 'Cấp bậc phải là một số nguyên.',
                'rank.exists' => 'Cấp bậc đã chọn không tồn tại trong bảng cấp bậc.',
            ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        try {
            $data = [
                'id' => $this->getIdAsTimestamp(),
                'email' => $request->input('email'),
                'name' => $request->input('name'),
                'password' => Hash::make($request->input('password')),
                'address' => $request->input('address'),
                'permission' => $request->input('permission'),
                'phone' => $request->input('phone'),
                'birth' => $request->date('birth')->setTimezone(config('app.timezone'))->format('Y-m-d'),
                'gender' => $request->integer('gender'),
                'facility_id' => $request->integer('facility_id'),
                'specialties_id' => $request->integer('specialties_id'),
                'bin_bank' => $request->input('bin_bank'),
                'account_bank' => $request->input('account_bank'),
                'account_bank_name' => $request->input('account_bank_name'),
                'salary_per_month' => $request->input('salary_per_month'),
                'number_of_day_offs' => $request->input('number_of_day_offs'),
                'rank_id' => $request->input('rank')
            ];
            $user = User::create($data);
            if ($request->hasFile('avatar')) {
                $avatar = FileController::saveFile($request->file('avatar'), AppConstant::FILE_TYPE_AVATAR);
                $savedAvatar = FileModels::create($avatar);
                $user->files()->attach($savedAvatar->id);
            }
            if ($request->hasFile('file_upload')) {
                $files = $request->file('file_upload');
                foreach ($files as $file) {
                    $file_upload = FileController::saveFile($file);
                    $savedFileUpload = FileModels::create($file_upload);
                    $user->files()->attach($savedFileUpload->id);
                }
            }
            // Sau khi tạo xong sẽ tạo luôn QR code cho nhân viên
            TimeAttendance::create([
                'id' => $this->getIdAsTimestamp(),
                'pin' => random_int(100000, 999999),
                'short_url' => Str::random(10),
                'expires_at' => Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute(5)->second(0)->toDateTimeString(),
                'user_id' => $user->id,
            ]);
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('user.list');
        } catch (QueryException|Exception $exception) {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }

    public function view_edit($user_id): Response|RedirectResponse
    {
        $user = User::with('facility', 'specialties', 'files')->find($user_id);
        if ($user) {
            $banks = $this->getListBanks();
            $ranks = Rank::all();
            $facilities = Facilities::all();
            $specialties = Specialties::all();
            return Inertia::render('User/Edit', [
                'title' => 'Chỉnh sửa nhân sự ' . $user->name,
                'user' => $user,
                'facilities' => $facilities,
                'specialties' => $specialties,
                'banks' => $banks,
                'ranks' => $ranks
            ]);
        } else {
            session()->flash('error', 'Không tìm thấy người dùng');
            return redirect()->back();
        }
    }

    public function edit($user_id, Request $request): RedirectResponse
    {
        $user = User::find($user_id);
        if ($user) {
            $banks = $this->getListBanks();
            if (empty($banks)) {
                return redirect()->back()->withInput();
            }
            $banks = array_column($banks, 'bin');
            $validator = Validator::make(
                $request->all(),
                [
                    'name' => 'required',
                    'address' => 'required|max:255',
                    'phone' => ['required', 'regex:/^\+\d{10,15}$/'],
                    'birth' => 'required|date',
                    'gender' => 'required|in:1,2',
                    'permission' => ['required', Rule::in(array_keys(PermissionAdmin::getList()))],
                    'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
                    'facility_id' => ['required', Rule::in($this->facilityIds)],
                    'specialties_id' => ['required', Rule::in($this->specialtyIds)],
                    'bin_bank' => ['nullable',Rule::in($banks)],
                    'salary_per_month' => ['required', 'integer'],
                    'number_of_day_offs' => ['required','integer','min:0'],
                    'rank' => ['required', 'exists:ranks,id'],
                ],
                [
                    'name.required' => 'Vui lòng nhập tên',
                    'address.required' => 'Vui lòng nhập địa chỉ.',
                    'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
                    'phone.required' => 'Vui lòng nhập số điện thoại.',
                    'phone.regex' => 'Số điện thoại phải tuân thủ định dạng E.164 và có từ 10 đến 15 chữ số.',
                    'birth.required' => 'Vui lòng nhập ngày sinh.',
                    'birth.date' => 'Ngày sinh không hợp lệ.',
                    'gender.required' => 'Vui lòng chọn giới tính.',
                    'gender.in' => 'Giới tính không hợp lệ.',
                    'permission.required' => 'Vui lòng chọn vai trò của người dùng.',
                    'permission.in' => 'Bạn đang cố tình chọn sai quyền.',
                    'avatar.image' => 'Tệp phải là hình ảnh.',
                    'avatar.mimes' => 'Tệp phải có định dạng jpeg, png, jpg, gif hoặc svg.',
                    'avatar.max' => 'Tệp không được vượt quá 10240KB.',
                    'facility_id.required' => 'Vui lòng chọn cơ sở.',
                    'facility_id.in' => 'Cơ sở không tồn tại trong hệ thống.',
                    'specialties_id.required' => 'Vui lòng chọn chuyên môn.',
                    'specialties_id.in' => 'Chuyên môn không tồn tại trong hệ thống.',
                    'bin_bank.in' => 'Mã ngân hàng không tồn tại.',
                    'salary_per_month.required' => 'Hãy nhập lương cứng hàng tháng',
                    'salary_per_month.integer' => 'Lương phải là số',
                    'number_of_day_offs.required' => 'Số ngày được phép nghỉ trong 1 tháng không được để trống',
                    'number_of_day_offs.integer' => 'Số ngày được phép nghỉ trong 1 tháng phải là một số nguyên.',
                    'number_of_day_offs.min' => 'Số ngày được phép nghỉ trong 1 tháng phải lớn hơn :min',
                    'rank.required' => 'Trường cấp bậc là bắt buộc.',
                    'rank.integer' => 'Cấp bậc phải là một số nguyên.',
                    'rank.exists' => 'Cấp bậc đã chọn không tồn tại trong bảng cấp bậc.',
                ]);
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
            $user->name = $request->input('name');
            $user->address = $request->input('address');
            $user->phone = $request->input('phone');
            $user->birth = $request->date('birth')->setTimezone(config('app.timezone'))->format('Y-m-d');
            $user->gender = $request->input('gender');
            $user->permission = $request->integer('permission');
            $user->facility_id = $request->integer('facility_id');
            $user->specialties_id = $request->integer('specialties_id');
            $user->updated_at = now();
            $user->bin_bank = $request->input('bin_bank');
            $user->account_bank = $request->input('account_bank');
            $user->account_bank_name = $request->input('account_bank_name');
            $user->salary_per_month = $request->input('salary_per_month');
            $user->number_of_day_offs = $request->input('number_of_day_offs');
            $user->rank_id = $request->input('rank');
            $user->save();
            if ($request->hasFile('avatar')) {
                $avatar = FileController::saveFile($request->file('avatar'), AppConstant::FILE_TYPE_AVATAR);
                $savedAvatar = FileModels::create($avatar);
                $user->files()->attach($savedAvatar->id);
            }
            if ($request->hasFile('file_upload')) {
                $files = $request->file('file_upload');
                foreach ($files as $file) {
                    $file_upload = FileController::saveFile($file);
                    $savedFileUpload = FileModels::create($file_upload);
                    $user->files()->attach($savedFileUpload->id);
                }
            }
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('user.list');
        } else {
            session()->flash('error', 'Không tìm thấy người dùng');
            return redirect()->back();
        }
    }

    public function deleted($user_id): RedirectResponse
    {
        $user = User::find($user_id);
        if ($user) {
            if (Auth::user()->id === $user->id) {
                session()->flash('error', 'Bạn không thể xóa tài khoản đang đăng nhập được');
            } else {
                $user->is_deleted = AppConstant::DELETED;
                $user->save();
                session()->flash('success', 'Xoá người dùng thành công');
            }
        } else {
            session()->flash('error', 'Không tìm thấy người dùng');
        }
        return redirect()->back();

    }

    public function deletedFile(Request $request): RedirectResponse
    {
        $user = User::find($request->integer('user_id'));
        $file = FileModels::find($request->integer('file_id'));
        if ($user && $file) {
            $user->files()->detach($file->id);
            $filepath = base64_decode($file->file_location);
            if (Storage::exists($filepath)) {
                Storage::delete($filepath);
            }
            $file->delete();
            session()->flash('success', 'Thành công xoá file');
        } else {
            session()->flash('error', 'Không tìm thấy người dùng hoặc file');
        }
        return redirect()->back();
    }

}
