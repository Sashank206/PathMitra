<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('company', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('location', 'like', "%{$keyword}%");
            });
        }

        return response()->json($query->latest()->paginate(12));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'salary_range' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
        ]);

        $job = Job::create($validated);
        return response()->json($job, 201);
    }

    public function show($id)
    {
        $job = Job::findOrFail($id);
        return response()->json($job);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'company' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:100',
            'category' => 'sometimes|string|max:100',
            'salary_range' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
        ]);

        $job->update($validated);
        return response()->json($job);
    }

    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();
        return response()->json(null, 204);
    }
}
