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
        Schema::create('test_question_answers', function (Blueprint $table) {
            $table->comment('Table lưu trữ các đáp án cho từng câu hỏi');
            $table->id();
            $table->string('answer')->comment('Nội dung đáp án');
            $table->smallInteger('is_correct')->default(0)->comment('Đáp án đúng hay sai');
            $table->unsignedBigInteger('test_question_id');
            $table->foreign('test_question_id')->references('id')->on('test_question')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
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
