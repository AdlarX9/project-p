<?php

namespace App\Message;

class CacheMessage
{
    private $key;
    private $data;

    public function __construct(string $key, $data)
    {
        $this->key = $key;
        $this->data = $data;
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function getData()
    {
        return $this->data;
    }
}