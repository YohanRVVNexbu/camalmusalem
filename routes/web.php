<?php

use App\Http\Controllers\ContactoController;
use App\Http\Controllers\PrevencionDelitoController;
use App\Http\Controllers\CotizacionAccesorioController;
use App\Http\Controllers\CotizacionRepuestoController;
use App\Http\Controllers\CotizacionVehiculoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KintoSolicitudController;
use App\Http\Controllers\MantencionController;
use App\Http\Controllers\NuevosController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\PostVentaController;
use App\Http\Controllers\SeminuevosController;
use App\Http\Controllers\SolicitudEncargoRepuestoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/nuevos', [NuevosController::class, 'index'])->name('nuevos');
Route::get('/nuevos/{id}/cotizar', [NuevosController::class, 'cotizar'])->name('nuevos.cotizar');
Route::post('/cotizaciones/vehiculo', [CotizacionVehiculoController::class, 'store'])->name('cotizaciones.vehiculo.store');
Route::get('/nuevos/{id}', [NuevosController::class, 'show'])->name('nuevos.show');
Route::get('/seminuevos', [SeminuevosController::class, 'index'])->name('seminuevos');
Route::get('/seminuevos/comparar', [SeminuevosController::class, 'compare'])->name('seminuevos.compare');
Route::get('/seminuevos/{id}/cotizar', [SeminuevosController::class, 'cotizar'])->name('seminuevos.cotizar');
// La ruta POST de cotización de vehículos (nuevos y seminuevos) está unificada arriba en /cotizaciones/vehiculo
Route::get('/seminuevos/{id}', [SeminuevosController::class, 'show'])->name('seminuevos.show');

Route::get('/post-venta/agendar-mantencion', [PostVentaController::class, 'agendarMantencion'])->name('post-venta.agendar-mantencion');
Route::post('/post-venta/agendar-mantencion', [MantencionController::class, 'store'])->name('mantencion.store');
Route::get('/post-venta/accesorios', [PostVentaController::class, 'accesorios'])->name('post-venta.accesorios');
Route::get('/post-venta/accesorios/{id}', [PostVentaController::class, 'accesorioShow'])->name('post-venta.accesorios.show');
Route::get('/post-venta/accesorios/{id}/cotizar', [PostVentaController::class, 'accesorioCotizar'])->name('post-venta.accesorios.cotizar');
Route::post('/post-venta/accesorios/{id}/cotizar', [CotizacionAccesorioController::class, 'store'])->name('post-venta.accesorios.cotizar.store');
Route::get('/post-venta/repuestos', [PostVentaController::class, 'repuestos'])->name('post-venta.repuestos');
Route::post('/post-venta/repuestos/encargo', [SolicitudEncargoRepuestoController::class, 'store'])->name('post-venta.repuestos.encargo.store');
Route::get('/post-venta/repuestos/{id}', [PostVentaController::class, 'repuestoShow'])->name('post-venta.repuestos.show');
Route::get('/post-venta/repuestos/{id}/cotizar', [PostVentaController::class, 'repuestoCotizar'])->name('post-venta.repuestos.cotizar');
Route::post('/post-venta/repuestos/{id}/cotizar', [CotizacionRepuestoController::class, 'store'])->name('post-venta.repuestos.cotizar.store');

Route::get('/programas', [PagesController::class, 'programas'])->name('programas');
// Route::get('/shorts', [PagesController::class, 'shorts'])->name('shorts');
Route::get('/noticias', [PagesController::class, 'noticias'])->name('noticias');
Route::get('/noticias/{slug}', [PagesController::class, 'noticiaShow'])->name('noticias.show');
Route::get('/contacto', [PagesController::class, 'contacto'])->name('contacto');
Route::post('/contacto', [ContactoController::class, 'store'])->name('contacto.store');

Route::get('/prevencion-delito', [PrevencionDelitoController::class, 'show'])->name('prevencion-delito');
Route::post('/prevencion-delito', [PrevencionDelitoController::class, 'store'])->name('prevencion-delito.store');
Route::get('/nosotros', [PagesController::class, 'nosotros'])->name('nosotros');
Route::get('/kinto', [PagesController::class, 'kinto'])->name('kinto');
Route::post('/kinto/solicitud', [KintoSolicitudController::class, 'store'])->name('kinto.solicitud.store');
Route::get('/valores-mantencion', [PagesController::class, 'valoresMantencion'])->name('valores-mantencion');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
