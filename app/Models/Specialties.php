<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialties extends Model
{
    use HasFactory;

    protected $table = 'specialties';

    protected $fillable = [
        'id',
        'name',
        'description',
        'active',
        'updated_at',
        'created_at',
    ];
    public function scopeKeywordFilter(Builder $query, $keyword = null): void
    {
        if (!empty($keyword)) {
            $keyword = strtolower($keyword);
            $query->whereRaw('LOWER(name) LIKE ?', '%' . $keyword . '%')
                ->orWhere('id', '=', intval($keyword));
        }
    }
    public function scopeActiveFilter(Builder $query, $active = null): void
    {
        if (!empty($active)) {
            $query->where('active', $active);
        }
    }
    /**
    -------------- Relations -------------
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class);
    }
    public function service(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Service::class);
    }
    public function workflow(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Workflow::class);
    }
    public function testQuestions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TestQuestion::class);
    }
}
