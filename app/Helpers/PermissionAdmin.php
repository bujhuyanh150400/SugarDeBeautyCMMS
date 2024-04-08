<?php

namespace App\Helpers;

class PermissionAdmin
{
    const ADMIN = 16;
    const MANAGER = 18;
    const EMPLOYEE = 20;
    const CASHIER = 22;
    static function getList()
    {
        return [
            self::ADMIN => [
                'value' => self::ADMIN,
                'text' => 'Điều hành hệ thống'
            ],
            self::MANAGER => [
                'value' => self::MANAGER,
                'text' => 'Quản lý cơ sở'
            ],
            self::EMPLOYEE => [
                'value' => self::EMPLOYEE,
                'text' => 'Kỹ thuật viên'
            ],
            self::CASHIER => [
                'value' => self::CASHIER,
                'text' => 'Thu ngân'
            ],
        ];
    }
}
