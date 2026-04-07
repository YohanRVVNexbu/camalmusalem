<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contacto;
use Inertia\Inertia;

class ContactoController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/contactos/index', [
            'contactos' => Contacto::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(Contacto $contacto)
    {
        $contacto->update(['leido' => true]);
        return back();
    }

    public function destroy(Contacto $contacto)
    {
        $contacto->delete();
        return back()->with('success', 'Mensaje eliminado.');
    }
}
