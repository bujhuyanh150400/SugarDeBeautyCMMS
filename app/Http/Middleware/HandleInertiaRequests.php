<?php

namespace App\Http\Middleware;

use App\Helpers\Constant\PermissionAdmin;
use App\Helpers\Constant\ScheduleStatus;
use App\Helpers\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }
    public function share(Request $request): array
    {
        $menu = new Menu();
        $user = Auth::user();
        if ($user){
            $user->load('files');
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'permission' => PermissionAdmin::getList(),
                'menu' => $menu->getListByPermission(),
                'scheduleStatus' => ScheduleStatus::getList(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info')
            ]
        ];
    }
}
