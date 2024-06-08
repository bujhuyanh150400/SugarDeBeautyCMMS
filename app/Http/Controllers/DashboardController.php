<?php

namespace App\Http\Controllers;

use App\Helpers\Helpers;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(): \Inertia\Response
    {
        return Inertia::render('Dashboard', [
            'title' => 'Trang chủ'
        ]);
    }
}
