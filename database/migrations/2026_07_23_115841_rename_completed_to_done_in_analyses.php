<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('analyses')
            ->where('status', 'completed')
            ->update(['status' => 'done']);
    }

    public function down(): void
    {
        DB::table('analyses')
            ->where('status', 'done')
            ->update(['status' => 'completed']);
    }
};
