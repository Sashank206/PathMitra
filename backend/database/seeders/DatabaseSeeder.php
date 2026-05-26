<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Job;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function down(): void
    {
        // ...
    }

    public function run(): void
    {
        // Create an admin user
        User::create([
            'name'              => 'Admin User',
            'email'             => 'admin@pathmitra.com',
            'password'          => Hash::make('password'),
            'role'              => 'admin',
            'phone_number'      => '+91 00000 00000',
            'location'          => 'Path Mitra HQ, India',
            'phone_verified_at' => now(),
        ]);

        // Create some dummy jobs
        $jobs = [
            [
                'title' => 'Software Engineer',
                'description' => 'Develop and maintain web applications using React and Laravel. Join our fast-paced startup environment.',
                'company' => 'Tech Solutions Inc.',
                'location' => 'Bangalore, India',
                'type' => 'Full-time',
                'category' => 'private',
                'salary_range' => '₹8,00,000 - ₹12,00,000',
                'deadline' => '2026-12-31',
            ],
            [
                'title' => 'Data Analyst',
                'description' => 'Analyze public data and generate reports for policy making. Requires expertise in Python and SQL.',
                'company' => 'Ministry of Information Technology',
                'location' => 'New Delhi, India',
                'type' => 'Full-time',
                'category' => 'govt',
                'salary_range' => '₹6,00,000 - ₹9,00,000',
                'deadline' => '2026-08-15',
            ],
            [
                'title' => 'Web Developer',
                'description' => 'Looking for a freelance web developer for various e-commerce projects on contract basis.',
                'company' => 'Self Employed Network',
                'location' => 'Remote',
                'type' => 'Contract',
                'category' => 'self-employment',
                'salary_range' => '₹40,000/month',
                'deadline' => '2026-07-01',
            ],
            [
                'title' => 'Senior Frontend Developer',
                'description' => 'Lead the frontend team for our new flagship product. Must have 5+ years of React experience.',
                'company' => 'Global Tech LLC',
                'location' => 'London, UK (Visa Sponsorship)',
                'type' => 'Full-time',
                'category' => 'foreign',
                'salary_range' => '£60,000 - £80,000',
                'deadline' => '2026-10-01',
            ],
            [
                'title' => 'Railway Protection Force (Constable)',
                'description' => 'Official recruitment for RPF Constable. Requires physical fitness and a passing score in the CBT.',
                'company' => 'Indian Railways',
                'location' => 'All India',
                'type' => 'Full-time',
                'category' => 'govt',
                'salary_range' => '₹21,700 - ₹69,100',
                'deadline' => '2026-09-30',
            ],
            [
                'title' => 'Cyber Security Specialist',
                'description' => 'Protect the financial assets of one of the largest private banks in India from cyber threats.',
                'company' => 'HDFC Bank',
                'location' => 'Mumbai, India',
                'type' => 'Full-time',
                'category' => 'private',
                'salary_range' => '₹14,00,000 - ₹20,00,000',
                'deadline' => '2026-11-20',
            ],
            [
                'title' => 'Plumbing Contractor Program',
                'description' => 'Government sponsored self-employment scheme offering equipment and startup funds for plumbers.',
                'company' => 'Skill India Mission',
                'location' => 'Maharashtra, India',
                'type' => 'Self-Employed',
                'category' => 'self-employment',
                'salary_range' => 'Funding up to ₹2,00,000',
                'deadline' => '2026-12-01',
            ],
            [
                'title' => 'Registered Nurse (RN)',
                'description' => 'Urgently hiring certified nurses for top hospitals in the Middle East. Accommodation provided.',
                'company' => 'Dubai Health Authority',
                'location' => 'Dubai, UAE',
                'type' => 'Full-time',
                'category' => 'foreign',
                'salary_range' => 'AED 8,000 - 12,000/month',
                'deadline' => '2026-08-30',
            ],
            [
                'title' => 'Probationary Officer (PO)',
                'description' => 'Direct recruitment for SBI Probationary Officers. Must be a graduate from a recognized university.',
                'company' => 'State Bank of India',
                'location' => 'All India',
                'type' => 'Full-time',
                'category' => 'govt',
                'salary_range' => '₹41,960 - ₹63,840',
                'deadline' => '2026-07-25',
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'Design user-centric interfaces and beautiful mobile apps. Figma expertise is mandatory.',
                'company' => 'DesignStudio Pro',
                'location' => 'Remote / Pune',
                'type' => 'Full-time',
                'category' => 'private',
                'salary_range' => '₹7,00,000 - ₹10,00,000',
                'deadline' => '2026-10-15',
            ],
            [
                'title' => 'Graphic Design Freelancer',
                'description' => 'Join our roster of creative freelancers to take on branding and marketing projects.',
                'company' => 'Creative Hub',
                'location' => 'Remote',
                'type' => 'Contract',
                'category' => 'self-employment',
                'salary_range' => 'Project-based (₹10k-50k/project)',
                'deadline' => '2026-12-31',
            ],
            [
                'title' => 'AI Research Scientist',
                'description' => 'Research cutting-edge AI models for natural language processing and computer vision.',
                'company' => 'OpenTech Foundation',
                'location' => 'Toronto, Canada',
                'type' => 'Full-time',
                'category' => 'foreign',
                'salary_range' => 'CAD 120,000 - 160,000',
                'deadline' => '2026-11-01',
            ]
        ];

        foreach ($jobs as $job) {
            Job::create($job);
        }
    }
}
