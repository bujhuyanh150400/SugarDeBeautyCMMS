<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AuthController extends Controller
{

    public function view_login(): \Inertia\Response
    {
        return Inertia::render('Login');
    }

    public function login(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'max:16'],
        ], [
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không hợp lệ.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
            'password.max' => 'Mật khẩu tối đa là :max ký tự.',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        if (Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')])) {
            $request->session()->regenerate();
            return redirect()->route('dashboard');
        } else {
            return redirect()->back()->withErrors([
                'login' => 'Email hoặc password của bạn không đúng hoặc không tồn tại',
            ])->withInput();
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        // Xóa session hoặc thực hiện bất kỳ xử lý đăng xuất nào khác nếu cần thiết
        $request->session()->invalidate();
        return redirect()->route('view_login');
    }
}
