<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function showFile($filepath)
    {
        $filepath = base64_decode($filepath);
        // Kiểm tra sự tồn tại của file
        if (Storage::exists($filepath)) {
            $extension = pathinfo($filepath, PATHINFO_EXTENSION);
            $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
            if (in_array(strtolower($extension), $imageExtensions)) {
                return response()->file(Storage::path($filepath));
            } else {
                return response()->download(Storage::path($filepath));
            }
        } else {
            abort(404, 'File not found');
        }
    }
}
