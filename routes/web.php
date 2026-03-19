<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\NuevosController;
use App\Http\Controllers\SeminuevosController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/nuevos', [NuevosController::class, 'index'])->name('nuevos');
Route::get('/seminuevos', [SeminuevosController::class, 'index'])->name('seminuevos');
Route::get('/seminuevos/comparar', [SeminuevosController::class, 'compare'])->name('seminuevos.compare');
Route::get('/seminuevos/{id}', [SeminuevosController::class, 'show'])->name('seminuevos.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
