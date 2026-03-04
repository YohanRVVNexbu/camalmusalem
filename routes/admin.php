<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Usuarios
    Route::resource('users', UserController::class)
        ->except(['show'])
        ->names('admin.users');
});
