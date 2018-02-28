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
    return view('welcome');
});
Route::get('mongo','MongoController@index');
Route::get('test','ProductController@test');
Route::get('product','ProductController@index');
Route::get('product/add','ProductController@add');
Route::get('product/remove/{code}','ProductController@remove');