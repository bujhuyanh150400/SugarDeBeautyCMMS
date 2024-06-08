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
        Schema::create('training_route_test_question', function (Blueprint $table) {
            $table->comment('table mapping test question training route');
            $table->unsignedBigInteger('training_route_id');
            $table->unsignedBigInteger('test_question_id');
            $table->foreign('training_route_id')->references('id')->on('training_route')->onDelete('cascade');
            $table->foreign('test_question_id')->references('id')->on('test_question')->onDelete('cascade');
            $table->primary(['training_route_id', 'test_question_id']);
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
