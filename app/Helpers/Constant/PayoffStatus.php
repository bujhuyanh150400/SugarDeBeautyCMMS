<?php

namespace App\Helpers\Constant;

class PayoffStatus
{
    const IS_REWARD = 15;
    const IS_PUNISH = 20;
    static function getList(): array
    {
        return [
            self::IS_REWARD => [
                'value' => self::IS_REWARD,
                'text' => 'Thưởng'
            ],
            self::IS_PUNISH => [
                'value' => self::IS_PUNISH,
                'text' => 'Phạt'
            ],
        ];
    }
}
