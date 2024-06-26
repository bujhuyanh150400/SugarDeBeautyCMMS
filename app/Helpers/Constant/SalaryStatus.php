<?php

namespace App\Helpers\Constant;

class SalaryStatus
{
    const WAIT_CONFIRM = 15;
    const CONFIRM = 20;
    const DENIED = 25;
    static function getList(): array
    {
        return [
            self::WAIT_CONFIRM => [
                'value' => self::WAIT_CONFIRM,
                'text' => 'Chờ xác nhận lương'
            ],
            self::CONFIRM => [
                'value' => self::CONFIRM,
                'text' => 'Đã thanh toán'
            ],
            self::DENIED => [
                'value' => self::DENIED,
                'text' => 'Từ chối'
            ]
        ];
    }
}
