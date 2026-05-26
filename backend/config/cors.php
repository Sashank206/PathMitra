<?php

return [

    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://path-mitra.vercel.app',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];