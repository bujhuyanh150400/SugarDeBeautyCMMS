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
        Schema::create('payoff', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ thưởng phạt');
            $table->id();
            $table->smallInteger('type')->comment('Trạng thái Thưởng / phạt');
            $table->text('money')->comment('Số tiền, sẽ được mã hoá');
            $table->text('description')->comment('Nội dung, sẽ được mã hoá');
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
