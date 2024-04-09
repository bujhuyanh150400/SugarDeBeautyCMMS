<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Menu
{
    /**
     * Function dùng để set menu đơn
     * @param $label
     * @param $icon
     * @param $href
     * @param $children
     * @param $disabled
     * @return array
     */
    private function setMenu($label = '', $icon = '', $href = '', $children = [], $disabled = false): array
    {
        return [
            'key' => Str::uuid(),
            'is_sub' => false,
            'label' => $label,
            'icon' => $icon,
            'href' => $href,
            'children' => $children,
            'disabled' => $disabled,
        ];
    }

    /** Function dùng để set Menu cha
     * @param $label
     * @param $icon
     * @param $children
     * @param $disabled
     * @return array
     */
    private function setSubMenu($label = '', $icon = '', $children = [], $disabled = false): array
    {
        return [
            'key' => Str::uuid(),
            'is_sub' => true,
            'label' => $label,
            'icon' => $icon,
            'children' => $children,
            'disabled' => $disabled,
        ];
    }

    /** Function dùng để set menu con (trong menu cha)
     * @param $label
     * @param $href
     * @return array
     */
    private function setChildMenu($label = '', $href = ''): array
    {
        return [
            'key' => Str::uuid(),
            'label' => $label,
            'href' => $href,
        ];
    }

    public function getListByPermission(): array
    {
        if (!auth()->check()) {
            return [];
        } else {
            $permission = auth()->user()['permission'];
            return  match ($permission) {
                PermissionAdmin::ADMIN => [
                    $this->setMenu('Trang chủ', 'DashboardOutlined', ''),
                    $this->setSubMenu('Quản lý nhân viên', 'UserOutlined', [
                        $this->setChildMenu('Quản lý nhân sự', 'user/list'),
                        $this->setChildMenu('Quản lý cơ sở', 'facilities/list'),
                        $this->setChildMenu('Quản lý chuyên môn', 'specialties/list'),
                    ]),
                ],
                default => [],
            };
        }
    }
}

