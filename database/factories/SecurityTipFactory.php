<?php

namespace Database\Factories;

use App\Enums\ArticleStatus;
use App\Models\SecurityTip;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SecurityTip>
 */
class SecurityTipFactory extends Factory
{
    protected $model = SecurityTip::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);
        $author = User::factory()->admin();

        return [
            'title' => rtrim($title, '.'),
            'slug' => SecurityTip::generateUniqueSlug(rtrim($title, '.')),
            'status' => ArticleStatus::Published,
            'created_by_id' => $author,
            'approved_by_id' => $author,
            'approved_at' => now()->subDays(fake()->numberBetween(1, 5)),
            'excerpt' => fake()->paragraph(2),
            'content' => json_encode([
                'root' => [
                    'type' => 'root',
                    'children' => [
                        [
                            'type' => 'paragraph',
                            'children' => [
                                [
                                    'type' => 'text',
                                    'text' => fake()->paragraphs(3, true),
                                ],
                            ],
                        ],
                    ],
                ],
            ]),
            'image' => null,
            'category' => fake()->randomElement(['Gardiennage', 'Surveillance', 'Événementiel', 'Prévention']),
            'tags' => fake()->randomElements(['gardiennage', 'surveillance', 'conakry', 'guinée', 'sécurité'], 2),
            'featured' => false,
            'views' => fake()->numberBetween(0, 500),
            'read_time' => fake()->numberBetween(1, 8),
            'published_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (): array => [
            'status' => ArticleStatus::Draft,
            'published_at' => null,
            'approved_by_id' => null,
            'approved_at' => null,
            'submitted_at' => null,
        ]);
    }

    public function pendingApproval(): static
    {
        return $this->state(fn (): array => [
            'status' => ArticleStatus::PendingApproval,
            'published_at' => null,
            'approved_by_id' => null,
            'approved_at' => null,
            'submitted_at' => now()->subDay(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (): array => [
            'status' => ArticleStatus::Rejected,
            'published_at' => null,
            'approved_by_id' => null,
            'approved_at' => null,
            'rejected_at' => now()->subDay(),
            'rejected_by_id' => User::factory()->admin(),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (): array => [
            'featured' => true,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (): array => [
            'status' => ArticleStatus::Published,
            'published_at' => now()->subDay(),
            'approved_at' => now()->subDays(2),
            'approved_by_id' => User::factory()->admin(),
        ]);
    }
}
