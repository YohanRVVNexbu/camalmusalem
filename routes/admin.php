<?php

use App\Http\Controllers\Admin\AccesorioController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomeContentController;
use App\Http\Controllers\Admin\NoticiaController;
use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\RepuestoController;
use App\Http\Controllers\Admin\SeminuevoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VehicleController;
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

    // Vehículos nuevos
    Route::resource('vehicles', VehicleController::class)
        ->except(['show'])
        ->names('admin.vehicles');

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

    // Páginas estáticas (CMS por sección)
    Route::get('paginas', [PageContentController::class, 'index'])->name('admin.paginas');
    Route::get('paginas/{page}', [PageContentController::class, 'show'])->name('admin.paginas.show');
    Route::post('paginas/{page}/{section}', [PageContentController::class, 'update'])->name('admin.paginas.update');
    Route::post('paginas/{page}/{section}/reset', [PageContentController::class, 'reset'])->name('admin.paginas.reset');
});
