<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    public function privacy(): Response
    {
        return Inertia::render('Privacy');
    }

    public function terms(): Response
    {
        return Inertia::render('Terms');
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function aboutApp(): Response
    {
        return Inertia::render('AboutApp');
    }
}
