<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
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
});





