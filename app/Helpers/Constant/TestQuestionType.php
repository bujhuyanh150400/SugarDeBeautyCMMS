<?php

namespace App\Helpers\Constant;

class TestQuestionType
{
    const TYPE_CHECKBOX = 15;
    const TYPE_RADIO = 20;
    static function getList(): array
    {
        return [
            self::TYPE_CHECKBOX => [
                'value' => self::TYPE_CHECKBOX,
                'text' => 'Cho phép nhiều câu trả lời',
                'type' => 'checkbox',
            ],
            self::TYPE_RADIO => [
                'value' => self::TYPE_RADIO,
                'text' => 'Cho phép 1 câu trả lời',
                'type' => 'radio',
            ],
        ];
    }
}
