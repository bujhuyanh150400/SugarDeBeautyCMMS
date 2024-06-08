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
        Schema::create('training_route_workflow', function (Blueprint $table) {
            $table->comment('table mapping workflow training route');
            $table->unsignedBigInteger('training_route_id');
            $table->unsignedBigInteger('workflow_id');
            $table->foreign('training_route_id')->references('id')->on('training_route')->onDelete('cascade');
            $table->foreign('workflow_id')->references('id')->on('workflow')->onDelete('cascade');
            $table->primary(['training_route_id', 'workflow_id']);
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
