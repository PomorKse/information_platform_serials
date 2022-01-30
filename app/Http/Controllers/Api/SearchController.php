<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Http\Resources\SerialResource;
use App\Models\Serial;


class SearchController extends Controller
{
    public function search($search)
    {
        //$input = $request->validated()['query'];
        $search = Serial::where('title', 'LIKE', "%{$search}%")->get()->sortByDesc('rate');
        return SerialResource::collection($search);
    }
}
