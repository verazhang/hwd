<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class User extends Model
{
    const TYPE_NORMAL = "normal";
    const TYPE_TEACHER = "teacher";
    const ADMIN_YES = 1;
    const ADMIN_NO = 0;
    const STATUS_NORMAL = 0;
    const STATUS_DELETE = 1;
    const STATUS_LOCK = 2;
    const STATUS_LEAVE = 3;

    protected $table = "user";
}
