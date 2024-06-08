<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DayOff extends Model
{
    use HasFactory;


    protected $table = 'dayoff';
    protected $fillable = [
        'id',
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
        'created_at',
        'updated_at',
        'user_id',
    ];

    public function scopeKeywordFilter(Builder $query, $keyword = null): void
    {
        if (!empty($keyword)) {
            $keyword = strtolower($keyword);
            $query->whereHas('user', function ($query_user) use ($keyword) {
                $query_user->whereRaw('LOWER(email) LIKE ?', '%' . $keyword . '%')
                    ->orWhereRaw('LOWER(name) LIKE ?', '%' . $keyword . '%')
                    ->orWhere('id', '=', intval($keyword));
            })->orWhere('id', '=', intval($keyword));
        }
    }

    public function scopeDayOffFilterBetween(Builder $query, $start_date = null, $end_date = null): void
    {
        if (!empty($start_date) && !empty($end_date)) {
            $query->whereBetween('day_off', [$start_date, $end_date]);
        } elseif (!empty($start_date)) {
            $query->where('day_off', '>=', $start_date);
        } elseif (!empty($end_date)) {
            $query->where('day_off', '<=', $end_date);
        }
    }

    public function scopeFacilityFilter(Builder $query, $facility_id = null): void
    {
        if (!empty($facility_id)) {
            $query->whereHas('user', function ($query_user) use ($facility_id) {
                $query_user->where('facility_id', $facility_id);
            });
        }
    }

    /**
     * -------------- Relations -------------
     */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
