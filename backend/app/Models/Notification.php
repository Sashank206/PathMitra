<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'message',
        'is_read',
    ];
}
