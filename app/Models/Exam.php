<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Exam extends Model
{
    const STATUS_NOT_START = 0;
    const STATUS_ING = 1;
    const STATUS_END = 2;
    const STATUS_CANCEL = 3;

    protected $table = "exam";
}
