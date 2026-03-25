<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\NuevosController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\PostVentaController;
use App\Http\Controllers\SeminuevosController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/nuevos', [NuevosController::class, 'index'])->name('nuevos');
Route::get('/nuevos/{id}', [NuevosController::class, 'show'])->name('nuevos.show');
Route::get('/seminuevos', [SeminuevosController::class, 'index'])->name('seminuevos');
Route::get('/seminuevos/comparar', [SeminuevosController::class, 'compare'])->name('seminuevos.compare');
Route::get('/seminuevos/{id}', [SeminuevosController::class, 'show'])->name('seminuevos.show');

Route::get('/post-venta/agendar-mantencion', [PostVentaController::class, 'agendarMantencion'])->name('post-venta.agendar-mantencion');
Route::get('/post-venta/accesorios', [PostVentaController::class, 'accesorios'])->name('post-venta.accesorios');
Route::get('/post-venta/repuestos', [PostVentaController::class, 'repuestos'])->name('post-venta.repuestos');

Route::get('/programas', [PagesController::class, 'programas'])->name('programas');
Route::get('/shorts', [PagesController::class, 'shorts'])->name('shorts');
Route::get('/noticias', [PagesController::class, 'noticias'])->name('noticias');
Route::get('/noticias/{slug}', [PagesController::class, 'noticiaShow'])->name('noticias.show');
Route::get('/contacto', [PagesController::class, 'contacto'])->name('contacto');
Route::get('/nosotros', [PagesController::class, 'nosotros'])->name('nosotros');
Route::get('/kinto', [PagesController::class, 'kinto'])->name('kinto');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
