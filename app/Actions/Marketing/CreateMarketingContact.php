<?php

namespace App\Actions\Marketing;

use App\Actions\Action;
use App\Models\MarketingContact;
use App\Models\MarketingList;
use Illuminate\Support\Facades\DB;

/**
 * Crée un contact marketing et l'associe optionnellement à des groupes.
 */
class CreateMarketingContact extends Action
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): MarketingContact
    {
        $listUuids = array_values(array_filter(
            $data['list_uuids'] ?? [],
            fn (mixed $uuid): bool => is_string($uuid) && $uuid !== '',
        ));

        unset($data['list_uuids']);

        return DB::transaction(function () use ($data, $listUuids): MarketingContact {
            $contact = MarketingContact::query()->create($data);

            if ($listUuids !== []) {
                $listIds = MarketingList::query()
                    ->whereIn('uuid', $listUuids)
                    ->pluck('id')
                    ->all();

                $contact->lists()->syncWithoutDetaching($listIds);
            }

            return $contact;
        });
    }
}
