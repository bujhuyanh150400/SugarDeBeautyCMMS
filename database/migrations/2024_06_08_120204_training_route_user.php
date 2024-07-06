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
        Schema::create('training_route_user', function (Blueprint $table) {
            $table->comment('table mapping user training route');
            $table->unsignedBigInteger('training_route_id');
            $table->unsignedBigInteger('user_id');
            $table->float('score')->nullable()->comment('số điểm của nhân viên với bài đánh giá này');
            $table->timestamp('time_start')->nullable()->comment('Thời gian bắt đầu làm bài');
            $table->timestamp('time_did')->nullable()->comment('Thời gian làm bài');
            $table->json('results')->nullable()->comment('kết quả bài thi, lưu dưới dạng json');
            $table->foreign('training_route_id')->references('id')->on('training_route')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->primary(['user_id', 'training_route_id']);
            $table->timestamps();
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
