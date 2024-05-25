<?php

namespace App\Models;

use App\Models\Scopes\NotDeletedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedules';
    protected $fillable = [
        'id',
        'day_registered',
        'start_time_registered',
        'end_time_registered',
        'type',
        'status',
        'note',
        'user_id',
        'facility_id',
        'time_attendance_id',
        'updated_at',
        'created_at',
        'is_deleted',
    ];
    protected static function booted(): void
    {
        static::addGlobalScope(new NotDeletedScope);
    }
    /**
    -------------- Relations -------------
     */

    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }
    public function facility(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Facilities::class,'facility_id');
    }
}
