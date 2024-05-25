<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Helpers\PermissionAdmin;
use App\Models\Facilities;
use App\Models\Specialties;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory;
class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        $faker = Factory::create();
        // facilities
        DB::table('facilities')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Cơ sở 1',
            'address' => 'Số 71, Phạm Tuấn Tài',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('facilities')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Cơ sở 2',
            'address' => 'Số 52, Cầu Giấy',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Specialties
        DB::table('facilities')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Cơ sở 3',
            'address' => 'Số 8, Hồ Đắc Di',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Specialties
        DB::table('specialties')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Spa',
            'description' => '<p><strong>Spa </strong>Dịch vụ chăm sóc sức da, mát xa thư dãn</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('specialties')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Waxing',
            'description' => '<p><strong>Waxing </strong>Dịch vụ wax lông, triệt lông</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('specialties')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Mi - mắt',
            'description' => '<p><strong>Mi - mắt </strong>Dịch vụ nối mi , làm my , định hình lông mày</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('specialties')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Nails',
            'description' => '<p><strong>Nails </strong>Dịch vụ làm nails</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('specialties')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'name' => 'Tóc',
            'description' => '<p><strong>Tóc </strong>Dịch vụ làm tóc, cắt tóc, nhuộm, tạo kiểu</p>',
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
            'facility_id' => Facilities::inRandomOrder()->first()->id,
            'specialties_id' => Specialties::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
            'remember_token' => null,
        ]);
        DB::table('time_attendances')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'pin' => random_int(100000, 999999),
            'short_url' => Str::random(10),
            'expires_at' => Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute(5)->second(0)->toDateTimeString(),
            'user_id' => 15042000,
        ]);
        $randomKey = array_rand(PermissionAdmin::getList());
        for ($i = 0; $i < 10; $i++) {
            $data_user = [
                'id' => intval(date('ymdHis') . rand(1000, 9999)),
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
            ];
            DB::table('users')->insert($data_user);
            DB::table('time_attendances')->insert([
                'id' => intval(date('ymdHis') . rand(1000, 9999)),
                'pin' => random_int(10000, 99999),
                'short_url' => Str::random(10),
                'expires_at' => Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute(5)->second(0)->toDateTimeString(),
                'user_id' => $data_user['id'],
            ]);
        }
    }
}
