<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Menu
{
    /**
     * Function dùng để set menu
     * @param string $label
     * @param string $icon
     * @param string $href
     * @param string $active
     * @param array $children
     * @return array
     */
    private function setMenu(string $label = '', string $icon = '', string $href = '',string $active = '' , array $children = []): array
    {
        return [
            'key' => Str::uuid(),
            'label' => $label,
            'icon' => $icon,
            'href' => $href,
            'active' => $active,
            'children' => $children,
        ];
    }
    /** Function dùng để set menu con (trong menu cha)
     * @param string $label
     * @param string $href
     * @param string $active
     * @return array
     */
    private function setChildMenu(string $label = '', string $href = '', string $active = '',string $icon = ''): array
    {
        return [
            'key' => Str::uuid(),
            'label' => $label,
            'href' => $href,
            'active' => $active,
            'icon' => $icon,
        ];
    }
    public function getListByPermission(): array
    {
        if (!auth()->check()) {
            return [];
        } else {
            $permission = auth()->user()['permission'];
            return match ($permission) {
                PermissionAdmin::ADMIN => [
                    $this->setMenu('Trang chủ', 'DashboardIcon', '/dashboard' , 'dashboard'),
                    $this->setMenu('Quản lý nhân sự', 'PeoplesIcon', '/user/manager/list' , 'user' ,[
                        $this->setChildMenu('Quản lý nhân sự', '/user/manager/list' , 'manager'),
                        $this->setChildMenu('Quản lý cơ sở', '/user/facilities/list' , 'facilities'),
                        $this->setChildMenu('Quản lý chuyên môn', '/user/specialties/list','specialties'),
                    ]),
                ],
                default => [],
            };
        }
    }
}

