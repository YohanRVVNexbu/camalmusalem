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

        $r = (new CrossReferenceImporter)->import($request->file('file'));

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
