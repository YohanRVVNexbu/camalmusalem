<?php

/*
 * Correos internos a los que se notifica cada formulario público.
 *
 * Mapeo según el PDF "Contacto Correos Electronicos.pdf" entregado por el
 * cliente. Cada formulario notifica a un correo interno (el equipo que
 * atiende) además de mandar acuse de recibo al cliente.
 *
 * Los formularios que distinguen por sucursal (Repuestos/Merch, Mantención)
 * usan un sub-array con claves `la_serena`, `ovalle` y `default`. El
 * `NotificationRouter` mapea el texto de la sucursal del formulario
 * (puede llegar como "La Serena", "Ovalle", "LA SERENA", etc.) al slug
 * correspondiente.
 *
 * Cualquiera de estos correos se puede sobreescribir vía .env sin tocar
 * código (útil cuando rota un encargado o cambia el correo del equipo).
 */
return [

    // Formularios de vehículos
    'vehiculos_nuevos' => env('NOTIFY_VEHICULOS_NUEVOS', 'info@camalmusalem.cl'),
    'vehiculos_seminuevos' => env('NOTIFY_VEHICULOS_SEMINUEVOS', 'seminuevos@camalmusalem.cl'),

    // Formulario de contacto general
    'contacto' => env('NOTIFY_CONTACTO', 'info@camalmusalem.cl'),

    // Solicitudes KINTO (no especificado en PDF, default a info)
    'kinto' => env('NOTIFY_KINTO', 'info@camalmusalem.cl'),

    // Repuestos y Merch — un correo por sucursal
    'repuestos' => [
        'la_serena' => env('NOTIFY_REPUESTOS_LS', 'repuestosls@camalmusalem.cl'),
        'ovalle'    => env('NOTIFY_REPUESTOS_OVA', 'repuestosova@camalmusalem.cl'),
        'default'   => env('NOTIFY_REPUESTOS_DEFAULT', 'repuestosls@camalmusalem.cl'),
    ],

    // Accesorios — el PDF los agrupa con "Repuestos y Merch", así que comparten
    // los mismos correos por sucursal.
    'accesorios' => [
        'la_serena' => env('NOTIFY_ACCESORIOS_LS', 'repuestosls@camalmusalem.cl'),
        'ovalle'    => env('NOTIFY_ACCESORIOS_OVA', 'repuestosova@camalmusalem.cl'),
        'default'   => env('NOTIFY_ACCESORIOS_DEFAULT', 'repuestosls@camalmusalem.cl'),
    ],

    // Agendamiento de Mantención — Servicio Técnico, un correo por sucursal
    'mantencion' => [
        'la_serena' => env('NOTIFY_MANTENCION_LS', 'stecnicols@camalmusalem.cl'),
        'ovalle'    => env('NOTIFY_MANTENCION_OVA', 'stecnicoova@camalmusalem.cl'),
        'default'   => env('NOTIFY_MANTENCION_DEFAULT', 'stecnicols@camalmusalem.cl'),
    ],

];
