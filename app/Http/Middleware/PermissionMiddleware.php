<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;
class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next , string $action): Response
    {
        $can_access = true;
        switch ($action){
            case 'allow_admin':
            case 'allow_manager':
                if (!Gate::allows($action)){
                    $can_access = false;
                    break;
                }

        }





        if ($can_access === true){
            return $next($request);
        }else{
            session()->flash('error', 'Bạn không có quyền truy cập');
            return redirect()->route('dashboard');
        }
    }
}
