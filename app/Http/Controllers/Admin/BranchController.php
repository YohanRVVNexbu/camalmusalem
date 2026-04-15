<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/branches/index', [
            'branches' => Branch::orderBy('display_order')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/branches/form', ['branch' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        Branch::create($data);

        return redirect('/admin/branches')->with('success', 'Sucursal creada correctamente.');
    }

    public function edit(Branch $branch)
    {
        return Inertia::render('admin/branches/form', ['branch' => $branch]);
    }

    public function update(Request $request, Branch $branch)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        $branch->update($data);

        return back()->with('success', 'Sucursal actualizada correctamente.');
    }

    public function destroy(Branch $branch)
    {
        if ($branch->seminuevos()->exists()) {
            return back()->with('error', 'No se puede eliminar: la sucursal tiene seminuevos asociados.');
        }

        $branch->delete();

        return redirect('/admin/branches')->with('success', 'Sucursal eliminada.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'maps_url' => ['nullable', 'url', 'max:500'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
        ]);
    }
}
