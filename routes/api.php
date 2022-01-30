<?php

use App\Http\Controllers\Api\SortController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\SerialController;
use App\Http\Controllers\Api\Admin\GenreController as AdminGenreController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\Admin\SerialController as AdminSerialController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\ParserController;
use App\Http\Controllers\Api\Account\ProfileController;
use App\Http\Controllers\Api\Account\FavoriteController;
use App\Http\Controllers\Api\AuthController;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::apiResource('/favorites', FavoriteController::class);
    Route::put('/favorites/{serial}/status/{status}', [FavoriteController::class, 'addStatus']);
    Route::put('/favorites/{serial}/eval/{eval}', [FavoriteController::class, 'addEval']);
    Route::get('/profile', ProfileController::class);
    Route::post('serials/{serial}/favorite' , [SerialController::class, 'favorite']);
});

Route::apiResources([
    'serials' => SerialController::class,
    'genres' => GenreController::class
]);

Route::group(['prefix' => 'search'], function()
{
    Route::get('/{search?}', [SearchController::class, 'search']);
    Route::get('/year/{start?}/{number?}/{order?}', [SortController::class, 'year']);
    Route::get('/rate/{start?}/{number?}/{order?}', [SortController::class, 'rate']);
});

Route::group(['prefix' => 'admin', 'as' => 'admin.'], function()
{
    Route::apiResource('/users', AdminUserController::class);
    Route::apiResources([
        '/serials' => AdminSerialController::class,
        '/genres' => AdminGenreController::class
    ]);

    Route::group(['prefix' => '/parser'], function()
    {
        Route::get('/genres', [ParserController::class, 'genreParser']);
        Route::get('/serials', [ParserController::class, 'serialParser']);
    });

});

