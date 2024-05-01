<?php

namespace App\Helpers;

class AppConstant
{
    const DELETED = 1;
    const NOT_DELETED = 0;
    const ACTIVE = 1;
    const IN_ACTIVE = 2;
    const FILE_TYPE_AVATAR = 15;
    const FILE_TYPE_UPLOAD = 16;

    public static function getIdAsTimestamp():int
    {
        return intval(date('ymdHis') . rand(10, 9999));
    }
}
