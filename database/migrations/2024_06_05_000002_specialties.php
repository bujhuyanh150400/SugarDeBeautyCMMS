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
        Schema::create('specialties', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ các chuyên ngành');
            $table->id();
            $table->string('name')->comment('Tên chuyên ngành');
            $table->text('description')->nullable()->comment('Mô tả về chuyên ngành');
            $table->smallInteger('active')->default(1)->comment('chuyên ngành có đang hoạt động không: 1 - có| 0 - không');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};
