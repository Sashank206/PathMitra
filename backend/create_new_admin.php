<?php
$user = \App\Models\User::where('email', 'admin@pathmitra')->first();
if (!$user) {
    \App\Models\User::create([
        'name' => 'Admin',
        'email' => 'admin@pathmitra',
        'password' => \Illuminate\Support\Facades\Hash::make('1234'),
        'role' => 'admin'
    ]);
    echo "Admin user created successfully.\n";
} else {
    // If it exists, update the password just in case
    $user->password = \Illuminate\Support\Facades\Hash::make('1234');
    $user->save();
    echo "Admin user already exists. Password updated.\n";
}
