<?php

namespace App\Models;

use App\Helpers\Constant\SalaryStatus;
use App\Helpers\Helpers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Salary extends Model
{
    use HasFactory;

    protected $table = 'salary';
    protected $fillable = [
        'id',
        'type',
        'money',
        'payoff_at',
        'total_salary',
        'total_workday_money',
        'service_money',
        'description',
        'description_bank',
        'created_at',
        'updated_at',
        'status',
        'user_id',
        'created_by'
    ];

    protected function TotalSalary(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
    protected function TotalWorkdayMoney(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
    protected function Status(): Attribute
    {
        return Attribute::make(
            get: fn (int $value) => SalaryStatus::getList()[$value] ?? null,
        );
    }
    protected function ServiceMoney(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
    public function scopeStatusFilter(Builder $query, $status = null): void
    {
        if (!empty($status)) {
            $query->where('status', $status);
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
    public function scopeDayPayFilter(Builder $query, $start_date = null, $end_date = null): void
    {
        if (!empty($start_date) && !empty($end_date)) {
            $query->whereBetween('day_pay', [$start_date, $end_date]);
        } elseif (!empty($start_date)) {
            $query->where('day_pay', '>=', $start_date);
        } elseif (!empty($end_date)) {
            $query->where('day_pay', '<=', $end_date);
        }
    }
    public function scopeCreatedAtFilter(Builder $query, $start_date = null, $end_date = null): void
    {
        if (!empty($start_date) && !empty($end_date)) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } elseif (!empty($start_date)) {
            $query->where('created_at', '>=', $start_date);
        } elseif (!empty($end_date)) {
            $query->where('created_at', '<=', $end_date);
        }
    }
    /**
    -------------- Relations -------------
     */
    public function services(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Service::class)->withPivot('total_service', 'money')->withTimestamps();
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
