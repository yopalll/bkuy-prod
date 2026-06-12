<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportTicketAttachment extends Model
{
    protected $fillable = [
        'support_ticket_message_id',
        'url',
        'public_id',
        'file_name',
        'mime_type',
        'size',
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(SupportTicketMessage::class, 'support_ticket_message_id');
    }
}
