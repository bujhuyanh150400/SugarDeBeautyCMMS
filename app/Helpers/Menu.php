<?php

namespace App\Helpers;

use App\Helpers\Constant\PermissionAdmin;
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
                    $this->setMenu('Lịch làm', 'CalendarIcon', '/time_attendance/manager/list' , 'time_attendance', [
                        $this->setChildMenu('Quản lý lịch làm', '/time_attendance/schedule/list' , 'schedule'),
                        $this->setChildMenu('Quản lý chấm công', '/time_attendance/manager/list' , 'manager'),
                    ]),
                    $this->setMenu('Quản lý nhân sự', 'PeoplesIcon', '/user/manager/list' , 'user' ,[
                        $this->setChildMenu('Quản lý nhân sự', '/user/manager/list' , 'manager'),
                        $this->setChildMenu('Quản lý cấp bậc', '/user/rank/list' , 'rank'),
                        $this->setChildMenu('Quản lý cơ sở', '/user/facilities/list' , 'facilities'),
                        $this->setChildMenu('Quản lý chuyên môn', '/user/specialties/list','specialties'),
                    ]),
                    $this->setMenu('Quản lý nghỉ phép', 'IdMappingIcon', '/dayoff/list' , 'dayoff'),
                    $this->setMenu('Thưởng/Phạt', 'RateIcon', '/payoff/list' , 'payoff'),
                    $this->setMenu('Quản lý lương', 'QrcodeIcon', '/salary/list' , 'salary'),
                    $this->setMenu('Quản lý đào tạo', 'PeoplesIcon', '/workflow/list' , 'education' ,[
                        $this->setChildMenu('Workflow', '/workflow/list' , 'workflow'),
                        $this->setChildMenu('Thư viện bài test', '/test_question/list' , 'test_question'),
                        $this->setChildMenu('Đào tạo', '/training_route/list','test'),
                    ]),
                    $this->setMenu('Config', 'GearIcon', '/config/list' , 'config'),
                ],
                PermissionAdmin::MANAGER => [
                    $this->setMenu('Trang chủ', 'DashboardIcon', '/dashboard' , 'dashboard'),
                    $this->setMenu('Quản lý nhân sự', 'PeoplesIcon', '/user/manager/list' , 'user'),
                    $this->setMenu('Quản lý lịch làm','CalendarIcon', '/time_attendance/schedule/manager_schedules/'.auth()->user()->facility_id , 'schedule'),
                    $this->setMenu('Quản lý nghỉ phép', 'IdMappingIcon', '/dayoff/list' , 'dayoff'),
                    $this->setMenu('Thưởng/Phạt', 'RateIcon', '/payoff/list' , 'payoff'),
                    $this->setMenu('Quản lý lương', 'QrcodeIcon', '/salary/list' , 'salary'),
                    $this->setMenu('Quản lý đào tạo', 'PeoplesIcon', '/workflow/list' , 'education' ,[
                        $this->setChildMenu('Workflow', '/workflow/list' , 'workflow'),
                        $this->setChildMenu('Thư viện bài test', '/test_question/list' , 'test_question'),
                        $this->setChildMenu('Đào tạo', '/training_route/list','test'),
                    ]),
                ],
                default => [],
            };
        }
    }
}

