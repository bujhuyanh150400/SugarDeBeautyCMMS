<?php

namespace App\Models;

use App\Helpers\Helpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rank extends Model
{
    use HasFactory;

    protected $table = 'ranks';
    protected $fillable = [
        'id',
        'title',
        'percent_rank',
        'description',
        'created_at',
        'updated_at',
    ];
    // Accessor decrypt
    public function getPercentRankAttribute($value): int
    {
        return Helpers::decryptData($value);
    }
    // Mutator encrypt
    public function setPercentRankAttribute($value): void
    {
        $this->attributes['percent_rank'] = Helpers::encryptData($value);
    }
    /**
    -------------- Relations -------------
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class,'rank_id');
    }
}
