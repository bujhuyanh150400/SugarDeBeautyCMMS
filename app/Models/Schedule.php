<?php

namespace App\Models;

use App\Helpers\Constant\PayoffStatus;
use App\Helpers\Constant\ScheduleStatus;
use App\Models\Scopes\NotDeletedScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
    protected function Type(): Attribute
    {
        return Attribute::make(get: fn (int $value) => ScheduleStatus::getListType()[$value]);
    }

    protected function Status(): Attribute
    {
        return Attribute::make(get: fn (int $value) => ScheduleStatus::getList()[$value]);
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
    public function timeAttendance(): BelongsTo
    {
        return $this->BelongsTo(TimeAttendance::class);
    }
}
