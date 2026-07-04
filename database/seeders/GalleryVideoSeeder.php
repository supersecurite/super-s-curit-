<?php

namespace Database\Seeders;

use App\Models\GalleryVideo;
use Illuminate\Database\Seeder;

class GalleryVideoSeeder extends Seeder
{
    public function run(): void
    {
        self::sync();
    }

    public static function sync(): void
    {
        /** @var list<array<string, mixed>> $videos */
        $videos = require __DIR__.'/data/gallery-videos.php';

        $sortOrders = [];

        foreach ($videos as $video) {
            $sortOrders[] = $video['sort_order'];

            GalleryVideo::query()->updateOrCreate(
                ['sort_order' => $video['sort_order']],
                [
                    'service_id' => $video['service_id'],
                    'youtube_url' => $video['youtube_url'],
                    'title' => $video['title'],
                    'description' => $video['description'] ?? null,
                    'is_published' => true,
                ],
            );
        }

        GalleryVideo::query()
            ->whereNotIn('sort_order', $sortOrders)
            ->update(['is_published' => false]);
    }
}
