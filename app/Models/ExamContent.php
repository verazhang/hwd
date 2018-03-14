<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class ExamContent extends Model
{
    const TYPE_SINGLE = 1;
    const TYPE_MULTIPLE = 2;
    const TYPE_JUDGE = 3;
    const TYPE_QUESTION = 4;
    const STATUS_DELETE = 0;
    const STATUS_CREATE = 1;
    const STATUS_PUBLISH = 3;

    protected $table = "exam_content";
}
