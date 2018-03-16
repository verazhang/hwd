<?php
/**
 * Exam manager
 * User: Vera
 * Date: 2018/3/12
 * Time: 下午1:02
 */

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamContent;
use App\Models\ExamResult;

class ExamController extends Controller
{
    public function addContent()
    {
        $items = ['type', 'title', 'content', 'options', 'option'];
        $values = [];
        foreach ($items as $param) {
            $values[$param] = request($param);
        }

        $values['status'] = ExamContent::STATUS_CREATE;
        //@todo
        $values['user_id'] = 0;
        $model = new ExamContent();

        $model->setRawAttributes($values);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function editContent($content_id)
    {
        $model = ExamContent::where(['_id'=>$content_id])->first();
        $items = ['type', 'title', 'content', 'options', 'option', 'status'];
        $values = [];
        foreach ($items as $param) {
            $item = request($param);
            if ($item) {
                $values[$param] = $item;
            }
        }

        $model->setRawAttributes($values);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function deleteContent($content_id)
    {
        $model = ExamContent::where(['_id'=>$content_id])->first();
        $result = $model->delete();
        return $this->getBoolResult($result);
    }

    public function getContent()
    {
        $result = ExamContent::get();
        return $this->resultJson(self::STATUS_SUCCESS, $result);
    }

    public function add()
    {
        $items = ['title', 'question', 'examtime', 'delay', 'duration', 'fraction', 'testcnt', 'viewcnt'];
        $values = [];
        foreach ($items as $param) {
            $values[$param] = request($param);
        }
        $values['delay'] = $values['delay'] ? $values['delay'] : 0;
        $values['viewcnt'] = $values['viewcnt'] ? $values['viewcnt'] : 0;

        $values['status'] = Exam::STATUS_NOT_START;
        //@todo
        $values['user_id'] = 0;
        $model = new Exam();
        $model->setRawAttributes($values);
        $result = $model->save();

        return $this->getBoolResult($result);
    }

    public function edit($exam_id)
    {
        $model = Exam::where(['_id'=>$exam_id])->first();
        $items = ['title', 'question', 'examtime', 'delay', 'duration'];
        $values = [];
        foreach ($items as $param) {
            $item = request($param);
            if ($item) {
                $values[$param] = $item;
            }
        }

        $model->setRawAttributes($values);
        $result = $model->save();
        return $this->getBoolResult($result);
    }

    public function delete($exam_id)
    {
        $model = Exam::where(['_id'=>$exam_id])->first();
        $result = $model->delete();
        return $this->getBoolResult($result);
    }

    public function get()
    {
        $result = Exam::get();
        return $this->resultJson(self::STATUS_SUCCESS, $result);
    }

    public function addResult()
    {
        $items = ['exampaperid', 'fraction', 'question', 'start_time', 'end_time'];
        $values = [];
        foreach ($items as $param) {
            $values[$param] = request($param);
        }

        $values['status'] = Exam::STATUS_END;
        //@todo
        $values['user_id'] = 0;
        $model = new ExamResult();
        $model->setRawAttributes($values);
        $result = $model->save();

        return $this->getBoolResult($result);
    }

    public function getResult($user_id = 0)
    {
        $model = new ExamResult();

        if ($user_id) {
            $model = $model->where(["user_id"=>$user_id]);
        }
        $result = $model->get();
        return $this->resultJson(self::STATUS_SUCCESS, $result);
    }
}