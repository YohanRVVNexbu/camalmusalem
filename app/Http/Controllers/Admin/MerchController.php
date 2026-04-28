<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Merch;
use App\Services\CatalogExport\MerchExporter;
use App\Services\CatalogImport\MerchImporter;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MerchController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/merch/index', [
            'merch' => Merch::orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/merch/form', ['merch' => null]);
    }

    public function store(Request $request)
    {
        $data  = $this->validated($request);
        $merch = Merch::create($data);
        $this->handleImages($request, $merch);

        return redirect('/admin/merch')->with('success', 'Merch creado correctamente.');
    }

    public function edit(Merch $merch)
    {
        return Inertia::render('admin/merch/form', ['merch' => $merch]);
    }

    public function update(Request $request, Merch $merch)
    {
        $data = $this->validated($request);
        $merch->update($data);
        $this->handleImages($request, $merch);

        return back()->with('success', 'Merch actualizado correctamente.');
    }

    public function destroy(Merch $merch)
    {
        foreach ($merch->images ?? [] as $url) {
            $this->settings->deleteOldFile($url);
        }
        $merch->delete();

        return redirect('/admin/merch')->with('success', 'Merch eliminado.');
    }

    public function import(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);
        $result = (new MerchImporter)->import($request->file('file'));

        return redirect('/admin/merch')->with('success', $result->toFlashMessage());
    }

    public function export()
    {
        return (new MerchExporter)->download('merch_'.date('Y-m-d').'.xlsx');
    }

    public function template()
    {
        return (new MerchExporter(templateOnly: true))->download('plantilla_merch.xlsx');
    }

    private function handleImages(Request $request, Merch $merch): void
    {
        $images = $merch->images ?? [];

        if ($request->hasFile('images_new')) {
            foreach ($request->file('images_new') as $file) {
                $images[] = $this->settings->uploadFile($file, 'merch/'.$merch->id);
            }
        }

        if ($request->has('images_remove')) {
            $toRemove = $request->input('images_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $images = array_values(array_filter($images, fn ($u) => ! in_array($u, $toRemove)));
        }

        $merch->update(['images' => $images]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'sku'              => ['nullable', 'string', 'max:100'],
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'description_tech' => ['nullable', 'string'],
            'category'         => ['required', 'string', 'max:100'],
            'subcategory'      => ['nullable', 'string', 'max:100'],
            'size'             => ['nullable', 'string', 'max:100'],
            'price'            => ['nullable', 'string', 'max:100'],
            'price_offer'      => ['nullable', 'string', 'max:100'],
            'status'           => ['nullable', 'string', 'max:50'],
            'branch'           => ['nullable', 'string', 'max:255'],
            'is_visible'       => ['boolean'],
            'order'            => ['integer'],
        ]);
    }
}
