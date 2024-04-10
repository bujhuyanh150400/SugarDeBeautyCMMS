<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::middleware('guest')->group(function (){
    Route::get('/',[DashboardController::class,'index'])->name('dashboard');
    Route::get('/view_login',[AuthController::class,'view_login'])->name('view_login');
    Route::post('/login',[AuthController::class,'login'])->name('login');
    Route::post('/logout',[AuthController::class,'logout'])->name('logout');
    Route::get('/view_file/{filepath}', [FileController::class, 'showFile'])->name('file.show');
    Route::prefix('user')->group(function (){
        Route::get('/list',[UserController::class,'list'])->name('user.list');
        Route::get('/view_add',[UserController::class,'view_add'])->name('user.view_add');
        Route::post('/add',[UserController::class,'add'])->name('user.add');
        Route::get('/detail/{user_id}',[UserController::class,'detail'])->name('user.detail')->whereNumber('user_id');
        Route::get('/view_edit/{user_id}',[UserController::class,'detail'])->name('user.view_edit')->whereNumber('user_id');
    });
});





