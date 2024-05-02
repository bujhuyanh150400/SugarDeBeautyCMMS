<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\SpecialtyController;

Route::get('/',function (){
    return redirect()->route('dashboard');
});

Route::middleware('guest')->group(function (){
    Route::get('/dashboard',[DashboardController::class,'index'])->name('dashboard');
    Route::get('/view_login',[AuthController::class,'view_login'])->name('view_login');
    Route::post('/login',[AuthController::class,'login'])->name('login');
    Route::post('/logout',[AuthController::class,'logout'])->name('logout');
    Route::get('/view_file/{filepath}', [FileController::class, 'showFile'])->name('file.show');
    Route::prefix('user')->group(function (){
        // Quản lý nhân sự
        Route::prefix('manager')->group(function (){
            Route::get('/list',[UserController::class,'list'])->name('user.list');
            Route::get('/view_add',[UserController::class,'view_add'])->name('user.view_add');
            Route::post('/add',[UserController::class,'add'])->name('user.add');
            Route::get('/view_edit/{user_id}',[UserController::class,'view_edit'])->name('user.view_edit')->whereNumber('user_id');
            // vì cập nhật cả file nên sẽ dùng post
            Route::post('/edit/{user_id}',[UserController::class,'edit'])->name('user.edit')->whereNumber('user_id');
            Route::patch('/deleted/{user_id}',[UserController::class,'deleted'])->name('user.deleted')->whereNumber('user_id');
            Route::patch('/deleted_file',[UserController::class,'deletedFile'])->name('user.deleted_file');
        });
        // Quản lý cơ sở
        Route::prefix('facilities')->group(function (){
            Route::get('/list',[FacilityController::class,'list'])->name('facilities.list');
            Route::get('/view_add',[FacilityController::class,'view_add'])->name('facilities.view_add');
            Route::post('/add',[FacilityController::class,'add'])->name('facilities.add');
            Route::get('/view_edit/{facility_id}',[FacilityController::class,'view_edit'])->name('facilities.view_edit')->whereNumber('facility_id');
            Route::patch('/edit/{facility_id}',[FacilityController::class,'edit'])->name('facilities.edit')->whereNumber('facility_id');
            Route::patch('/change_active/{facility_id}',[FacilityController::class,'change_active'])->name('facilities.change_active')->whereNumber('facility_id');
        });
        // Quản lý chuyên môn
        Route::prefix('specialties')->group(function (){
            Route::get('/list',[SpecialtyController::class,'list'])->name('specialties.list');
            Route::get('/view_add',[SpecialtyController::class,'view_add'])->name('specialties.view_add');
            Route::post('/add',[SpecialtyController::class,'add'])->name('specialties.add');
            Route::get('/view_edit/{specialty_id}',[SpecialtyController::class,'view_edit'])->name('specialties.view_edit')->whereNumber('specialty_id');
            Route::patch('/edit/{specialty_id}',[SpecialtyController::class,'edit'])->name('specialties.edit')->whereNumber('specialty_id');
            Route::patch('/change_active/{specialty_id}',[SpecialtyController::class,'change_active'])->name('specialties.change_active')->whereNumber('specialty_id');
        });
    });
});





