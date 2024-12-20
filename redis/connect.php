<?php

$redis = new Redis();
$port = 6379;
//Connecting to Redis
$redis->connect('localhost', $port);

if ($redis->ping()) {
 echo "PONG";
}
