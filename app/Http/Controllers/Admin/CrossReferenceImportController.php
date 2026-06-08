<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Services\CatalogImport\CrossReferenceImporter;
use Illuminate\Http\Request;

class CrossReferenceImportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file'        => ['required', 'file', 'mimes:xlsx,xls'],
            'iva_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $iva = (float) $request->input('iva_percent', 0);

        // Recordamos el último % de IVA usado para precargarlo la próxima vez.
        SiteSection::updateOrCreate(
            ['section' => 'cross_reference_settings'],
            ['data' => ['iva_percent' => $iva], 'is_visible' => true, 'order' => 0],
        );

        try {
            $r = (new CrossReferenceImporter)->import($request->file('file'), $iva);
        } catch (\RuntimeException $e) {
            // Errores controlados (ej. archivo sin la pestaña 'Data') vuelven
            // como flash error legible para el cliente, sin pantalla 500.
            return back()->with('error', $e->getMessage());
        }

        $ivaTxt = $iva > 0 ? " (IVA {$iva}% aplicado)" : ' (sin IVA)';
        $msg = "Sincronización: {$r['updated']} precios actualizados{$ivaTxt} "
            ."({$r['matched_skus']} SKU encontrados de {$r['rows']} en la pestaña Data).";

        if ($r['hidden'] > 0) {
            $msg .= " {$r['hidden']} ocultados por stock 0.";
        }
        if ($r['shown'] > 0) {
            $msg .= " {$r['shown']} republicados por tener stock.";
        }

        $notFound = $r['not_found'];
        if (count($notFound) > 0) {
            $sample = implode(', ', array_slice($notFound, 0, 8));
            $msg .= ' '.count($notFound).' SKU no existen aún en el sistema (se omiten): '.$sample
                .(count($notFound) > 8 ? '…' : '');
        }

        return back()->with('success', $msg);
    }
}
