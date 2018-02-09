<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/2/9
 * Time: 15:17
 */
namespace App;
use Mongo;
use DB;
class Mongodb extends Mongo
{
    public static function connectionMongodb($tables)
    {
        return $users = DB::connection('mongodb')->collection($tables);
    }
}
