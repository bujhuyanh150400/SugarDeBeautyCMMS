<?php

namespace App\Http\Controllers;

use App\Helpers\AppConstant;
use App\Models\DayOff;
use App\Models\Facilities;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DayOffController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function list(Request $request): Response
    {
        $list_day_off = DayOff::KeywordFilter($request->get('keyword') ?? '')
            ->dayOffFilterBetween($request->get('start_date') ?? '', $request->get('end_date') ?? '')
            ->FacilityFilter($request->get('facility') ?? '')
            ->with(['user', 'user.facility', 'user.specialty'])
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE);
        $facilities = Facilities::where('active', AppConstant::ACTIVE)->get();
        return Inertia::render('DayOff/List', [
            'title' => "Quản lý xin nghỉ phép",
            'list_day_off' => fn() => $list_day_off,
            'query' => $request->query() ?: null,
            'facilities' => $facilities
        ]);
    }

}
