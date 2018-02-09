<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/2/9
 * Time: 15:18
 */
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Mongodb;

class MongoController extends Controller
{
    public function index()
    {
        $users = Mongodb::connectionMongodb('hwd');

        #添加一条数据 ture 添加成功
        //dd($users->insert(['title' => 'email', 'content' => 'john@example.com','time' => time()]));

        #添加多条数据 ture 添加成功
        //dd($users->insert([['title' => 'email', 'content' => 'john@example.com','time' => time()],['title' => 'title1', 'content' => 'lichuang@example.com','time' => time()],['title' => 'title2', 'content' => 'lili@example.com','time' => time()]]));

        #修改一条数据 0 修改成功
        //dd($users->where('title', 'new2')->update(['content' => 'lichuang']));

        #删除一条数据 1 为删除成功
        //dd($users->where('title', 'new1')->delete());

        #删除集合所有数据 返回几删除几条
        //dd($users->delete());

        #查询集合所有数据
        //dd($users->get());

        #按条件查询
        //dd($users->where('title', 'title1')->get());

        #模糊查询
        dd($users->where('title', 'like', 'ti%')->get());
        #按条件排序
        //dd($users->orderBy('time', 'desc')->get());
    }
}