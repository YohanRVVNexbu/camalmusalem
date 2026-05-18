<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Mensajes de validación — Camal Musalem
    |--------------------------------------------------------------------------
    |
    | Traducciones intuitivas en español chileno para los formularios públicos.
    | Cada regla tiene un mensaje claro, y `attributes` define cómo se nombra
    | cada campo cuando aparece en el mensaje (ej: "nombre" → "tu nombre").
    |
    | Si necesitás un mensaje todavía más específico para un campo concreto,
    | usá el formato `custom.{campo}.{regla}`. Ej: `custom.rut.required`.
    |
    */

    'accepted' => 'Debes aceptar :attribute para continuar.',
    'accepted_if' => 'Debes aceptar :attribute si :other es :value.',
    'active_url' => ':attribute no es una URL válida.',
    'after' => ':attribute debe ser una fecha posterior a :date.',
    'after_or_equal' => ':attribute debe ser una fecha igual o posterior a :date.',
    'alpha' => ':attribute solo puede contener letras.',
    'alpha_dash' => ':attribute solo puede contener letras, números, guiones y guiones bajos.',
    'alpha_num' => ':attribute solo puede contener letras y números.',
    'array' => ':attribute debe ser un listado.',
    'ascii' => ':attribute solo puede contener caracteres alfanuméricos y símbolos de un byte.',
    'before' => ':attribute debe ser una fecha anterior a :date.',
    'before_or_equal' => ':attribute debe ser una fecha igual o anterior a :date.',
    'between' => [
        'array' => ':attribute debe tener entre :min y :max elementos.',
        'file' => ':attribute debe pesar entre :min y :max kilobytes.',
        'numeric' => ':attribute debe estar entre :min y :max.',
        'string' => ':attribute debe tener entre :min y :max caracteres.',
    ],
    'boolean' => ':attribute debe ser verdadero o falso.',
    'can' => ':attribute contiene un valor no autorizado.',
    'confirmed' => 'La confirmación de :attribute no coincide.',
    'contains' => 'A :attribute le falta un valor obligatorio.',
    'current_password' => 'La contraseña es incorrecta.',
    'date' => ':attribute no es una fecha válida.',
    'date_equals' => ':attribute debe ser igual a :date.',
    'date_format' => ':attribute no coincide con el formato :format.',
    'decimal' => ':attribute debe tener :decimal decimales.',
    'declined' => 'Debes rechazar :attribute.',
    'declined_if' => 'Debes rechazar :attribute si :other es :value.',
    'different' => ':attribute y :other deben ser diferentes.',
    'digits' => ':attribute debe tener :digits dígitos.',
    'digits_between' => ':attribute debe tener entre :min y :max dígitos.',
    'dimensions' => ':attribute tiene dimensiones de imagen inválidas.',
    'distinct' => ':attribute tiene un valor duplicado.',
    'doesnt_end_with' => ':attribute no puede terminar con: :values.',
    'doesnt_start_with' => ':attribute no puede comenzar con: :values.',
    'email' => 'Ingresa un correo electrónico válido.',
    'ends_with' => ':attribute debe terminar con: :values.',
    'enum' => ':attribute seleccionado no es válido.',
    'exists' => ':attribute seleccionado no es válido.',
    'extensions' => ':attribute debe tener una de las siguientes extensiones: :values.',
    'file' => ':attribute debe ser un archivo.',
    'filled' => ':attribute es obligatorio.',
    'gt' => [
        'array' => ':attribute debe tener más de :value elementos.',
        'file' => ':attribute debe pesar más de :value kilobytes.',
        'numeric' => ':attribute debe ser mayor que :value.',
        'string' => ':attribute debe tener más de :value caracteres.',
    ],
    'gte' => [
        'array' => ':attribute debe tener :value elementos o más.',
        'file' => ':attribute debe pesar :value kilobytes o más.',
        'numeric' => ':attribute debe ser mayor o igual a :value.',
        'string' => ':attribute debe tener :value caracteres o más.',
    ],
    'hex_color' => ':attribute debe ser un color hexadecimal válido.',
    'image' => ':attribute debe ser una imagen.',
    'in' => ':attribute seleccionado no es válido.',
    'in_array' => ':attribute no existe en :other.',
    'integer' => ':attribute debe ser un número entero.',
    'ip' => ':attribute debe ser una dirección IP válida.',
    'ipv4' => ':attribute debe ser una dirección IPv4 válida.',
    'ipv6' => ':attribute debe ser una dirección IPv6 válida.',
    'json' => ':attribute debe ser un JSON válido.',
    'list' => ':attribute debe ser una lista.',
    'lowercase' => ':attribute debe estar en minúsculas.',
    'lt' => [
        'array' => ':attribute debe tener menos de :value elementos.',
        'file' => ':attribute debe pesar menos de :value kilobytes.',
        'numeric' => ':attribute debe ser menor que :value.',
        'string' => ':attribute debe tener menos de :value caracteres.',
    ],
    'lte' => [
        'array' => ':attribute no debe tener más de :value elementos.',
        'file' => ':attribute no debe pesar más de :value kilobytes.',
        'numeric' => ':attribute no debe ser mayor que :value.',
        'string' => ':attribute no debe tener más de :value caracteres.',
    ],
    'mac_address' => ':attribute debe ser una dirección MAC válida.',
    'max' => [
        'array' => ':attribute no debe tener más de :max elementos.',
        'file' => ':attribute no debe pesar más de :max kilobytes.',
        'numeric' => ':attribute no debe ser mayor que :max.',
        'string' => ':attribute no debe tener más de :max caracteres.',
    ],
    'max_digits' => ':attribute no debe tener más de :max dígitos.',
    'mimes' => ':attribute debe ser un archivo de tipo: :values.',
    'mimetypes' => ':attribute debe ser un archivo de tipo: :values.',
    'min' => [
        'array' => ':attribute debe tener al menos :min elementos.',
        'file' => ':attribute debe pesar al menos :min kilobytes.',
        'numeric' => ':attribute debe ser al menos :min.',
        'string' => ':attribute debe tener al menos :min caracteres.',
    ],
    'min_digits' => ':attribute debe tener al menos :min dígitos.',
    'missing' => ':attribute no debe estar presente.',
    'missing_if' => ':attribute no debe estar presente cuando :other es :value.',
    'missing_unless' => ':attribute no debe estar presente a menos que :other sea :value.',
    'missing_with' => ':attribute no debe estar presente cuando :values esté presente.',
    'missing_with_all' => ':attribute no debe estar presente cuando :values estén presentes.',
    'multiple_of' => ':attribute debe ser múltiplo de :value.',
    'not_in' => ':attribute seleccionado no es válido.',
    'not_regex' => 'El formato de :attribute no es válido.',
    'numeric' => ':attribute debe ser un número.',
    'password' => [
        'letters' => ':attribute debe contener al menos una letra.',
        'mixed' => ':attribute debe contener al menos una mayúscula y una minúscula.',
        'numbers' => ':attribute debe contener al menos un número.',
        'symbols' => ':attribute debe contener al menos un símbolo.',
        'uncompromised' => ':attribute apareció en una filtración de datos. Elige uno distinto.',
    ],
    'present' => ':attribute es obligatorio.',
    'present_if' => ':attribute es obligatorio cuando :other es :value.',
    'present_unless' => ':attribute es obligatorio a menos que :other sea :value.',
    'present_with' => ':attribute es obligatorio cuando :values está presente.',
    'present_with_all' => ':attribute es obligatorio cuando :values están presentes.',
    'prohibited' => ':attribute está prohibido.',
    'prohibited_if' => ':attribute está prohibido cuando :other es :value.',
    'prohibited_if_accepted' => ':attribute está prohibido cuando :other es aceptado.',
    'prohibited_if_declined' => ':attribute está prohibido cuando :other es rechazado.',
    'prohibited_unless' => ':attribute está prohibido a menos que :other esté en :values.',
    'prohibits' => ':attribute prohíbe que :other esté presente.',
    'regex' => 'El formato de :attribute no es válido.',
    'required' => 'Por favor ingresa :attribute.',
    'required_array_keys' => ':attribute debe contener entradas para: :values.',
    'required_if' => ':attribute es obligatorio cuando :other es :value.',
    'required_if_accepted' => ':attribute es obligatorio cuando :other es aceptado.',
    'required_if_declined' => ':attribute es obligatorio cuando :other es rechazado.',
    'required_unless' => ':attribute es obligatorio a menos que :other esté en :values.',
    'required_with' => ':attribute es obligatorio cuando :values está presente.',
    'required_with_all' => ':attribute es obligatorio cuando :values están presentes.',
    'required_without' => ':attribute es obligatorio cuando :values no está presente.',
    'required_without_all' => ':attribute es obligatorio cuando ninguno de :values está presente.',
    'same' => ':attribute y :other deben coincidir.',
    'size' => [
        'array' => ':attribute debe contener :size elementos.',
        'file' => ':attribute debe pesar :size kilobytes.',
        'numeric' => ':attribute debe ser :size.',
        'string' => ':attribute debe tener :size caracteres.',
    ],
    'starts_with' => ':attribute debe comenzar con: :values.',
    'string' => ':attribute debe ser texto.',
    'timezone' => ':attribute debe ser una zona horaria válida.',
    'unique' => ':attribute ya está en uso.',
    'uploaded' => 'No se pudo subir :attribute.',
    'uppercase' => ':attribute debe estar en mayúsculas.',
    'url' => ':attribute debe ser una URL válida.',
    'ulid' => ':attribute debe ser un ULID válido.',
    'uuid' => ':attribute debe ser un UUID válido.',

    /*
    |--------------------------------------------------------------------------
    | Mensajes a la medida — específicos por campo
    |--------------------------------------------------------------------------
    |
    | Cuando un mensaje genérico no alcanza, usá `custom.{campo}.{regla}`.
    | Ej: el RUT necesita un mensaje específico cuando falla la regla `Rut`.
    |
    */

    'custom' => [
        'privacidad' => [
            'accepted' => 'Debes aceptar la política de privacidad para continuar.',
        ],
        'email' => [
            'email' => 'Ingresa un correo electrónico válido.',
        ],
        'correo' => [
            'email' => 'Ingresa un correo electrónico válido.',
        ],
        'rut' => [
            'required' => 'Por favor ingresa tu RUT.',
        ],
        'hora' => [
            'required' => 'Selecciona la hora de tu reserva.',
        ],
        'fecha' => [
            'required' => 'Selecciona la fecha.',
            'date' => 'La fecha no es válida.',
        ],
        'taller' => [
            'required' => 'Selecciona el taller donde quieres agendar.',
        ],
        'servicio' => [
            'required' => 'Selecciona el servicio que necesitas.',
        ],
        'sucursal' => [
            'required' => 'Selecciona una sucursal.',
        ],
        'asunto' => [
            'required' => 'Selecciona el asunto de tu mensaje.',
        ],
        'lista_repuestos' => [
            'required' => 'Indica al menos un repuesto.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Nombres amables de los campos
    |--------------------------------------------------------------------------
    |
    | Acá traducimos `nombre_del_campo` (snake_case del request) a la versión
    | "humana" que aparece en los mensajes. Los mensajes están redactados para
    | que combinen naturalmente con estos nombres ("Por favor ingresa :attribute"
    | + "tu nombre" = "Por favor ingresa tu nombre").
    |
    */

    'attributes' => [
        'nombre' => 'tu nombre',
        'email' => 'tu correo electrónico',
        'correo' => 'tu correo electrónico',
        'telefono' => 'tu teléfono',
        'rut' => 'tu RUT',
        'mensaje' => 'tu mensaje',
        'comentarios' => 'los comentarios',
        'comentario' => 'el comentario',
        'asunto' => 'el asunto',
        'sucursal' => 'la sucursal',
        'taller' => 'el taller',
        'servicio' => 'el servicio',
        'fecha' => 'la fecha',
        'hora' => 'la hora',
        'modelo' => 'el modelo',
        'anio' => 'el año',
        'patente' => 'la patente',
        'vehiculo' => 'el vehículo',
        'vehicle_id' => 'el vehículo',
        'version_id' => 'la versión',
        'branch_id' => 'la sucursal',
        'tipo' => 'el tipo',
        'duracion' => 'la duración',
        'duracion_tipo' => 'el tipo de duración',
        'marca' => 'la marca',
        'vin' => 'el VIN',
        'lista_repuestos' => 'la lista de repuestos',
        'privacidad' => 'la política de privacidad',
        'file' => 'el archivo',
        'image' => 'la imagen',
    ],

];
