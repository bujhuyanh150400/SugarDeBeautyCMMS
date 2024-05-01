<?php

namespace App\Http\Controllers;

use App\Helpers\AppConstant;
use App\Models\Facilities;
use App\Models\Specialties;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }


    public function list(): Response
    {
        $facilities = Facilities::KeywordFilter(request()->get('keyword') ?? '')
            ->ActiveFilter(request()->get('active') ?? '')
            ->with(['users' => function ($query) {
                $query->where('is_deleted', AppConstant::NOT_DELETED);
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        return Inertia::render('Facility/List', [
            'title' => "Danh sách cơ sở",
            'facilities' => fn() => $facilities,
            'query' => request()->query() ?: null,
        ]);
    }

    public function view_add(): Response
    {
        $title = "Thêm cơ sở mới";
        return Inertia::render('Facility/Add', [
            'title' => $title,
        ]);
    }
}
