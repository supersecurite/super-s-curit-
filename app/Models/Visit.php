<?php

namespace App\Models;

use Database\Factories\VisitFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visit extends Model
{
    /** @use HasFactory<VisitFactory> */
    use HasFactory;

    protected $fillable = [
        'visitor_uuid',
        'session_id',
        'user_id',
        'path',
        'url',
        'query_string',
        'referrer',
        'referrer_domain',
        'ip_address',
        'user_agent',
        'browser',
        'browser_version',
        'platform',
        'device',
        'country_code',
        'country',
        'duration_seconds',
        'is_bot',
        'is_bounce',
    ];

    protected function casts(): array
    {
        return [
            'is_bot' => 'boolean',
            'is_bounce' => 'boolean',
            'duration_seconds' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
