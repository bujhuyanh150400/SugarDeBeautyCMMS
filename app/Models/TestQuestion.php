<?php

namespace App\Models;

use App\Models\Scopes\NotDeletedScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TestQuestion extends Model
{
    use HasFactory;

    protected $table = 'test_question';

    protected static function booted(): void
    {
        static::addGlobalScope(new NotDeletedScope);
    }

    protected $fillable = [
        'id',
        'title',
        'description',
        'type',
        'specialties_id',
        'created_at',
        'updated_at',
        'is_deleted'
    ];

    public function scopeKeywordFilter(Builder $query, $keyword = null): void
    {
        if (!empty($keyword)) {
            $keyword = strtolower($keyword);
            $query->whereRaw('LOWER(title) LIKE ?', '%' . $keyword . '%')
                ->orWhere('id', '=', intval($keyword));
        }
    }
    public function scopeSpecialtiesFilter(Builder $query, ?int $specialties_id = 0): void
    {
        if (!empty($specialties_id)) {
            $query->where('specialties_id', $specialties_id);
        }
    }

    /**
     * -------------- Relations -------------
     */
    public function files(): BelongsToMany
    {
        return $this->belongsToMany(File::class, 'file_test_question', 'test_question_id', 'file_id');
    }
    public function specialties(): BelongsTo
    {
        return $this->belongsTo(Specialties::class);
    }
    public function answers(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TestQuestionAnswer::class);
    }
    public function trainingRoutes(): BelongsToMany
    {
        return $this->belongsToMany(TrainingRoute::class, 'training_route_test_question');
    }
}
