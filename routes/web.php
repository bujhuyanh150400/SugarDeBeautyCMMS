<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FacilityController;

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

            Route::put('/deleted/{user_id}',[UserController::class,'deleted'])->name('user.deleted')->whereNumber('user_id');
            Route::put('/deleted_file',[UserController::class,'deletedFile'])->name('user.deleted_file');
        });

        Route::prefix('facilities')->group(function (){
            Route::get('/list',[FacilityController::class,'list'])->name('facilities.list');
            Route::get('/view_add',[FacilityController::class,'view_add'])->name('facilities.view_add');
            Route::post('/add',[FacilityController::class,'add'])->name('user.add');

        });
    });
});





