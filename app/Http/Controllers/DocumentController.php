<?php
/**
 * document manager
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Models\Document;
use App\Models\DocumentContent;
use App\Models\Type;

class DocumentController extends Controller
{
    /**
     * get document by id
     * @param $docid document id
     */
    public function get($docid)
    {
        $result = Document::where(['docid'=>$docid])->first();
        if (!$result) {
            return [];
        }
        return $result->toJson();
    }

    public function add()
    {
        $items = ['docid', 'proid', 'pro', 'nav', 'content'];
        $values = $content = [];
        foreach ($items as $param) {
            if ($param == "content") {
                $content = request($param);
            } else {
                $values[$param] = request($param);
            }
        }

        //@todo
        $values['user_id'] = 0;
        $model = new Document();

        $model->setRawAttributes($values);
        $result = $model->save();
        //add content
        if ($result) {
            $contentModel = new DocumentContent();
            $contentModel->setAttribute('docid', $model->_id);
            $contentModel->setAttribute('content', $content);
            $result = $contentModel->save();
            return $this->getBoolResult($result);
        } else {
            return $this->getBoolResult(false);
        }
    }

    /**
     * get document content by contentid
     * @param $contentid content id
     * @return array
     */
    public function getContent($contentid)
    {
        $result = DocumentContent::where(['_id'=>$contentid])->first();
        return $result ? $result->toJson() : [];
    }

    /**
     * get all the type
     * @return return key-value array(_id=>proname)
     */
    public function getTypeList()
    {
        $result = Type::get()->pluck("_id", "proname");
        return $this->resultJson(self::STATUS_SUCCESS, $result);
    }

    /**
     * search document content by keywords
     * @return document
     */
    public function search(Request $request)
    {
        $keywords = $request->input("keywords");
        //@todo search by content or document?
    }
}
