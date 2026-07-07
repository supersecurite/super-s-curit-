<?php

use App\Enums\BackofficePermission;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $rows = DB::table('user_backoffice_permissions')->get();

        foreach ($rows as $row) {
            if (str_contains((string) $row->permission, '.')) {
                continue;
            }

            $expanded = BackofficePermission::expandLegacy((string) $row->permission);

            DB::table('user_backoffice_permissions')->where('id', $row->id)->delete();

            foreach ($expanded as $permission) {
                DB::table('user_backoffice_permissions')->updateOrInsert(
                    [
                        'user_id' => $row->user_id,
                        'permission' => $permission->value,
                    ],
                    [
                        'created_at' => $row->created_at,
                        'updated_at' => now(),
                    ],
                );
            }
        }
    }

    public function down(): void
    {
        // Non réversible sans perte de granularité.
    }
};
