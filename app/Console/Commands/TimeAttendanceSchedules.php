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
        Log::info('Tiến hành chạy job');
        $schedules = Schedule::where('status',ScheduleStatus::WAIT)->get();
        if (!$schedules->isEmpty()){
            Log::info('Tiến hành chạy job');
            $schedules = Schedule::where('status',ScheduleStatus::WAIT)->get();
            foreach ($schedules as $schedule) {
                $user = $schedule->users;
                $expiresAt = Carbon::parse($user->timeAttendance->expires_at);
                $currentTime = Carbon::now();
                if ($currentTime->format('H:i:s') > $expiresAt->format('H:i:s')) {
                    $schedule->status = ScheduleStatus::LATE;
                    $schedule->save();
                    Log::info("User ID: {$user->id} đã đi làm muộn. Cập nhật status đi muộn");
                }
            }
        }else{
            Log::info('Không có lịch làm chờ chấm công');
        }
    }
}
