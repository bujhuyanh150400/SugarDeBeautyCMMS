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
        Schema::create('service', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ dịch vụ thuộc chuyên ngành');
            $table->id();
            $table->text('title')->comment('Tiêu đề dịch vụ');
            $table->text('percent')->comment('% hoa hồng mỗi 1 dịch vụ, sẽ được mã hoá');
            $table->text('money')->comment('Số tiền mỗi 1 dịch vụ, sẽ được mã hoá');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('specialties_id')->nullable()->comment('Chuyên ngành');
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
