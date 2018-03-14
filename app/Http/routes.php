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
Route::get('mongo','MongoController@index');
Route::get('test','ProductController@test');
Route::get('product','ProductController@index');
Route::get('product/add','ProductController@add');
Route::get('product/remove/{code}','ProductController@remove');

Route::get('document/get/{docid}', 'DocumentController@get');
Route::get('document/content/{contentid}', 'DocumentController@getContent');
Route::get('document/type', 'DocumentController@getTypeList');
Route::get('document/search', 'DocumentController@search');
