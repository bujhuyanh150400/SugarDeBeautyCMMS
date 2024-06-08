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
        Schema::create('ranks', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ cấp bậc');
            $table->id();
            $table->string('title')->comment('Tiêu đề');
            $table->text('percent_rank')->comment('Phần trăm mức lương dựa theo cấp bậc, sẽ được mã hoá');
            $table->text('description')->comment('Nội dung');
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
