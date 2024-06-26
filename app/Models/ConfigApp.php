<?php

namespace App\Models;

use App\Helpers\Helpers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfigApp extends Model
{
    use HasFactory;

    protected $table = 'config_app';
    protected $fillable = [
        'id',
        'config_key',
        'config_value',
        'description',
        'created_at',
        'updated_at',
    ];

    public function scopeKeywordFilter(Builder $query, string $config_key = null): void
    {
        if (!empty($config_key)) {
            $config_key = strtoupper($config_key);
            $query->whereRaw('UPPER(config_key) LIKE ?', '%' . $config_key . '%');
        }
    }

    public static function getConfigs(array $config_keys): array
    {
        $data = self::whereIn('config_key', $config_keys)->get();
        if (!$data->isEmpty()){
            return array_reduce($data->toArray(),function ($carry,$item){
                $carry[$item['config_key']] = $item['config_value'];
                return $carry;
            });
        }
        return [];
    }
    public static function getConfig(string $config_key): mixed
    {
        $data = self::where('config_key', $config_key)->first();
        if (!empty($data)){
            return $data->config_value;
        }
        return null;
    }


    protected function ConfigValue(): Attribute
    {
        return Helpers::handleCryptAttribute();
    }
}
