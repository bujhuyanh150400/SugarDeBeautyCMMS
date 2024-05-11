<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ lịch làm');
            $table->id();
            $table->timestamp('day_registered')->comment('ngày đăng kí');
            $table->timestamp('start_time_registered')->comment('Thời gian bắt đầu');
            $table->timestamp('end_time_registered')->comment('Thời gian kết thúc');
            $table->tinyInteger('type')->comment('loại lịch làm');
            $table->tinyInteger('status')->comment('trạng thái chấm công');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('time_attendance_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('time_attendance_id')->references('id')->on('time_attendances')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
