<?php

use App\Http\Controllers\Admin\AccesorioController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\VehicleModelController;
use App\Http\Controllers\Admin\VehicleVersionController;
use App\Http\Controllers\Admin\ContactoController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KintoSolicitudController;
use App\Http\Controllers\Admin\MantencionController;
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

    // Usuarios
    Route::resource('users', UserController::class)
        ->except(['show'])
        ->names('admin.users');

    // Catálogo técnico — Marcas
    Route::resource('brands', BrandController::class)
        ->except(['show'])
        ->names('admin.brands');

    // Catálogo técnico — Equipamiento (features)
    Route::resource('features', FeatureController::class)
        ->except(['show'])
        ->names('admin.features');

    // Catálogo técnico — Modelos de vehículos
    Route::resource('vehicle-models', VehicleModelController::class)
        ->except(['show'])
        ->parameters(['vehicle-models' => 'vehicleModel'])
        ->names('admin.vehicle-models');

    // Catálogo técnico — Versiones (ficha técnica)
    Route::resource('vehicle-versions', VehicleVersionController::class)
        ->except(['show'])
        ->parameters(['vehicle-versions' => 'vehicleVersion'])
        ->names('admin.vehicle-versions');

    // Repuestos
    Route::resource('repuestos', RepuestoController::class)
        ->except(['show'])
        ->names('admin.repuestos');

    // Accesorios
    Route::resource('accesorios', AccesorioController::class)
        ->except(['show'])
        ->names('admin.accesorios');

    // Seminuevos
    Route::resource('seminuevos', SeminuevoController::class)
        ->except(['show'])
        ->names('admin.seminuevos');

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

    // Páginas estáticas (CMS por sección)
    Route::get('paginas', [PageContentController::class, 'index'])->name('admin.paginas');
    Route::get('paginas/{page}', [PageContentController::class, 'show'])->name('admin.paginas.show');
    Route::post('paginas/{page}/{section}', [PageContentController::class, 'update'])->name('admin.paginas.update');
    Route::post('paginas/{page}/{section}/reset', [PageContentController::class, 'reset'])->name('admin.paginas.reset');
});
