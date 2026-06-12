<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupportTicket extends Model
{
    protected $fillable = [
        'user_id',
        'subject',
        'message',
        'category',
        'status',
        'admin_response',
        'responded_at',
        'last_reply_at',
        'last_reply_role',
        'user_unread',
        'admin_unread',
    ];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
            'last_reply_at' => 'datetime',
            'user_unread'  => 'boolean',
            'admin_unread' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(SupportTicketMessage::class)->orderBy('created_at');
    }
}
