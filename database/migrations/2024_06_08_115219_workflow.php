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
        Schema::create('workflow', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ quy trình làm việc của nhân viên');
            $table->id();
            $table->string('title')->comment('Tiêu đề');
            $table->text('description')->comment('Nội dung quy trình');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('specialties_id')->nullable()->comment('quy trình sẽ liên quan đến chuyên ngành nào');
            $table->foreign('specialties_id')->references('id')->on('specialties')->onDelete('cascade');
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
