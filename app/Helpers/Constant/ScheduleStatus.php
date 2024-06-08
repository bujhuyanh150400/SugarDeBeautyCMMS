<?php

namespace App\Helpers\Constant;

class ScheduleStatus
{
    const DONE = 15;
    const LATE = 20;
    const CANCEL = 25;
    const WAIT = 30;

    static function getList(): array
    {
        return [
            self::DONE => [
                'value' => self::DONE,
                'text' => 'Đã chấm công',
                'color' => 'blue'
            ],
            self::LATE => [
                'value' => self::LATE,
                'text' => 'Chấm công muộn',
                'color' => 'orange'
            ],
            self::CANCEL => [
                'value' => self::CANCEL,
                'text' => 'Chưa chấm công',
                'color' => 'red'
            ],
            self::WAIT => [
                'value' => self::WAIT,
                'text' => 'Chờ chấm công',
                'color' => 'cyan'
            ],
        ];
    }

    static function getConstants(): array
    {
        return [
            'DONE' => self::DONE,
            'LATE' => self::LATE,
            'CANCEL' => self::CANCEL,
            'WAIT' => self::WAIT,
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

    const TYPE_DAILY = 20;
    const TYPE_OVERTIME = 25;
    const TYPE_SUPPORTED = 30;

    static function getListType(): array
    {
        return [
            self::TYPE_DAILY => [
                'value' => self::TYPE_DAILY,
                'text' => 'Lịch làm thường',
                'color' => 'blue'
            ],
            self::TYPE_OVERTIME => [
                'value' => self::TYPE_OVERTIME,
                'text' => 'Tăng ca',
                'color' => 'orange'
            ],
            self::TYPE_SUPPORTED => [
                'value' => self::TYPE_SUPPORTED,
                'text' => 'Hỗ trợ cơ sở',
                'color' => 'red'
            ],
        ];
    }
}
