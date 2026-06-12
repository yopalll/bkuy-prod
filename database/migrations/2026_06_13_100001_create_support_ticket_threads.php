<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Mengubah support ticket dari "satu pesan + satu respons admin" menjadi
 * helpdesk berbasis percakapan (thread) dengan lampiran gambar.
 *
 * Idempoten: aman dijalankan ulang di VPS (cek hasTable / hasColumn dulu),
 * mengikuti pola migrasi b575932 yang skip kolom bila sudah ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel pesan (thread bolak-balik antara user & admin)
        if (! Schema::hasTable('support_ticket_messages')) {
            Schema::create('support_ticket_messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('support_ticket_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('author_role')->default('user'); // user | admin
                $table->text('body');
                $table->timestamps();

                $table->index(['support_ticket_id', 'created_at']);
            });
        }

        // 2. Tabel lampiran gambar (menempel ke pesan tertentu)
        if (! Schema::hasTable('support_ticket_attachments')) {
            Schema::create('support_ticket_attachments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('support_ticket_message_id')->constrained()->cascadeOnDelete();
                $table->string('url');
                $table->string('public_id')->nullable();
                $table->string('file_name')->nullable();
                $table->string('mime_type')->nullable();
                $table->unsignedBigInteger('size')->nullable();
                $table->timestamps();
            });
        }

        // 3. Kolom ringkasan di support_tickets untuk sorting & indikator belum dibaca
        Schema::table('support_tickets', function (Blueprint $table) {
            if (! Schema::hasColumn('support_tickets', 'last_reply_at')) {
                $table->timestamp('last_reply_at')->nullable()->after('responded_at');
            }
            if (! Schema::hasColumn('support_tickets', 'last_reply_role')) {
                $table->string('last_reply_role')->nullable()->after('last_reply_at'); // user | admin
            }
            if (! Schema::hasColumn('support_tickets', 'user_unread')) {
                $table->boolean('user_unread')->default(false)->after('last_reply_role');
            }
            if (! Schema::hasColumn('support_tickets', 'admin_unread')) {
                $table->boolean('admin_unread')->default(true)->after('user_unread');
            }
        });

        // 4. Backfill: ubah tiket lama menjadi pesan pertama (+ respons admin bila ada)
        $tickets = DB::table('support_tickets')->orderBy('id')->get();

        foreach ($tickets as $ticket) {
            $already = DB::table('support_ticket_messages')
                ->where('support_ticket_id', $ticket->id)
                ->exists();

            if ($already) {
                continue;
            }

            // Pesan pertama dari user
            DB::table('support_ticket_messages')->insert([
                'support_ticket_id' => $ticket->id,
                'user_id'           => $ticket->user_id,
                'author_role'       => 'user',
                'body'              => $ticket->message ?? '',
                'created_at'        => $ticket->created_at,
                'updated_at'        => $ticket->created_at,
            ]);

            $lastRole = 'user';
            $lastAt   = $ticket->created_at;

            // Respons admin lama (kolom admin_response) → pesan admin
            if (! empty($ticket->admin_response)) {
                $respondedAt = $ticket->responded_at ?? $ticket->updated_at;
                DB::table('support_ticket_messages')->insert([
                    'support_ticket_id' => $ticket->id,
                    'user_id'           => null,
                    'author_role'       => 'admin',
                    'body'              => $ticket->admin_response,
                    'created_at'        => $respondedAt,
                    'updated_at'        => $respondedAt,
                ]);
                $lastRole = 'admin';
                $lastAt   = $respondedAt;
            }

            DB::table('support_tickets')->where('id', $ticket->id)->update([
                'last_reply_at'   => $lastAt,
                'last_reply_role' => $lastRole,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('support_ticket_attachments');
        Schema::dropIfExists('support_ticket_messages');

        Schema::table('support_tickets', function (Blueprint $table) {
            foreach (['last_reply_at', 'last_reply_role', 'user_unread', 'admin_unread'] as $col) {
                if (Schema::hasColumn('support_tickets', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
