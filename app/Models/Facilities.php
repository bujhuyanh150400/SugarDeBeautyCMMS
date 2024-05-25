<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facilities extends Model
{
    use HasFactory;

    protected $table = 'facilities';
    protected $fillable = [
        'id',
        'name',
        'address',
        'active',
        'created_at',
        'updated_at',
    ];
    public function scopeKeywordFilter(Builder $query, $keyword = null): void
    {
        if (!empty($keyword)) {
            $keyword = strtolower($keyword);
            $query->whereRaw('LOWER(name) LIKE ?', '%' . $keyword . '%')
                ->orWhereRaw('LOWER(address) LIKE ?', '%' . $keyword . '%')
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
        return $this->hasMany(User::class,'facility_id');
    }
    public function schedules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Schedule::class,'facility_id');
    }
}
