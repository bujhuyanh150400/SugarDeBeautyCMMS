<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Helpers\Constant\PermissionAdmin;
use App\Helpers\Helpers;
use App\Models\Facilities;
use App\Models\Specialties;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{

    /**
     * @throws \Exception
     */
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
        // Specialties - service
        DB::table('specialties')->insert([
            'id' => 2406062246244712,
            'name' => 'Spa',
            'description' => '<p><strong>Spa </strong>Dịch vụ chăm sóc sức da, mát xa thư dãn</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Chăm sóc da mặt',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(300000),
            'specialties_id' => 2406062246244712,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Chăm sóc da mặt mụn',
            'percent' => Helpers::encryptData(12),
            'money' => Helpers::encryptData(400000),
            'specialties_id' => 2406062246244712,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Tẩy da chết',
            'percent' => Helpers::encryptData(8),
            'money' => Helpers::encryptData(800000),
            'specialties_id' => 2406062246244712,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        DB::table('specialties')->insert([
            'id' => 2406062246316199,
            'name' => 'Waxing',
            'description' => '<p><strong>Waxing </strong>Dịch vụ wax lông, triệt lông</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Wax bikini',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(300000),
            'specialties_id' => 2406062246316199,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Wax tay',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(200000),
            'specialties_id' => 2406062246316199,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Wax chân',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(300000),
            'specialties_id' => 2406062246316199,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Wax body',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(800000),
            'specialties_id' => 2406062246316199,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Triệt bikini',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(600000),
            'specialties_id' => 2406062246316199,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Triệt bảo hành',
            'percent' => Helpers::encryptData(5),
            'money' => Helpers::encryptData(800000),
            'specialties_id' => 2406062246316199,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('specialties')->insert([
            'id' => 2406062247141765,
            'name' => 'Mi - mắt',
            'description' => '<p><strong>Mi - mắt </strong>Dịch vụ nối mi , làm my , định hình lông mày</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Làm mi',
            'percent' => Helpers::encryptData(12),
            'money' => Helpers::encryptData(200000),
            'specialties_id' => 2406062247141765,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Làm đẹp mắt',
            'percent' => Helpers::encryptData(5),
            'money' => Helpers::encryptData(1000000),
            'specialties_id' => 2406062247141765,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Chuốt mascara',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(200000),
            'specialties_id' => 2406062247141765,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('specialties')->insert([
            'id' => 2406062247215507,
            'name' => 'Nails',
            'description' => '<p><strong>Nails </strong>Dịch vụ làm nails</p>',
            'active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Làm nail',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(500000),
            'specialties_id' => 2406062247215507,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Nối móng',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(500000),
            'specialties_id' => 2406062247215507,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('service')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'title' => 'Định hình móng',
            'percent' => Helpers::encryptData(10),
            'money' => Helpers::encryptData(500000),
            'specialties_id' => 2406062247215507,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // Ranks
        DB::table('ranks')->insert([
            'id' => 2406052325357445,
            'title' => 'Thử việc',
            'percent_rank' => Helpers::encryptData(85),
            'description' => '<p>Nhân viên thử việc</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('ranks')->insert([
            'id' => 2406052325224804,
            'title' => 'Chính thức',
            'percent_rank' => Helpers::encryptData(100),
            'description' => '<p>Nhân viên thử việc</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('ranks')->insert([
            'id' => 2406052325448688,
            'title' => 'Tăng bậc 1',
            'percent_rank' => Helpers::encryptData(125),
            'description' => '<p>Tăng bậc 1</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('ranks')->insert([
            'id' => 2406052325551127,
            'title' => 'Tăng bậc 2',
            'percent_rank' => Helpers::encryptData(150),
            'description' => '<p>Tăng bậc 2</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('ranks')->insert([
            'id' => 2406052326035287,
            'title' => 'Tăng bậc 3',
            'percent_rank' => Helpers::encryptData(175),
            'description' => '<p>Tăng bậc 3</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('ranks')->insert([
            'id' => 2406052326091478,
            'title' => 'Tăng bậc 4',
            'percent_rank' => Helpers::encryptData(200),
            'description' => '<p>Tăng bậc 4</p>',
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
            'rank_id' => 2406052325224804,
            'salary_per_month' => Helpers::encryptData(200000000),
            'phone' => $faker->e164PhoneNumber,
            'permission' => 16,
            'facility_id' => Facilities::inRandomOrder()->first()->id,
            'specialties_id' => Specialties::inRandomOrder()->first()->id,
            'number_of_day_offs' => 4,
            'created_at' => now(),
            'updated_at' => now(),
            'remember_token' => null,
        ]);
        DB::table('time_attendances')->insert([
            'id' => intval(date('ymdHis') . rand(1000, 9999)),
            'pin' => Helpers::encryptData(random_int(10000, 99999)),
            'short_url' => Str::random(10),
            'expires_at' => Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute(5)->second(0)->toDateTimeString(),
            'user_id' => 15042000,
        ]);
        for ($i = 0; $i < 50; $i++) {
            $randomKey = array_rand(PermissionAdmin::getList());
            $data_user = [
                'id' => intval(date('ymdHis') . rand(1000, 9999)),
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('123456789'),
                'birth' => $faker->date,
                'address' => $faker->address,
                'gender' => rand(1, 2),
                'salary_per_month' => Helpers::encryptData(rand(1, 9) * 1000000),
                'rank_id' => 2406052325224804,
                'phone' => $faker->e164PhoneNumber,
                'permission' => PermissionAdmin::getList()[$randomKey]['value'],
                'facility_id' => Facilities::inRandomOrder()->first()->id,
                'specialties_id' => Specialties::inRandomOrder()->first()->id,
                'number_of_day_offs' => 4,
                'created_at' => now(),
                'updated_at' => now(),
                'remember_token' => null,
            ];
            DB::table('users')->insert($data_user);
            DB::table('time_attendances')->insert([
                'id' => intval(date('ymdHis') . rand(1000, 9999)),
                'pin' => Helpers::encryptData(random_int(10000, 99999)),
                'short_url' => Str::random(10),
                'expires_at' => Carbon::now()->setYear(2000)->setMonth(1)->setDay(1)->setHour(0)->minute(5)->second(0)->toDateTimeString(),
                'user_id' => $data_user['id'],
            ]);
        }
    }
}
