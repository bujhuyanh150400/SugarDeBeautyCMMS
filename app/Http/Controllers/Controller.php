<?php

namespace App\Http\Controllers;

use App\Models\ConfigApp;
use App\Models\User;
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
        $API_LIST_BANK = ConfigApp::getConfig('API_LIST_BAKING');
        $response_banks = Http::get($API_LIST_BANK);
        if ($response_banks->successful()) {
            return (array)$response_banks->json()['data'];
        } else {
            return [];
        }
    }

    protected function checkBankUser(User $user)
    {
        if (!empty($user->account_bank) && !empty($user->bin_bank) && !empty($user->account_bank_name)){
            $banks = $this->getListBanks();
            if (!empty($banks)){
                $bank_info = array_filter($banks,function ($item) use ($user) {
                    return $item['bin'] === $user->bin_bank;
                });
                $bank_info = reset($bank_info);
                $user_bank = $user->account_bank_name;
                $bank_account = $user->account_bank;
                return collect(compact('bank_info','user_bank','bank_account'));
            }
        }
        return collect();
    }

    public function __construct()
    {
    }
}
