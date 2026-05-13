<?php

use App\Http\Controllers\Admin\AccesorioController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\LookupController;
use App\Http\Controllers\Admin\MerchController;
use App\Http\Controllers\Admin\RentalController;
use App\Http\Controllers\Admin\VehicleModelController;
use App\Http\Controllers\Admin\VehicleVersionController;
use App\Http\Controllers\Admin\ContactoController;
use App\Http\Controllers\Admin\CotizacionAccesorioController;
use App\Http\Controllers\Admin\CotizacionRepuestoController;
use App\Http\Controllers\Admin\CotizacionVehiculoController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KintoSolicitudController;
use App\Http\Controllers\Admin\MantencionController;
use App\Http\Controllers\Admin\SolicitudEncargoRepuestoController;
use App\Http\Controllers\Admin\HomeContentController;
use App\Http\Controllers\Admin\NoticiaController;
use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\RepuestoController;
use App\Http\Controllers\Admin\SeminuevoController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas (sin autenticación admin)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('admin.login');
    Route::post('login', [AuthController::class, 'login'])->name('admin.login.store');
});

// Rutas protegidas (requiere admin)
Route::middleware('admin')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('admin.logout');
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Página de inicio
    Route::get('home', [HomeContentController::class, 'index'])->name('admin.home');
    Route::put('home/{section}', [HomeContentController::class, 'update'])->name('admin.home.update');
    Route::post('home/{section}/reset', [HomeContentController::class, 'reset'])->name('admin.home.reset');

    // Usuarios
    Route::resource('users', UserController::class)
        ->except(['show'])
        ->names('admin.users');

    // Catálogo técnico — Marcas
    Route::resource('brands', BrandController::class)
        ->except(['show'])
        ->names('admin.brands');

    // Sucursales
    Route::resource('branches', BranchController::class)
        ->except(['show'])
        ->names('admin.branches');

    // Catálogo técnico — Equipamiento (features)
    Route::resource('features', FeatureController::class)
        ->except(['show'])
        ->names('admin.features');

    // Listas editables (lookups)
    Route::get('lookups', [LookupController::class, 'index'])->name('admin.lookups');
    Route::post('lookups/{type}', [LookupController::class, 'store'])->name('admin.lookups.store');
    Route::put('lookups/{type}/{id}', [LookupController::class, 'update'])->name('admin.lookups.update');
    Route::delete('lookups/{type}/{id}', [LookupController::class, 'destroy'])->name('admin.lookups.destroy');

    // Catálogo técnico — Modelos de vehículos
    Route::resource('vehicle-models', VehicleModelController::class)
        ->except(['show'])
        ->parameters(['vehicle-models' => 'vehicleModel'])
        ->names('admin.vehicle-models');

    // Arriendos KINTO
    Route::resource('rentals', RentalController::class)
        ->except(['show'])
        ->names('admin.rentals');

    // Catálogo técnico — Versiones (ficha técnica)
    Route::post('vehicle-versions/import', [VehicleVersionController::class, 'import'])->name('admin.vehicle-versions.import');
    Route::get('vehicle-versions/export', [VehicleVersionController::class, 'export'])->name('admin.vehicle-versions.export');
    Route::get('vehicle-versions/template', [VehicleVersionController::class, 'template'])->name('admin.vehicle-versions.template');
    Route::get('vehicle-versions/precios/export', [VehicleVersionController::class, 'preciosExport'])->name('admin.vehicle-versions.precios.export');
    Route::post('vehicle-versions/precios/import', [VehicleVersionController::class, 'preciosImport'])->name('admin.vehicle-versions.precios.import');
    Route::resource('vehicle-versions', VehicleVersionController::class)
        ->except(['show'])
        ->parameters(['vehicle-versions' => 'vehicleVersion'])
        ->names('admin.vehicle-versions');

    // Repuestos
    Route::post('repuestos/import', [RepuestoController::class, 'import'])->name('admin.repuestos.import');
    Route::get('repuestos/export', [RepuestoController::class, 'export'])->name('admin.repuestos.export');
    Route::get('repuestos/template', [RepuestoController::class, 'template'])->name('admin.repuestos.template');
    Route::resource('repuestos', RepuestoController::class)
        ->except(['show'])
        ->names('admin.repuestos');

    // Accesorios
    Route::post('accesorios/import', [AccesorioController::class, 'import'])->name('admin.accesorios.import');
    Route::get('accesorios/export', [AccesorioController::class, 'export'])->name('admin.accesorios.export');
    Route::get('accesorios/template', [AccesorioController::class, 'template'])->name('admin.accesorios.template');
    Route::resource('accesorios', AccesorioController::class)
        ->except(['show'])
        ->names('admin.accesorios');

    // Seminuevos
    Route::post('seminuevos/import', [SeminuevoController::class, 'import'])->name('admin.seminuevos.import');
    Route::get('seminuevos/export', [SeminuevoController::class, 'export'])->name('admin.seminuevos.export');
    Route::get('seminuevos/template', [SeminuevoController::class, 'template'])->name('admin.seminuevos.template');
    Route::resource('seminuevos', SeminuevoController::class)
        ->except(['show'])
        ->names('admin.seminuevos');

    // Merch
    Route::post('merch/import', [MerchController::class, 'import'])->name('admin.merch.import');
    Route::get('merch/export', [MerchController::class, 'export'])->name('admin.merch.export');
    Route::get('merch/template', [MerchController::class, 'template'])->name('admin.merch.template');
    Route::resource('merch', MerchController::class)
        ->except(['show'])
        ->names('admin.merch');

    // Noticias
    Route::resource('noticias', NoticiaController::class)
        ->except(['show'])
        ->names('admin.noticias');

    // Contactos
    Route::get('contactos', [ContactoController::class, 'index'])->name('admin.contactos');
    Route::patch('contactos/{contacto}/leido', [ContactoController::class, 'marcarLeido'])->name('admin.contactos.leido');
    Route::delete('contactos/{contacto}', [ContactoController::class, 'destroy'])->name('admin.contactos.destroy');

    // Agendamientos de mantención
    Route::get('mantenciones', [MantencionController::class, 'index'])->name('admin.mantenciones');
    Route::patch('mantenciones/{agendamiento}/leido', [MantencionController::class, 'marcarLeido'])->name('admin.mantenciones.leido');
    Route::delete('mantenciones/{agendamiento}', [MantencionController::class, 'destroy'])->name('admin.mantenciones.destroy');

    // Solicitudes Kinto
    Route::get('kinto-solicitudes', [KintoSolicitudController::class, 'index'])->name('admin.kinto-solicitudes');
    Route::patch('kinto-solicitudes/{solicitud}/leido', [KintoSolicitudController::class, 'marcarLeido'])->name('admin.kinto-solicitudes.leido');
    Route::delete('kinto-solicitudes/{solicitud}', [KintoSolicitudController::class, 'destroy'])->name('admin.kinto-solicitudes.destroy');

    // Cotizaciones de vehículos (nuevos + seminuevos)
    Route::get('cotizaciones-vehiculos', [CotizacionVehiculoController::class, 'index'])->name('admin.cotizaciones-vehiculos');
    Route::patch('cotizaciones-vehiculos/{cotizacion}/leido', [CotizacionVehiculoController::class, 'marcarLeido'])->name('admin.cotizaciones-vehiculos.leido');
    Route::delete('cotizaciones-vehiculos/{cotizacion}', [CotizacionVehiculoController::class, 'destroy'])->name('admin.cotizaciones-vehiculos.destroy');

    // Cotizaciones de accesorios
    Route::get('cotizaciones-accesorios', [CotizacionAccesorioController::class, 'index'])->name('admin.cotizaciones-accesorios');
    Route::patch('cotizaciones-accesorios/{cotizacion}/leido', [CotizacionAccesorioController::class, 'marcarLeido'])->name('admin.cotizaciones-accesorios.leido');
    Route::delete('cotizaciones-accesorios/{cotizacion}', [CotizacionAccesorioController::class, 'destroy'])->name('admin.cotizaciones-accesorios.destroy');

    // Cotizaciones de repuestos
    Route::get('cotizaciones-repuestos', [CotizacionRepuestoController::class, 'index'])->name('admin.cotizaciones-repuestos');
    Route::patch('cotizaciones-repuestos/{cotizacion}/leido', [CotizacionRepuestoController::class, 'marcarLeido'])->name('admin.cotizaciones-repuestos.leido');
    Route::delete('cotizaciones-repuestos/{cotizacion}', [CotizacionRepuestoController::class, 'destroy'])->name('admin.cotizaciones-repuestos.destroy');

    // Solicitudes de encargo de repuestos
    Route::get('solicitudes-encargo', [SolicitudEncargoRepuestoController::class, 'index'])->name('admin.solicitudes-encargo');
    Route::patch('solicitudes-encargo/{solicitud}/leido', [SolicitudEncargoRepuestoController::class, 'marcarLeido'])->name('admin.solicitudes-encargo.leido');
    Route::delete('solicitudes-encargo/{solicitud}', [SolicitudEncargoRepuestoController::class, 'destroy'])->name('admin.solicitudes-encargo.destroy');

    // Páginas estáticas (CMS por sección)
    Route::get('paginas', [PageContentController::class, 'index'])->name('admin.paginas');
    Route::get('paginas/{page}', [PageContentController::class, 'show'])->name('admin.paginas.show');
    Route::post('paginas/{page}/{section}', [PageContentController::class, 'update'])->name('admin.paginas.update');
    Route::post('paginas/{page}/{section}/reset', [PageContentController::class, 'reset'])->name('admin.paginas.reset');
});
