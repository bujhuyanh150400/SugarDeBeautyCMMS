<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salary', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ luơng của nhân viên hàng tháng');
            $table->id();
            $table->timestamp('day_pay')->nullable()->comment('Ngày trả lương');
            $table->text('total_salary')->comment('Tiền lương tổng, sẽ được mã hoá');
            $table->text('total_workday_money')->comment('Tiền lương tổng khi tính toán ngày làm, sẽ được mã hoá');
            $table->text('service_money')->comment('Tiền lương dịch vụ, sẽ được mã hoá');
            $table->text('description')->nullable()->comment('Nội dung');
            $table->string('description_bank',50)->nullable()->comment('Nội dung chuyển khoản');
            $table->tinyInteger('status')->comment('Trạng thái lương');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary');
    }
};
