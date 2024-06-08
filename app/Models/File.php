<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $table = 'files';
    protected $fillable = [
        'id',
        'file_location',
        'file_type',
        'file_name',
        'file_real_name',
        'file_extension',
        'updated_at',
        'created_at',
    ];
    /**
    -------------- Relations -------------
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'file_user', 'file_id', 'user_id');
    }
}
