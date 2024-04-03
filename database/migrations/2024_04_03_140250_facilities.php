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
        Schema::create('facilities', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ các cơ sở làm việc');
            $table->id();
            $table->string('name')->comment('Tên cơ sở');
            $table->string('address')->comment('Địa chỉ cụ thể cơ sở ');
            $table->string('logo')->nullable()->comment('Ảnh đại diện cơ sở');
            $table->smallInteger('active')->default(1)->comment('Cơ sở có đang hoạt động không: 1 - có| 2 - không');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinic');
    }
};
