<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            if ($request->route()->getName() === 'view_login') {
                return redirect()->route('dashboard');
            }
        } else {
            if ($request->route()->getName() !== 'view_login' && $request->method() !== 'POST') {
                return redirect()->route('view_login');
            }
        }
        return $next($request);
    }
}
