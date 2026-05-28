<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Job;

class ApplicationController extends Controller
{
    public function apply(Request $request, $jobId)
    {
        $user = $request->user();
        
        // Find the job
        $job = Job::find($jobId);
        if (!$job) {
            return response()->json(['message' => 'Job posting not found.'], 404);
        }
        
        // Check if already applied
        $existing = Application::where('user_id', $user->_id)
                               ->where('job_id', $jobId)
                               ->first();
        if ($existing) {
            return response()->json(['message' => 'You have already applied to this job.'], 400);
        }
        
        // Create the application
        $application = Application::create([
            'user_id' => $user->_id,
            'job_id' => $jobId,
            'status' => 'applied',
        ]);

        // Generate an admin alert for the application
        \App\Models\Notification::create([
            'type' => 'new_application',
            'message' => 'New application for "' . $job->title . '" submitted by ' . $user->name,
            'is_read' => false,
        ]);
        
        return response()->json([
            'message' => 'Application submitted successfully!',
            'application' => $application
        ], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $applications = Application::where('user_id', $user->_id)->get();
        
        // Fetch job details
        $jobIds = $applications->pluck('job_id')->toArray();
        $jobs = Job::whereIn('_id', $jobIds)->get()->keyBy(function ($job) {
            return (string) $job->_id;
        });
        
        $result = $applications->map(function($app) use ($jobs) {
            $job = $jobs[(string) $app->job_id] ?? null;
            return [
                'id' => $app->_id,
                'job_id' => (string) $app->job_id,
                'status' => $app->status,
                'created_at' => $app->created_at,
                'job' => $job
            ];
        });
        
        return response()->json($result);
    }
}
