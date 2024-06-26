<?php

namespace App\Models;

use App\Helpers\Helpers;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use HasFactory;


    protected $table = 'service';

    protected $fillable = ['id', 'specialties_id', 'title', 'money', 'percent','created_at','updated_at'];

    protected function Money(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
    protected function Percent(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
    /**
    -------------- Relations -------------
     */
    public function specialties(): BelongsTo
    {
        return $this->belongsTo(Specialties::class);
    }

    public function salary(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Salary::class)
            ->withPivot('total_service', 'money')
            ->withTimestamps();
    }

}
