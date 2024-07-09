<?php

namespace App\Helpers;

use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Helpers
{
    // Tạm thời fix tạm
    private static string $SECRET_STRING_ASC = '$2y$07$vGA1o9FmCKrwvGA1o9CKrw$';
    // Sử dụng thuật toán mã hoá aes-128-cbc
    public static function encryptData(mixed $value): string
    {
        if (!strlen(trim($value))) {
            return '';
        }
        $init_vector = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-128-cbc'));
        $encrypted = openssl_encrypt($value, 'aes-128-cbc', self::AesKey(), OPENSSL_RAW_DATA, $init_vector);
        return strtoupper(bin2hex($init_vector . $encrypted));
    }
    public static function decryptData(string $encrypted): string
    {
        $data = hex2bin($encrypted);
        $init_vector_length = openssl_cipher_iv_length('aes-128-cbc');
        $init_vector = substr($data, 0, $init_vector_length);
        $encrypted_data = substr($data, $init_vector_length);
        return openssl_decrypt($encrypted_data, 'aes-128-cbc', self::AesKey(), OPENSSL_RAW_DATA, $init_vector);
    }

    /**
     * @throws Exception
     */
    private static function AesKey(): string
    {
//        $SECRET_STRING_ASC = env('SECRET_STRING_AES');
        $SECRET_STRING_ASC = self::$SECRET_STRING_ASC;
        if (empty($SECRET_STRING_ASC)){
            throw new Exception('Cant turn on this app, sorry');
        }
        $new_key = str_repeat(chr(0), 16);
        for ($i = 0, $len = strlen($SECRET_STRING_ASC); $i < $len; $i++) {
            $new_key[$i % 16] = $new_key[$i % 16] ^ $SECRET_STRING_ASC[$i];
        }
        return $new_key;
    }

    public static function handleCryptAttribute(): Attribute
    {
        return Attribute::make(
            get: fn (string|null $value) => !empty($value) ? Helpers::decryptData($value) : '',
            set: fn (string|null $value) => !empty($value) ? Helpers::encryptData($value) : '',
        );
    }


}
