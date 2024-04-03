<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    public function index() {
        return Inertia::render('Dashboard',[]);
    }
}
