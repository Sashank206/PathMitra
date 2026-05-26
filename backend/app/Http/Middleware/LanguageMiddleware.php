<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class LanguageMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $lang = $request->header('Accept-Language');
        
        // Ensure language is one of our supported ones, default to 'en'
        $supported = ['en', 'hi', 'pa'];
        
        if ($lang && in_array($lang, $supported)) {
            App::setLocale($lang);
        } else {
            App::setLocale('en');
        }

        return $next($request);
    }
}
