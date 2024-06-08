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
        Schema::create('file_workflow', function (Blueprint $table) {
            $table->comment('table mapping file workflow');
            $table->unsignedBigInteger('file_id');
            $table->unsignedBigInteger('workflow_id');
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
            $table->foreign('workflow_id')->references('id')->on('workflow')->onDelete('cascade');
            $table->primary(['file_id', 'workflow_id']);
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
