<?php

namespace App\Services\CatalogImport;

class ImportResult
{
    public int $created = 0;
    public int $updated = 0;
    public array $errors = [];

    public function addError(int $row, string $message): void
    {
        $this->errors[] = "Fila {$row}: {$message}";
    }

    public function hasErrors(): bool
    {
        return count($this->errors) > 0;
    }

    public function toFlashMessage(): string
    {
        $msg = "Importación completada: {$this->created} creados, {$this->updated} actualizados.";
        if ($this->hasErrors()) {
            $msg .= ' '.count($this->errors).' filas con errores: '.implode(' | ', array_slice($this->errors, 0, 5));
        }

        return $msg;
    }
}
