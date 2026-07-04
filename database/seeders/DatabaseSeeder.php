<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleUserSeeder::class,
            ArticleSeeder::class,
            SecurityTipSeeder::class,
            GalleryImageSeeder::class,
            GalleryVideoSeeder::class,
            PartnerSeeder::class,
        ]);
    }
}
