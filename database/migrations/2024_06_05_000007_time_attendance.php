<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_attendances', function (Blueprint $table) {
            $table->comment('table dùng để lưu trữ qr chấm công');
            $table->id();
            $table->string('short_url',10)->unique()->comment('url rút ngắn');
            $table->text('pin')->comment('Password qr chấm công, và được mã hoá');
            $table->timestamp('expires_at')->nullable()->comment('thời gian được phép đi muộn');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_attendances');
    }
};
