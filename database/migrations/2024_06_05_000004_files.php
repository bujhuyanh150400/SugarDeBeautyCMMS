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
        Schema::create('files', function (Blueprint $table) {
            $table->comment('table file manager');
            $table->id();
            $table->string('file_name')->nullable();
            $table->string('file_real_name')->nullable();
            $table->string('file_location')->nullable();
            $table->smallInteger('file_type')->nullable()->comment('Thể loại file là gì: file lưu trữ, avatar , ...');
            $table->string('file_extension',10)->nullable()->comment('file extension');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
