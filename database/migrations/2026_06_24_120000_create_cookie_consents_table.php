<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Registro de auditoría de consentimiento de cookies ("prueba de consentimiento").
 *
 * Guardamos una fila por cada decisión del visitante (aceptar todo / rechazar /
 * personalizado). NO guardamos la IP en claro: se almacena un hash truncado
 * para poder demostrar el consentimiento sin retener un dato identificable de
 * quien, además, pudo haber RECHAZADO. La validación legal del esquema queda a
 * cargo de la abogada/compliance.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cookie_consents', function (Blueprint $table) {
            $table->id();
            // UUID que genera la librería del lado cliente — permite agrupar las
            // decisiones sucesivas de un mismo navegador sin identificar a la persona.
            $table->string('consent_uuid', 64)->nullable()->index();
            // accept_all | reject_all | custom
            $table->string('action', 20);
            // { necessary: true, analytics: bool, marketing: bool }
            $table->json('categories');
            // Versión de la política aceptada (para forzar re-consentimiento si cambia).
            $table->string('policy_version', 20)->default('1');
            // IP anonimizada (hash). Nunca en claro.
            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent', 512)->nullable();
            // URL donde se dio el consentimiento.
            $table->string('url', 512)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cookie_consents');
    }
};
