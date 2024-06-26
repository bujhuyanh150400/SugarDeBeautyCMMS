<?php

namespace Database\Seeders;

use App\Helpers\Helpers;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigSeed extends Seeder
{
    /**
     * php artisan db:seed --class=ConfigSeed
     */
    public function run(): void
    {
        DB::table('config_app')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'config_key' => 'API_LIST_BAKING',
            'config_value' => Helpers::encryptData('https://api.vietqr.io/v2/banks'),
            'description' => 'API_LIST_BAKING',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('config_app')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'config_key' => 'MONEY_FINE_PAY_FOR_GO_LATE',
            'config_value' => Helpers::encryptData(50000),
            'description' => 'MONEY_FINE_PAY_FOR_GO_LATE',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('config_app')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'config_key' => 'HOUR_JOB_PER_DAY',
            'config_value' => Helpers::encryptData(8),
            'description' => 'HOUR_JOB_PER_DAY',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('config_app')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'config_key' => 'MONEY_FINE_PAY_FOR_GO_OFF',
            'config_value' => Helpers::encryptData(300000),
            'description' => 'MONEY_FINE_PAY_FOR_GO_OFF',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('config_app')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'config_key' => 'PERCENT_BASE_SUPPORT_SALARY',
            'config_value' => Helpers::encryptData(10),
            'description' => 'PERCENT_BASE_SUPPORT_SALARY',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('config_app')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'config_key' => 'PERCENT_PAY_OVERTIME_SALARY',
            'config_value' => Helpers::encryptData(20),
            'description' => 'PERCENT_PAY_OVERTIME_SALARY',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
