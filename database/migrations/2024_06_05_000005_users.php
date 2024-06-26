<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ nhân sự');
            $table->id();
            $table->string('name')->comment('Tên nhân sự');
            $table->string('email')->unique()->comment('Email nhân sự ( dùng để đăng nhập)');
            $table->string('password')->comment('Password nhân sự');
            $table->timestamp('birth')->comment('Ngày sinh nhân sự');
            $table->smallInteger('gender')->default(1)->comment('Giới tính: 1 - Nam | 2 - nữ');
            $table->string('phone')->nullable()->comment('SĐT Nhân viên');
            $table->text('address')->nullable()->comment('Địa chỉ nơi ở nhân viên');
            $table->smallInteger('permission')->nullable()->comment('Phân quyền trong Admin');
            $table->string('bin_bank')->nullable()->comment('ngân hàng nhân viên sử dụng của nhân viên');
            $table->text('account_bank')->nullable()->comment('Mã ngân hàng của nhân viên , đã được mã hoá');
            $table->text('account_bank_name')->nullable()->comment('Tên chủ thể ngân hàng, đã được mã hoá');
            $table->text('salary_per_month')->nullable()->comment('Lương cứng hàng tháng, đã được mã hoá');
            $table->smallInteger('number_of_day_offs')->default(0)->comment('Số ngày được phép nghỉ phép');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->smallInteger('is_deleted')->default(0)->comment('0 - chưa xóa | 1 - đã xóa');
            $table->unsignedBigInteger('facility_id')->nullable()->comment('Cơ sở làm việc');
            $table->unsignedBigInteger('specialties_id')->nullable()->comment('Chuyên ngành làm việc');
            $table->unsignedBigInteger('rank_id')->nullable()->comment('Cấp bậc nhân viên');
            $table->foreign('facility_id')->references('id')->on('facilities')->onDelete('cascade');
            $table->foreign('rank_id')->references('id')->on('ranks')->onDelete('cascade');
            $table->foreign('specialties_id')->references('id')->on('specialties')->onDelete('cascade');
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
