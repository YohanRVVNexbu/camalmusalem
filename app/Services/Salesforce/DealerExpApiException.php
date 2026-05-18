<?php

namespace App\Services\Salesforce;

use RuntimeException;

class DealerExpApiException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly int $httpStatus = 0,
        public readonly ?array $responseBody = null,
        public readonly bool $retryable = true,
    ) {
        parent::__construct($message, $httpStatus);
    }
}
