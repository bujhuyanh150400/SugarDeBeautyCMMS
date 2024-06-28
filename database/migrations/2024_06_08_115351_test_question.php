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
        Schema::create('test_question', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ các bài kiểm tra');
            $table->id();
            $table->string('title')->comment('Tiêu đề');
            $table->text('description')->comment('Nội dung');
            $table->smallInteger('type')->comment('Loại bài kiểm tra (trắc nghiệm 1 câu, nhiều câu , textarea)');
            $table->tinyInteger('is_deleted')->default(0);
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
