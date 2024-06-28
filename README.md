# Setting project

---

B1: copy .env.example sang 1 file .env

B2: Chạy lênh commant (nếu dùng laragon có thể chạy trên cmder có sẵn của laragon)
+  composer i
+  npm i 
+  php artisan key:generate (generate key)
+  php artisan migrate (migrating table)
+  php artisan db:seed (seed database)
+  php artisan db:seed --class=ConfigSeed
+  php artisan db:seed --class=SchedulesSeed

Run local : Mở 2 command và chạy lệnh (nếu laragon thì start server để chạy domain ảo) 
+ php artisan serve (if u dont run virtual domain)
+ npm run dev

---
#### Project core: Laravel 10 + Inertia 1.0 + ReactJS 18 + Redux toolkit + React Suite UI
#### database: MySQL
