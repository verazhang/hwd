<?php
/**
 * document manager
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Document;
use App\DocumentContent;
use App\Type;

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
        return $result ? $result->toJson() : [];
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
