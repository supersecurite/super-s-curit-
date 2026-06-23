<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            [
                'name' => 'AKIBA FINANCE',
                'logo' => '/images/super-securite/partners/akiba.jpeg',
                'sort_order' => 1,
            ],
            [
                'name' => 'DJOLOF CHICKEN',
                'logo' => '/images/super-securite/partners/Djolof.jpeg',
                'sort_order' => 2,
            ],
            [
                'name' => 'Heroes Coffee',
                'logo' => '/images/super-securite/partners/Heroescoffee.jpeg',
                'sort_order' => 3,
            ],
            [
                'name' => 'Ashapura',
                'logo' => '/images/super-securite/partners/Ashapura.jpeg',
                'sort_order' => 4,
            ],
            [
                'name' => 'TGCC',
                'logo' => '/images/super-securite/partners/TGCC.jpeg',
                'sort_order' => 5,
            ],
            [
                'name' => 'BANKI TRUCK',
                'logo' => '/images/super-securite/partners/banki.jpeg',
                'sort_order' => 6,
            ],
            [
                'name' => 'Diare Groupe Industrie',
                'logo' => '/images/super-securite/partners/DGI.jpeg',
                'sort_order' => 7,
            ],
        ];

        foreach ($partners as $partner) {
            Partner::query()->updateOrCreate(
                ['name' => $partner['name']],
                [
                    'uuid' => (string) Str::uuid(),
                    'logo' => $partner['logo'],
                    'sort_order' => $partner['sort_order'],
                    'is_published' => true,
                ]
            );
        }
    }
}
