<?php
/**
 * Created by PhpStorm.
 * User: Vera
 * Date: 2018/2/26
 * Time: 22:28
 */

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Mongodb;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $tableName = 'product';
    protected $dbSource = '';

    public function __construct()
    {
        $this->dbSource = Mongodb::connectionMongodb($this->tableName);
        return $this->dbSource;
    }

    public function test()
    {
        return view('product/test');
    }

    /**
     * search by product code
     */
    public function index(Request $request)
    {

        $code = $request->input('code');
        dd($this->search($code));
    }

    private function search($code = '')
    {
        $dbs = $this->dbSource;
        if ($code) {
            $dbs = $dbs->where('code', $code);
        }
        $result = $dbs->get();
        return $result;
    }

    /**
     * add an item
     * @param Request $request url request
     * @return true=add successfully; or false=add failed.
     */
    public function add(Request $request)
    {
        $code = $request->input('code');
        $page = $request->input('page');
        if (!$code || !$page) {
            return false;
        }

        $result = $this->dbSource->insert(['code'=>$code, 'page'=>$page, 'time'=>time()]);
        dd($result);
        return $result;
    }

    /**
     * delete item by code
     * @param string $method
     * @param array $parameters
     */
    public function remove($code)
    {
        if (!$code) {
            return false;
        }

        $result = $this->dbSource->where('code', $code)->delete();
        dd($result);
        return $result ? true : false;
    }

    /**
     * update an item
     * @todo
     * @param Request $request
     */
    public function update(Request $request)
    {
        $code = $request->input('code');
        $page = $request->input('page');
        if (!$code || !$page) {
            return false;
        }
        $result = $this->dbSource->where('code', $code)->update(['page'=>$page]);
        return $result;
    }
}