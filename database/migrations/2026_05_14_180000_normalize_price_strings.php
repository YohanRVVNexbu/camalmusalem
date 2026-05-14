<?php

use App\Models\Accesorio;
use App\Models\Repuesto;
use App\Models\Seminuevo;
use Illuminate\Database\Migrations\Migration;

/**
 * Normaliza los precios existentes a sólo dígitos para que coincidan con el
 * formato canónico que ahora exige el admin. El frontend público aplica
 * formatCLP() al renderizar, así que cualquier representación pasa.
 */
return new class extends Migration {
    public function up(): void
    {
        $clean = fn (?string $v): ?string => $v === null
            ? null
            : (preg_replace('/[^0-9]/', '', $v) ?: null);

        foreach (Seminuevo::query()->get(['id', 'price', 'down_payment']) as $s) {
            $s->forceFill([
                'price' => $clean($s->price),
                'down_payment' => $clean($s->down_payment),
            ])->save();
        }

        foreach (Accesorio::query()->get(['id', 'price']) as $a) {
            $a->forceFill(['price' => $clean($a->price)])->save();
        }

        foreach (Repuesto::query()->get(['id', 'price']) as $r) {
            $r->forceFill(['price' => $clean($r->price)])->save();
        }
    }

    public function down(): void
    {
        // No revert: la información ya está en formato canónico.
    }
};
