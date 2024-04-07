<?php

namespace App\Helpers;

class PermissionAdmin
{
    const ADMIN = 16;
    const MANAGER = 18;
    const EMPLOYEE = 20;
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
        ];
    }
}
