<?php

namespace App\Models;

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
        'user_id',
        'time_attendance_id',
        'updated_at',
        'created_at',
    ];

    /**
    -------------- Relations -------------
     */

    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
