<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Synchronise les vidéos galerie depuis database/seeders/data/gallery-videos.php
 * sans vider la base (updateOrCreate + dépublication des entrées obsolètes).
 *
 * Usage : php artisan db:seed --class=SyncGalleryVideosSeeder
 */
class SyncGalleryVideosSeeder extends Seeder
{
    public function run(): void
    {
        GalleryVideoSeeder::sync();
    }
}
