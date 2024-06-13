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
        Schema::create('salary_service', function (Blueprint $table) {
            $table->comment('table mapping salary và service');
            $table->unsignedBigInteger('salary_id');
            $table->unsignedBigInteger('service_id');
            $table->integer('total_service')->nullable()->comment('Số dịch vụ đã làm trong tháng đó');
            $table->foreign('salary_id')->references('id')->on('salary')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('service')->onDelete('cascade');
            $table->primary(['salary_id', 'service_id']);
            $table->timestamps();
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
