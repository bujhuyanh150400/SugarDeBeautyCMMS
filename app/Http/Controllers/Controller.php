<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    const PER_PAGE = 20;
    const FILE_PATH_ADMIN = 'file_storage/admin/';
    protected function getIdAsTimestamp(): int
    {
        return intval(date('ymdHis') . rand(1000, 9999));
    }

    public function __construct()
    {
    }
}
