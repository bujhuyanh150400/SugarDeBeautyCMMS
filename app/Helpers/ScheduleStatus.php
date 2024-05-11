<?php

namespace App\Helpers;

class ScheduleStatus
{
    const DONE = 15;
    const LATE = 20;
    const CANCEL = 25;
    static function getList(): array
    {
        return [
            self::DONE => [
                'value' => self::DONE,
                'text' => 'Đã chấm công'
            ],
            self::LATE => [
                'value' => self::LATE,
                'text' => 'Chấm công muộn'
            ],
            self::CANCEL => [
                'value' => self::CANCEL,
                'text' => 'Chưa chấm công'
            ]
        ];
    }

    const ACCEPTED = 16;
    const UNACCEPTED = 12;
    static function getListAccepted(): array
    {
        return [
            self::ACCEPTED => [
                'value' => self::ACCEPTED,
                'text' => 'Duyệt chấm công'
            ],
            self::UNACCEPTED => [
                'value' => self::UNACCEPTED,
                'text' => 'Không phê duyệt'
            ],
        ];
    }
}
