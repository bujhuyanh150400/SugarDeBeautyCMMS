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
        Schema::create('file_test_question', function (Blueprint $table) {
            $table->comment('table mapping file test question');
            $table->unsignedBigInteger('file_id');
            $table->unsignedBigInteger('test_question_id');
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
            $table->foreign('test_question_id')->references('id')->on('test_question')->onDelete('cascade');
            $table->primary(['file_id', 'test_question_id']);
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
