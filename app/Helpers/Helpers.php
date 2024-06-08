<?php

namespace App\Helpers;

class Helpers
{
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
    private static function AesKey(): string
    {
        $new_key = str_repeat(chr(0), 16);
        for ($i = 0, $len = strlen(SECRET_STRING); $i < $len; $i++) {
            $new_key[$i % 16] = $new_key[$i % 16] ^ SECRET_STRING[$i];
        }
        return $new_key;
    }
}
