<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;
class Handler extends ExceptionHandler
{

    public function render($request, Throwable $e): \Illuminate\Http\Response|\Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response|\Illuminate\Http\RedirectResponse
    {
        $response = parent::render($request,$e);
//        if (in_array($response->status(),[404,403])){
//            switch ($response->status()){
//                case 404:
//                    session()->flash('error', 'Trang không tìm thấy');
//                    break;
//                case 403:
//                    session()->flash('error', 'Forbidden');
//                    break;
//            }
//            return redirect()->route('dashboard');
//        }
        return $response;
    }


    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
