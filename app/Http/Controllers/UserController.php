<?php

namespace App\Http\Controllers;

use App\Helpers\PermissionAdmin;
use App\Http\Requests\Admin\UsersController\AddRequest;
use App\Models\Facilities;
use App\Models\Specialties;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): \Inertia\Response
    {
        $title = "Danh sách nhân sự";
        $limit = $request->input('limit', self::PER_PAGE);
        $facilities = Facilities::all();
        $users = User::KeywordFilter($request->get('keyword') ?? '')
            ->PermissionFilter($request->get('permission') ?? '')
            ->FacilityFilter($request->get('facility') ?? '')
            ->with('facility')
            ->with('specialties')
            ->paginate($limit);
        return Inertia::render('User/List', [
            'title' => $title,
            'users' => $users,
            'query' => $request->query() ?: null,
            'facilities' => $facilities
        ]);
    }

    public function view_add(): \Inertia\Response
    {
        $title = "Thêm nhân sự mới";
        $facilities = Facilities::all();
        $specialties = Specialties::all();
        return Inertia::render('User/AddUser', [
            'title' => $title,
            'facilities' => $facilities,
            'specialties' => $specialties
        ]);
    }

    public function add(Request $request)
    {
        $facilityIds = Facilities::pluck('id')->toArray();
        $specialtyIds = Specialties::pluck('id')->toArray();
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', Rule::unique('users')],
            'name' => 'required',
            'password' => 'required|min:8|max:36',
            'address' => 'required|max:255',
            'phone' => 'required|numeric|min:9',
            'birth' => 'required|date',
            'gender' => 'required|in:1,2',
            'permission' => ['required', Rule::in(array_keys(PermissionAdmin::getList()))],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
            'facility_id' => ['required', Rule::in($facilityIds)],
            'specialties_id' => ['required', Rule::in($specialtyIds)],
            'description' => 'nullable|string',
        ], [
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không hợp lệ.',
            'email.unique' => 'Địa chỉ email đã tồn tại trong hệ thống.',
            'name.required' => 'Vui lòng nhập tên.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.max' => 'Mật khẩu không được vượt quá 36 ký tự.',
            'address.required' => 'Vui lòng nhập địa chỉ.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.numeric' => 'Số điện thoại phải là số.',
            'phone.min' => 'Số điện thoại phải có ít nhất :min ký tự.',
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
            'description.string' => 'Mô tả phải văn bản.',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        $data = [
            'id' => $this->getIdAsTimestamp(),
            'email' => $request->input('email'),
            'name' => $request->input('name'),
            'password' => Hash::make($request->input('password')),
            'address' => $request->input('address'),
            'permission' => $request->input('permission'),
            'phone' => $request->input('phone'),
            'birth' => date('Y-m-d', strtotime($request->input('birth'))),
            'gender' => $request->integer('gender'),
            'description' => $request->input('description'),
            'facility_id' => $request->integer('facility_id'),
            'specialties_id' => $request->integer('specialties_id'),
        ];
        if ($request->hasFile('avatar')) {
            $extension = $request->file('avatar')->extension();
            // Tạo tên tệp ngắn gọn và độc đáo
            $avatarFileName = 'avatar_' . $data['id'] . '.' . $extension;
            // Lưu trữ file và lấy đường dẫn lưu trữ
            $filePath = self::FILE_PATH_ADMIN . $data['id'];
            $avatarPath = $request->file('avatar')->storeAs($filePath, $avatarFileName);
            $data['avatar'] = base64_encode($avatarPath);
        }
        $user = User::create($data);
        if ($user) {
            session()->flash('success', 'Lưu trữ dữ liệu thành công!');
            return redirect()->route('user.list');
        } else {
            session()->flash('error', 'Có lỗi gì đó khi thao tác, vui lòng liên hệ quản trị viên');
            return redirect()->back()->withInput();
        }
    }
}
