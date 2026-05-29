<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['signed:relative'])->name('verification.verify');
Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail'])->middleware(['throttle:6,1'])->name('verification.send');

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    
    // Dashboard Stats
    Route::get('/dashboard/admin', [\App\Http\Controllers\DashboardController::class, 'adminStats']);
    Route::get('/dashboard/user', [\App\Http\Controllers\DashboardController::class, 'userStats']);
    
    // Onboarding API
    Route::post('/onboarding/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/onboarding/verify-otp', [AuthController::class, 'verifyOtp']);
    
    // Protected Jobs API
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    
    // Job Actions: Save and Apply
    Route::post('/jobs/{id}/apply', [\App\Http\Controllers\ApplicationController::class, 'apply']);
    Route::get('/applications', [\App\Http\Controllers\ApplicationController::class, 'index']);
    
    Route::post('/jobs/{id}/save', [\App\Http\Controllers\SavedJobController::class, 'save']);
    Route::delete('/jobs/{id}/unsave', [\App\Http\Controllers\SavedJobController::class, 'unsave']);
    Route::get('/saved-jobs', [\App\Http\Controllers\SavedJobController::class, 'index']);

    // User Management (Admin)
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index']);
    Route::delete('/users/{id}', [\App\Http\Controllers\UserController::class, 'destroy']);
});
