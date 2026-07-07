<?php

namespace App\Services\CatalogImport;

class ImportResult
{
    public int $created = 0;
    public int $updated = 0;
    // Versiones nuevas que ya estaban ignoradas de un mes anterior — se
    // saltaron sin tocar la BD ni volver a preguntar.
    public int $ignored = 0;
    // Versiones nuevas que el cliente destildó en ESTE import — recién
    // quedaron guardadas en ignored_price_list_materials.
    public int $newlyIgnored = 0;
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
        if ($this->newlyIgnored > 0) {
            $msg .= " {$this->newlyIgnored} versiones nuevas quedaron marcadas como ignoradas (no se crearon).";
        }
        if ($this->ignored > 0) {
            $msg .= " {$this->ignored} ya estaban ignoradas de meses anteriores.";
        }
        if ($this->hasErrors()) {
            $msg .= ' '.count($this->errors).' filas con errores: '.implode(' | ', array_slice($this->errors, 0, 5));
        }

        return $msg;
    }
}
