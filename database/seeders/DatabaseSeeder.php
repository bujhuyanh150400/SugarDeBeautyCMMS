<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Helpers\PermissionAdmin;
use App\Models\Facilities;
use App\Models\Specialties;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory;
class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        $faker = Factory::create();
        DB::table('facilities')->insert([
            'id' => 24021008224354,
            'name' => 'Cơ sở 1',
            'address' => 'Số 71, Phạm Tuấn Tài',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('facilities')->insert([
            'id' => 24021008224642,
            'name' => 'Cơ sở 2',
            'address' => 'Số 52, Cầu Giấy',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Specialties
        DB::table('facilities')->insert([
            'id' => 24021016293164,
            'name' => 'Cơ sở 3',
            'address' => 'Số 8, Hồ Đắc Di',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Specialties
        DB::table('specialties')->insert([
            'id' => 24021016322362,
            'name' => 'Spa',
            'description' => '<p><strong>Spa </strong>Dịch vụ chăm sóc sức khỏe</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Users
        DB::table('users')->insert([
            'id' => 15042000,
            'name' => 'Bùi Huy Anh',
            'email' => 'bujhuyanh150400@gmail.com',
            'password' => Hash::make('su30mk2v'),
            'birth' => '2000-04-15 00:00:00',
            'address' => 'Hà Nội',
            'gender' => 1,
            'phone' => '0917095494',
            'permission' => 16,
            'facility_id' => 24021008224354,
            'specialties_id' => 24021016322362,
            'created_at' => now(),
            'updated_at' => now(),
            'remember_token' => null,
        ]);
        $randomKey = array_rand(PermissionAdmin::getList());
        for ($i = 0; $i < 10; $i++) {
            DB::table('users')->insert([
                'id' => intval(date('ymdHis') . rand(10, 9999)),
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('123456789'),
                'birth' => $faker->date,
                'address' => $faker->address,
                'gender' => rand(1,2),
                'phone' => $faker->e164PhoneNumber,
                'permission' => PermissionAdmin::getList()[$randomKey]['value'],
                'facility_id' => Facilities::inRandomOrder()->first()->id,
                'specialties_id' => Specialties::inRandomOrder()->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
                'remember_token' => null,
            ]);
        }
    }
}
