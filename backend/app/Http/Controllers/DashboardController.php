<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Models\Notification;
use App\Models\SavedJob;

class DashboardController extends Controller
{
    public function adminStats(Request $request)
    {
        // Require admin role
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalUsers = User::count();
        $activeJobs = Job::count();
        $newApplications = Application::count();
        $systemAlerts = Notification::where('is_read', false)->count();

        // Get recent activity by fetching latest from each collection and merging
        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get()->map(function($item) {
            return [
                'type' => 'user',
                'role' => 'New User Registered',
                'company' => $item->email,
                'date' => $item->created_at ? $item->created_at->diffForHumans() : 'Recently',
                'timestamp' => $item->created_at ? $item->created_at->timestamp : 0,
                'status' => 'Success',
                'color' => 'emerald'
            ];
        });

        $recentJobs = Job::orderBy('created_at', 'desc')->take(5)->get()->map(function($item) {
            return [
                'type' => 'job',
                'role' => 'Job Posted',
                'company' => $item->company ?? 'Unknown',
                'date' => $item->created_at ? $item->created_at->diffForHumans() : 'Recently',
                'timestamp' => $item->created_at ? $item->created_at->timestamp : 0,
                'status' => 'Active',
                'color' => 'blue'
            ];
        });

        $recentAppsRaw = Application::orderBy('created_at', 'desc')->take(5)->get();
        $userIds = $recentAppsRaw->pluck('user_id')->toArray();
        $users = User::whereIn('_id', $userIds)->get()->keyBy(function ($u) {
            return (string) $u->_id;
        });

        $recentApps = $recentAppsRaw->map(function($item) use ($users) {
            $userObj = $users[(string) $item->user_id] ?? null;
            $userName = $userObj ? $userObj->name : 'Unknown User';

            return [
                'type' => 'application',
                'role' => 'New Application',
                'company' => $userName,
                'date' => $item->created_at ? $item->created_at->diffForHumans() : 'Recently',
                'timestamp' => $item->created_at ? $item->created_at->timestamp : 0,
                'status' => ucfirst($item->status ?? 'Pending'),
                'color' => 'purple'
            ];
        })->toArray();

        $recentActivity = collect([...$recentUsers, ...$recentJobs, ...$recentApps])
            ->sortByDesc('timestamp')
            ->take(5)
            ->values();

        return response()->json([
            'stats' => [
                'Total Users' => $totalUsers,
                'Active Jobs' => $activeJobs,
                'New Applications' => $newApplications,
                'System Alerts' => $systemAlerts,
            ],
            'recentActivity' => $recentActivity
        ]);
    }

    public function userStats(Request $request)
    {
        $user = $request->user();

        $appliedJobsCount = Application::where('user_id', $user->_id)->count();
        $savedJobsCount = SavedJob::where('user_id', $user->_id)->count();
        $alertsCount = Notification::where('user_id', $user->_id)->count();
        $profileViews = 0; // Mock stat for now

        $recentApps = Application::where('user_id', $user->_id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $jobIds = $recentApps->pluck('job_id')->toArray();
        $jobs = Job::whereIn('_id', $jobIds)->get()->keyBy('_id');

        $recentActivity = $recentApps->map(function($app) use ($jobs) {
            $job = $jobs[$app->job_id] ?? null;
            $color = match($app->status) {
                'accepted' => 'emerald',
                'rejected' => 'red',
                default => 'blue'
            };
            
            return [
                'role' => $job ? $job->title : 'Unknown Role',
                'company' => $job ? $job->company : 'Unknown Company',
                'date' => $app->created_at ? $app->created_at->format('M d, Y') : 'Recently',
                'status' => ucfirst($app->status ?? 'In Review'),
                'color' => $color
            ];
        });

        return response()->json([
            'stats' => [
                'Applied Jobs' => $appliedJobsCount,
                'Saved Jobs' => $savedJobsCount,
                'Profile Views' => $profileViews,
                'Interviews' => $alertsCount,
            ],
            'recentActivity' => $recentActivity
        ]);
    }
}
