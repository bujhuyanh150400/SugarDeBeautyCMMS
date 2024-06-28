<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\SpecialtyController;
use App\Http\Controllers\TimeAttendanceController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\DayOffController;
use App\Http\Controllers\PayoffController;
use App\Http\Controllers\RankController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\ConfigAppController;
use App\Http\Controllers\WorkflowController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});
Route::match(['get', 'post'],'short/{short_url}', [TimeAttendanceController::class, 'timeAttendance'])->name('short_url');

Route::middleware('guest')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/view_login', [AuthController::class, 'view_login'])->name('view_login');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/view_file/{filepath}', [FileController::class, 'showFile'])->name('file.show');

    // Quản lý nhân sự
    Route::prefix('user')->group(function () {
        // Quản lý nhân sự
        Route::prefix('manager')->group(function () {
            Route::get('/list', [UserController::class, 'list'])->name('user.list');
            Route::get('/view_add', [UserController::class, 'view_add'])->name('user.view_add');
            Route::post('/add', [UserController::class, 'add'])->name('user.add');
            Route::get('/view_edit/{user_id}', [UserController::class, 'view_edit'])->name('user.view_edit')->whereNumber('user_id');
            // vì cập nhật cả file nên sẽ dùng post
            Route::post('/edit/{user_id}', [UserController::class, 'edit'])->name('user.edit')->whereNumber('user_id');
            Route::patch('/deleted/{user_id}', [UserController::class, 'deleted'])->name('user.deleted')->whereNumber('user_id');
            Route::patch('/deleted_file', [UserController::class, 'deletedFile'])->name('user.deleted_file');
        });
        // Quản lý cấp bậc
        Route::prefix('rank')->group(function (){
            Route::get('/list', [RankController::class, 'list'])->name('rank.list');
            Route::get('/view_add', [RankController::class, 'view_add'])->name('rank.view_add');
            Route::post('/add', [RankController::class, 'add'])->name('rank.add');
            Route::get('/view_edit/{rank_id}', [RankController::class, 'view_edit'])->name('rank.view_edit')->whereNumber('rank_id');
            Route::patch('/edit/{rank_id}', [RankController::class, 'edit'])->name('rank.edit')->whereNumber('rank_id');
        });
        // Quản lý cơ sở
        Route::prefix('facilities')->group(function () {
            Route::get('/list', [FacilityController::class, 'list'])->name('facilities.list');
            Route::get('/view_add', [FacilityController::class, 'view_add'])->name('facilities.view_add');
            Route::post('/add', [FacilityController::class, 'add'])->name('facilities.add');
            Route::get('/view_edit/{facility_id}', [FacilityController::class, 'view_edit'])->name('facilities.view_edit')->whereNumber('facility_id');
            Route::patch('/edit/{facility_id}', [FacilityController::class, 'edit'])->name('facilities.edit')->whereNumber('facility_id');
            Route::patch('/change_active/{facility_id}', [FacilityController::class, 'change_active'])->name('facilities.change_active')->whereNumber('facility_id');
        });
        // Quản lý chuyên môn
        Route::prefix('specialties')->group(function () {
            Route::get('/list', [SpecialtyController::class, 'list'])->name('specialties.list');
            Route::get('/view_add', [SpecialtyController::class, 'view_add'])->name('specialties.view_add');
            Route::post('/add', [SpecialtyController::class, 'add'])->name('specialties.add');
            Route::get('/view_edit/{specialty_id}', [SpecialtyController::class, 'view_edit'])->name('specialties.view_edit')->whereNumber('specialty_id');
            Route::patch('/edit/{specialty_id}', [SpecialtyController::class, 'edit'])->name('specialties.edit')->whereNumber('specialty_id');
            Route::patch('/edit_service/{service_id}', [SpecialtyController::class,'edit_service'])->name('specialties.edit_service')->whereNumber('service_id');
            Route::delete('/deleted_service/{service_id}', [SpecialtyController::class,'deleted_service'])->name('specialties.deleted_service')->whereNumber('service_id');
            Route::patch('/change_active/{specialty_id}', [SpecialtyController::class, 'change_active'])->name('specialties.change_active')->whereNumber('specialty_id');
        });
    });


    // Lịch làm
    Route::prefix('time_attendance')->group(function () {
        // Quản lý lịch làm
        Route::prefix('schedule')->group(function () {
            Route::get('/list', [SchedulesController::class, 'list'])->name('schedules.list');
            Route::get('/manager_schedules/{facilities_id}', [SchedulesController::class, 'managerSchedules'])->name('schedules.managerSchedules')->whereNumber('facilities_id');
            Route::get('/view/{facilities_id}', [SchedulesController::class, 'view'])->name('schedules.view')->whereNumber('facilities_id')->middleware('auth');
            Route::post('/register/{facilities_id}', [SchedulesController::class, 'register'])->name('schedules.register')->whereNumber('facilities_id');
            Route::patch('/edit/{schedule_id}', [SchedulesController::class, 'edit'])->name('schedules.edit')->whereNumber('schedule_id');
            Route::patch('/deleted/{schedule_id}', [SchedulesController::class, 'deleted'])->name('schedules.deleted')->whereNumber('schedule_id');
        });
        // Quản lý chấm công
        Route::prefix('manager')->group(function () {
            Route::get('/list', [TimeAttendanceController::class, 'list'])->name('time_attendance.list');
            Route::match(['get', 'post'], '/control/{user_id}', [TimeAttendanceController::class, 'control'])->name('time_attendance.control')->whereNumber('user_id');
        });
    });

    // Quản lý nghỉ phép
    Route::prefix('dayoff')->group(function () {
        Route::get('/list', [DayOffController::class, 'list'])->name('dayoff.list');
        Route::get('/view_add', [DayOffController::class, 'view_add'])->name('dayoff.view_add');
        Route::post('/add', [DayOffController::class, 'add'])->name('dayoff.add');
        Route::patch('/change_status/{dayoff_id}', [DayOffController::class, 'changeStatus'])->name('dayoff.change_status')->whereNumber('dayoff_id');
    });


    // Quản lý thưởng phạt
    Route::prefix('payoff')->group(function () {
        Route::get('/list', [PayoffController::class, 'list'])->name('payoff.list');
        Route::get('/view_add', [PayoffController::class, 'view_add'])->name('payoff.view_add');
        Route::post('/add', [PayoffController::class, 'add'])->name('payoff.add');
        Route::patch('/change_status/{payoff_id}', [PayoffController::class, 'changeStatus'])->name('payoff.change_status')->whereNumber('payoff_id');
    });
    // Quản lý lương
    Route::prefix('salary')->group(function () {
        Route::get('/list', [SalaryController::class, 'list'])->name('salary.list');
        Route::match(['get','post'],'/add/{user_id}', [SalaryController::class, 'add'])->name('salary.add')->whereNumber('user_id');
        Route::match(['get','patch'],'/detail/{salary_id}', [SalaryController::class, 'detail'])->name('salary.detail')->whereNumber('salary_id');
        Route::get('/view/{salary_id}',[SalaryController::class, 'view'])->name('salary.view')->whereNumber('salary_id');
    });
    // Workflow
    Route::prefix('workflow')->group(function (){
        Route::get('/list',[WorkflowController::class,'list'])->name('workflow.list');
        Route::get('/view_add',[WorkflowController::class,'view_add'])->name('workflow.view_add');
        Route::post('/add',[WorkflowController::class,'add'])->name('workflow.add');
        Route::get('/view/{workflow_id}',[WorkflowController::class,'view'])->name('workflow.view')->whereNumber('workflow_id');
        Route::get('/view_edit/{workflow_id}',[WorkflowController::class,'view_edit'])->name('workflow.view_edit');
        Route::patch('/edit/{workflow_id}',[WorkflowController::class,'edit'])->name('workflow.edit');
    });

    // config
    Route::prefix('config')->group(function () {
        Route::get('/list', [ConfigAppController::class, 'list'])->name('config.list');
        Route::post('/add', [ConfigAppController::class, 'add'])->name('config.add');
        Route::match(['get','patch'],'/edit/{config_id}', [ConfigAppController::class, 'edit'])->name('config.edit')->whereNumber('config_id');
        Route::delete('/deleted/{config_id}', [ConfigAppController::class,'deleted'])->name('config.deleted')->whereNumber('config_id');
    });
});





