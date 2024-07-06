<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestQuestionAnswer extends Model
{
    use HasFactory;

    protected $table = 'test_question_answers';

    protected $fillable = [
        'id',
        'answer',
        'is_correct',
        'test_question_id',
        'created_at',
        'updated_at',
    ];
    /**
     * -------------- Relations -------------
     */
    public function questions(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->BelongsTo(TestQuestion::class);
    }
}
