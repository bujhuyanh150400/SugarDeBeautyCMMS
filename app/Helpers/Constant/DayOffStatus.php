<?php

namespace App\Helpers\Constant;

class DayOffStatus
{
    const ACTIVE = 15;
    const DENIED = 20;
    const WAIT = 25;
    static function getList(): array
    {
        return [
            self::ACTIVE => [
                'value' => self::ACTIVE,
                'text' => 'Đồng ý nghỉ phép'
            ],
            self::DENIED => [
                'value' => self::DENIED,
                'text' => 'Từ chối nghỉ phép'
            ],
            self::WAIT => [
                'value' => self::WAIT,
                'text' => 'Chờ duyệt đơn'
            ]
        ];
    }
}
