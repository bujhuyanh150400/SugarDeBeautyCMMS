<?php

namespace App\Models;

use App\Helpers\Helpers;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimeAttendance extends Model
{
    use HasFactory;

    protected $table = 'time_attendances';
    protected $fillable = [
        'id',
        'pin',
        'short_url',
        'expires_at',
        'user_id',
        'updated_at',
        'created_at',
    ];
    protected function Pin(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
    /**
     * -------------- Relations -------------
     */
    public function user(): belongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
}
