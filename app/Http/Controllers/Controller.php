<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Http;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    const PER_PAGE = 20;
    const FILE_PATH_ADMIN = 'file_storage/admin/';
    protected function getIdAsTimestamp(): int
    {
        return intval(date('ymdHis') . rand(1000, 9999));
    }
    protected function getListBanks(): array
    {
        $response_banks = Http::get(API_LIST_BAKING);
        if ($response_banks->successful()) {
            return (array)$response_banks->json()['data'];
        } else {
            session()->flash('error', 'Có lỗi khi lấy danh sách ngân hàng');
            return [];
        }
    }
    public function __construct()
    {
    }
}
