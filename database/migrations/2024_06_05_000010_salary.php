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
            $table->timestamp('day_pay')->comment('Ngày trả lương');
            $table->text('money')->comment('Tiền lương, sẽ được mã hoá');
            $table->text('description')->comment('Nội dung');
            $table->string('description_bank')->comment('Nội dung chuyển khoản');
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
        //
    }
};
