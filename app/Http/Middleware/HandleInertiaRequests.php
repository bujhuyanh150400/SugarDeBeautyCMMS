<?php

namespace App\Http\Middleware;

use App\Helpers\PermissionAdmin;
use App\Helpers\ScheduleStatus;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Helpers\Menu;

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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
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
