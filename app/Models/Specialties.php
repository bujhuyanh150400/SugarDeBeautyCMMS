<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialties extends Model
{
    use HasFactory;

    protected $table = 'specialties';

    protected $fillable = [
        'id',
        'name',
        'description',
        'active',
        'updated_at',
        'created_at',
    ];

    /**
    -------------- Relations -------------
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class);
    }
}
