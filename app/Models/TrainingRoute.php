<?php

namespace App\Models;

use App\Models\Scopes\NotDeletedScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TrainingRoute extends Model
{
    use HasFactory;

    protected $table = 'training_route';

    protected static function booted(): void
    {
        static::addGlobalScope(new NotDeletedScope);
    }
    protected $fillable = [
        'id',
        'title',
        'time',
        'description',
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
    /**
     * -------------- Relations -------------
     */
    public function testQuestions(): BelongsToMany
    {
        return $this->belongsToMany(TestQuestion::class, 'training_route_test_question');
    }

    public function workflows(): BelongsToMany
    {
        return $this->belongsToMany(Workflow::class, 'training_route_workflow');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'training_route_user')
            ->withPivot('score', 'time_did','time_start','results')
            ->withTimestamps();
    }
}
