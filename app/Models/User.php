<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Helpers\Helpers;
use App\Models\Scopes\NotDeletedScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'time_attendance_id',
        'bin_bank',
        'account_bank',
        'account_bank_name',
        'salary_per_month',
        'number_of_day_offs',
        'rank_id'
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'password' => 'hashed',
    ];

    protected function SalaryPerMonth(): Attribute
    {
        return Helpers::handleCryptAttribute();

    }

    protected function AccountBankName(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }

    protected function AccountBank(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }

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
                ->orWhereRaw('LOWER(phone) LIKE ?', '%' . $keyword . '%')
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
     * -------------- Relations -------------
     */

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facilities::class);
    }

    public function specialties(): BelongsTo
    {
        return $this->belongsTo(Specialties::class);
    }

    public function rank(): BelongsTo
    {
        return $this->belongsTo(Rank::class, 'rank_id');
    }

    public function files(): BelongsToMany
    {
        return $this->belongsToMany(File::class, 'file_user', 'user_id', 'file_id');
    }

    public function timeAttendance(): HasOne
    {
        return $this->HasOne(TimeAttendance::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function dayoff(): HasMany
    {
        return $this->hasMany(DayOff::class);
    }

    public function salary(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    public function trainingRoutes(): BelongsToMany
    {
        return $this->belongsToMany(TrainingRoute::class, 'training_route_user')
            ->withPivot('score', 'time_did', 'time_start', 'results')
            ->withTimestamps();
    }
}
