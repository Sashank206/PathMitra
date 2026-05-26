<?php
$user = \App\Models\User::where('email', 'admin@pathmitra.com')->first();

if (!$user) {
    \App\Models\User::create([
        'name' => 'Admin',
        'email' => 'admin@pathmitra.com',
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    echo "Admin user created successfully.\n";
} else {
    // If it exists, update the password just in case
    $user->password = \Illuminate\Support\Facades\Hash::make('password');
    $user->save();
    echo "Admin user already exists. Password updated.\n";
}
