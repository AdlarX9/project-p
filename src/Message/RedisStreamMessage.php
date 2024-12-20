<?php

namespace App\Message;

final class RedisStreamMessage
{
    /*
     * Add whatever properties and methods you need
     * to hold the data for this message class.
     */

    private $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function getData()
    {
        return $this->data;
    }
}
