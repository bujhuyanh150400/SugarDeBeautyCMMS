<?php

namespace App\Http\Middleware;

use App\Helpers\PermissionAdmin;
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
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info')
            ]
        ];
    }
}
