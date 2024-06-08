<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Scopes\NotDeletedScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'id',
        'email',
        'name',
        'password',
        'address',
        'permission',
        'phone',
        'birth',
        'gender',
        'created_by',
        'updated_by',
        'avatar',
        'facility_id',
        'specialties_id',
        'time_attendance_id'
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'password' => 'hashed',
    ];
    protected static function booted(): void
    {
        static::addGlobalScope(new NotDeletedScope);
    }

    public function scopeKeywordFilter(Builder $query, $keyword = null): void
    {
        if (!empty($keyword)) {
            $keyword = strtolower($keyword);
            $query->whereRaw('LOWER(email) LIKE ?', '%' . $keyword . '%')
                ->orWhereRaw('LOWER(name) LIKE ?', '%' . $keyword . '%')
                ->orWhere('id', '=', intval($keyword));
        }
    }
    public function scopePermissionFilter(Builder $query, $permission = null): void
    {
        if (!empty($permission)) {
            $query->where('permission', $permission);
        }
    }
    public function scopeFacilityFilter(Builder $query, $facility_id = null): void
    {
        if (!empty($facility_id)) {
            $query->where('facility_id', $facility_id);
        }
    }

    /**
        -------------- Relations -------------
     */

    public function facility(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Facilities::class);
    }
    public function specialties(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Specialties::class);
    }
    public function rank(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Rank::class, 'rank_id');
    }
    public function files(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(File::class, 'file_user', 'user_id', 'file_id');
    }
    public function timeAttendance(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->HasOne(TimeAttendance::class);
    }
    public function schedules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Schedule::class);
    }
    public function dayoff(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DayOff::class);
    }
}
