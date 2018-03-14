<?php
/**
 * unit manager
 * User: Vera
 * Date: 2018/3/14
 * Time: 22:51
 */
namespace App\Http\Controllers;

use App\Models\Unit;

class UnitController extends Controller
{
    public function add()
    {
        $unitid = request('unitid');
        $unitname = request('unitname');
        $upunitid = request('upunitid', 0);
        $values = [
            'unitid' => $unitid,
            'unitname' => $unitname,
            'upunitid' => (int)$upunitid
            ];
        $model = new Unit();
        $model->setRawAttributes($values);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function edit($unit_id)
    {
        $unitname = request('unitname');
        $model = Unit::where(["unitid"=>$unit_id])->first();
        $model->setAttribute("unitname", $unitname);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function delete($unitid)
    {
        $model = Unit::where(["unitid"=>$unitid])->first();
        $result = $model->delete();
        return $this->getBoolResult($result);
    }

    public function get()
    {
        $source = new Unit();
        $parents = $source->where(["upunitid"=>0]);

        $result = $this->addNode($source, $parents->get());

        return $this->resultJson(self::STATUS_SUCCESS, $result);
    }

    private function addNode($source, $collection)
    {
        $rows = [];
        foreach ($collection as $col) {
            $unitid = $col->unitid;
            $children = $this->addNode($source, $source->where(["upunitid"=>$unitid])->get());
            $rows[] = ["_id" => $col->_id, "upunitid"=>$col->upunitid, "title" => $col->unitname, "unitid" => $unitid, "children" => $children];
        }
        return $rows;
    }
}