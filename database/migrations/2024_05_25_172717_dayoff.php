<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dayoff', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ nghỉ phép của nhân viên');
            $table->id();
            $table->string('title')->comment('Tiêu đề nghỉ phép');
            $table->text('description')->comment('Nội dung xin nghỉ phép nghỉ phép');
            $table->timestamp('day_off')->comment('Ngày xin nghỉ của nhân viên');
            $table->smallInteger('status')->comment('Trạng thái đơn');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('dayoff');
    }
};
