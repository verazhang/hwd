<?php
/**
 * user manager
 * User: Vera
 * Date: 2018/3/15
 * Time: 00:15
 */
namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function add()
    {
        $items = ['unitid', 'username', 'type', 'isadmin', 'password'];
        $values = [];
        foreach ($items as $param) {
            $values[$param] = request($param);
        }

        $values['status'] = USER::STATUS_NORMAL;
        $values['isadmin'] = $values['isadmin'] ? $values['isadmin'] : User::ADMIN_NO;

        $model = new User();
        $model->setRawAttributes($values);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function edit($user_id)
    {
        $items = ['unitid', 'username', 'type', 'isadmin', 'password'];
        $values = [];
        foreach ($items as $param) {
            $item = request($param);
            if ($item) {
                $values[$param] = $item;
            }
        }

        $model = User::where(["_id"=>$user_id])->first();
        $model->setRawAttributes($values);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function delete($user_id)
    {
        $model = User::where(["_id"=>$user_id])->first();
        $result = $model->delete();
        return $this->getBoolResult($result);
    }

    public function get($unit_id = 0)
    {
        $model = new User();
        if ($unit_id) {
            $model = $model->where(["unitid" => $unit_id]);
        }
        $result = $model->get();

        return $this->resultJson($result);
    }
}