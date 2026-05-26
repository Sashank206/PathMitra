<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'user_id',
        'job_id',
        'status',
    ];
}
