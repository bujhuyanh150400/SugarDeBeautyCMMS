<?php

namespace App\Http\Controllers;

use App\Helpers\AppConstant;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
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
    public static function saveFile($file, $type = AppConstant::FILE_TYPE_UPLOAD):array
    {
        $extension = $file->extension();
        $file_real_name = $file->getClientOriginalName();
        $file_name = AppConstant::getIdAsTimestamp() . '.' . $extension;
        $path = $file->storeAs(self::FILE_PATH_ADMIN, $file_name);
        return [
            'id' => AppConstant::getIdAsTimestamp(),
            'file_location' => base64_encode($path),
            'file_type' => $type,
            'file_name' => $file_name,
            'file_real_name' => $file_real_name,
            'file_extension' => $extension,
        ];
    }

}
