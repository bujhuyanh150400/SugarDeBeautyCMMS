<?php

namespace App\Console\Commands;

use App\Helpers\Constant\ScheduleStatus;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TimeAttendanceSchedules extends Command
{
    protected $signature = 'app:time-attendance-schedules';

    protected $description = 'Job check cham cong';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('--Tiến hành chạy job');
        Log::info('Kiểm tra đi làm muộn');
        $schedules = Schedule::where('status',ScheduleStatus::WAIT)->get();
        if (!$schedules->isEmpty()){
            Log::info('Có lịch làm đang chờ chấm công, tiến hành tính toán');
            foreach ($schedules as $schedule) {
                $user = $schedule->users;
                $expiresAt = Carbon::parse($user->timeAttendance->expires_at);
                $currentTime = Carbon::now();
                $expiresAtTime = $expiresAt->format('H:i:s');
                list($hours, $minutes, $seconds) = explode(':', $expiresAtTime);
                $start_time_registered = Carbon::parse($schedule->start_time_registered);
                $expiresAtTimeAdd = $start_time_registered->copy()->addHour($hours)->addMinute($minutes)->addSecond($seconds);
                if ($currentTime->format('H:i:s') > $expiresAtTimeAdd->format('H:i:s')) {
                    $schedule->status = ScheduleStatus::LATE;
                    $schedule->save();
                    Log::warning("User ID: {$user->id} đã đi làm muộn. Cập nhật status đi muộn");
                }else{
                    Log::info("User ID: {$user->id} chưa đi làm muộn");
                }
            }
        }else{
            Log::info('Không có lịch làm chờ chấm công');
        }

        // Tính toán bỏ ca
        Log::info('Kiểm tra bỏ làm');
        $schedules_quit = Schedule::where('attendance_at',null)->where('status',ScheduleStatus::LATE)->get();
        if (!$schedules_quit->isEmpty()) {
            foreach ($schedules_quit as $schedule) {
                $user = $schedule->users;
                $currentTime = Carbon::now();
                $start_time_registered = Carbon::parse($schedule->start_time_registered);
                $quit_time = $start_time_registered->copy()->addHour();
                if ($currentTime > $quit_time) {
                    $schedule->status = ScheduleStatus::CANCEL;
                    $schedule->save();
                    Log::warning("User ID: {$user->id} đã không chấm công lúc trong vòng 1 tiếng. Cập nhật status bỏ làm");
                }else{
                    Log::info("User ID: {$user->id} chưa bỏ làm");
                }
            }
        }
    }
}
