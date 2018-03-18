<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});
Route::get('/doc/{docid}', function () {
    return view('show');
});
Route::get('/examlist/{type}', function () {
    return view('examlist');
});
Route::get('/exam/{examid}', function () {
    return view('showexam');
});
Route::get('/examparti/{examid}', function () {
    return view('examparti');
});
Route::get('mongo','MongoController@index');
Route::get('test','ProductController@test');
Route::get('product','ProductController@index');
Route::get('product/add','ProductController@add');
Route::get('product/remove/{code}','ProductController@remove');

//知识查询、维护
Route::get('document/get/{docid}', 'DocumentController@get');
Route::post('document/add', 'DocumentController@add');
Route::get('document/content/{contentid}', 'DocumentController@getContent');
Route::get('document/type', 'DocumentController@getTypeList');
Route::get('document/search', 'DocumentController@search');

//题库管理
Route::post('examcontent/add', 'ExamController@addContent');
Route::post('examcontent/edit/{contentid}', 'ExamController@editContent');
Route::post('examcontent/delete/{contentid}', 'ExamController@deleteContent');
Route::get('examcontent/get', 'ExamController@getContent');
//试卷管理
Route::post('exam/add', 'ExamController@add');
Route::post('exam/edit/{examid}', 'ExamController@edit');
Route::post('exam/delete/{examid}', 'ExamController@delete');
Route::get('exam/get', 'ExamController@get');
//我的考试
Route::get('examresult/get/{user_id?}', 'ExamController@getResult');
Route::post('examresult/add', 'ExamController@addResult');
//单位管理
Route::post('unit/add', 'UnitController@add');
Route::post('unit/edit/{unitid}', 'UnitController@edit');
Route::post('unit/delete/{unitid}', 'UnitController@delete');
Route::get('unit/get', 'UnitController@get');
//用户管理
Route::post('user/add', 'UserController@add');
Route::post('user/edit/{userid}', 'UserController@edit');
Route::post('user/delete/{userid}', 'UserController@delete');
Route::get('user/get/{unitid?}', 'UserController@get');

Route::auth();

Route::get('/home', 'HomeController@index');
