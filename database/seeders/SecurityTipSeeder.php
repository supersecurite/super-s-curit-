<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;
use App\Support\SeedLexicalContent;
use Illuminate\Database\Seeder;
use RuntimeException;

class SecurityTipSeeder extends Seeder
{
    public function run(): void
    {
        $authorId = $this->resolveAuthorId();

        foreach ($this->securityTips() as $item) {
            $publishedAt = now()->subDays($item['published_days_ago']);
            $approvedAt = $publishedAt->copy()->subDay();

            SecurityTip::query()->updateOrCreate(
                ['title' => $item['title']],
                [
                    'status' => ArticleStatus::Published,
                    'excerpt' => $item['excerpt'],
                    'content' => SeedLexicalContent::fromParagraphs($item['content']),
                    'image' => $item['image'],
                    'category' => $item['category'],
                    'tags' => $item['tags'],
                    'featured' => $item['featured'],
                    'views' => $item['views'],
                    'published_at' => $publishedAt,
                    'submitted_at' => $approvedAt->copy()->subDay(),
                    'approved_at' => $approvedAt,
                    'created_by_id' => $authorId,
                    'approved_by_id' => $authorId,
                ],
            );
        }
    }

    private function resolveAuthorId(): int
    {
        $authorId = User::query()
            ->where('email', env('SEED_ADMIN_EMAIL', 'admin@supersecurite.com'))
            ->value('id');

        if ($authorId === null) {
            throw new RuntimeException('L\'utilisateur administrateur est requis avant d\'exécuter SecurityTipSeeder. Lancez RoleUserSeeder d\'abord.');
        }

        return $authorId;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function securityTips(): array
    {
        /** @var list<array<string, mixed>> $securityTips */
        $securityTips = require __DIR__.'/data/marketing-security-tips.php';

        return $securityTips;
    }
}
