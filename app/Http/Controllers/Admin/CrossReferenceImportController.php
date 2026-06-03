<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CatalogImport\CrossReferenceImporter;
use Illuminate\Http\Request;

class CrossReferenceImportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);

        try {
            $r = (new CrossReferenceImporter)->import($request->file('file'));
        } catch (\RuntimeException $e) {
            // Errores controlados (ej. archivo sin la pestaña 'Data') vuelven
            // como flash error legible para el cliente, sin pantalla 500.
            return back()->with('error', $e->getMessage());
        }

        $msg = "Sincronización de precios: {$r['updated']} productos actualizados "
            ."({$r['matched_skus']} SKU encontrados de {$r['rows']} en la pestaña Data).";

        $notFound = $r['not_found'];
        if (count($notFound) > 0) {
            $sample = implode(', ', array_slice($notFound, 0, 8));
            $msg .= ' '.count($notFound).' SKU no existen aún en el sistema (se omiten): '.$sample
                .(count($notFound) > 8 ? '…' : '');
        }

        return back()->with('success', $msg);
    }
}
