<?php

namespace Database\Seeders;

use App\Helpers\Constant\ScheduleStatus;
use App\Models\Schedule;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use JetBrains\PhpStorm\NoReturn;

class SchedulesSeed extends Seeder
{
    /**
     * php artisan db:seed --class=SchedulesSeed
     */
    #[NoReturn] public function run(): void
    {

        $faker = Factory::create();
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();
        $daysInLastMonth = $startOfLastMonth->diffInDays($endOfLastMonth) + 1;
        $startOfThisMonth = Carbon::now()->startOfMonth();
        $endOfToday = Carbon::now();
        $daysInThisMonth = $startOfThisMonth->diffInDays($endOfToday) + 1;
        $users = User::with(['timeAttendance'])->get();
        $data = [];
        foreach ($users as $user) {
            // Giả lập dữ liệu cho tháng trước
            foreach (collect(range(0, $daysInLastMonth - 1)) as $day) {
                $date = $startOfLastMonth->copy()->addDays($day);
                $status = [ScheduleStatus::DONE, ScheduleStatus::LATE];
                $randomStatus = $status[array_rand($status)];
                if ($randomStatus === ScheduleStatus::DONE) {
                    $attendance_at = $date->copy()->setHour(8)->setMinute(1)->setSecond(0);
                } elseif ($randomStatus === ScheduleStatus::LATE) {
                    $attendance_at = $date->copy()->setHour(8)->setMinute(40)->setSecond(0);
                } else {
                    $attendance_at = null;
                }
                $data[] = [
                    'day_registered' => $date,
                    'start_time_registered' => $date->copy()->setHour(8)->setMinute(0)->setSecond(0),
                    'end_time_registered' => $date->copy()->setHour(16)->setMinute(0)->setSecond(0),
                    'type' => ScheduleStatus::TYPE_DAILY,
                    'status' => $randomStatus,
                    'note' => $faker->text,
                    'user_id' => $user->id,
                    'facility_id' => $user->facility_id,
                    'time_attendance_id' => $user->timeAttendance->id,
                    'attendance_at' => $attendance_at
                ];
            }
            // Giả lập dữ liệu từ đầu tháng này đến hiện tại
            foreach (collect(range(0, $daysInThisMonth - 2)) as $day) {
                $date = $startOfThisMonth->copy()->addDays($day);
                $status = [ScheduleStatus::DONE, ScheduleStatus::LATE];
                $randomStatus = $status[array_rand($status)];
                if ($randomStatus === ScheduleStatus::DONE) {
                    $attendance_at = $date->copy()->setHour(8)->setMinute(1)->setSecond(0);
                } elseif ($randomStatus === ScheduleStatus::LATE) {
                    $attendance_at = $date->copy()->setHour(8)->setMinute(40)->setSecond(0);
                } else {
                    $attendance_at = null;
                }
                $data[] = [
                    'day_registered' => $date,
                    'start_time_registered' => $date->copy()->setHour(8)->setMinute(0)->setSecond(0),
                    'end_time_registered' => $date->copy()->setHour(16)->setMinute(0)->setSecond(0),
                    'type' => ScheduleStatus::TYPE_DAILY,
                    'status' => $randomStatus,
                    'note' => $faker->text,
                    'user_id' => $user->id,
                    'facility_id' => $user->facility_id,
                    'time_attendance_id' => $user->timeAttendance->id,
                    'attendance_at' => $attendance_at
                ];
            }
        }
        DB::table('schedules')->insert($data);
    }
}
