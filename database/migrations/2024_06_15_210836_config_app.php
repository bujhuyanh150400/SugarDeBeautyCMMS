<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * php artisan migrate --path=/database/migrations/2024_06_15_210836_config_app.php
     */
    public function up(): void
    {
        Schema::create('config_app', function (Blueprint $table) {
            $table->comment('table dùng để config app');
            $table->id();
            $table->string('config_key')->unique();
            $table->text('config_value');
            $table->text('description');
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
