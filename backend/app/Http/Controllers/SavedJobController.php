<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedJob;
use App\Models\Job;

class SavedJobController extends Controller
{
    public function save(Request $request, $jobId)
    {
        $user = $request->user();
        
        // Find job
        $job = Job::find($jobId);
        if (!$job) {
            return response()->json(['message' => 'Job posting not found.'], 404);
        }
        
        // Check if already saved
        $existing = SavedJob::where('user_id', $user->_id)
                            ->where('job_id', $jobId)
                            ->first();
        if ($existing) {
            return response()->json(['message' => 'You have already saved this job.'], 400);
        }
        
        // Save the job
        $savedJob = SavedJob::create([
            'user_id' => $user->_id,
            'job_id' => $jobId,
        ]);
        
        return response()->json([
            'message' => 'Job saved successfully!',
            'saved_job' => $savedJob
        ], 201);
    }

    public function unsave(Request $request, $jobId)
    {
        $user = $request->user();
        
        $saved = SavedJob::where('user_id', $user->_id)
                         ->where('job_id', $jobId)
                         ->first();
        if (!$saved) {
            return response()->json(['message' => 'Saved job not found.'], 404);
        }
        
        $saved->delete();
        
        return response()->json(['message' => 'Job unsaved successfully!']);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $savedJobs = SavedJob::where('user_id', $user->_id)->get();
        
        // Fetch job details
        $jobIds = $savedJobs->pluck('job_id')->toArray();
        $jobs = Job::whereIn('_id', $jobIds)->get();
        
        return response()->json($jobs);
    }
}
