<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role
        ]);

        // Generate an admin alert for the registration
        \App\Models\Notification::create([
            'type' => 'user_registered',
            'message' => 'New user registered: ' . $user->name . ' (' . $user->email . ')',
            'is_read' => false,
        ]);

        event(new Registered($user));

        return response()->json([
            'message' => 'Registration successful. Please check your email for verification link.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->hasVerifiedEmail()) {
            // Send verification link again when login is blocked by unverified email
            $user->sendEmailVerificationNotification();

            return response()->json([
                'message' => 'Your email address is not verified. A new verification link has been sent.',
                'unverified' => true
            ], 403);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|max:20',
            'location' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $user->update([
            'phone_number' => $request->phone_number,
            'location' => $request->location,
        ]);

        // In a real application, you would integrate Twilio or an SMS gateway here
        // For now, we simulate OTP sending.
        return response()->json([
            'message' => 'OTP sent successfully to ' . $request->phone_number,
            'mock_otp' => '123456' // Just for development
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        // Simulated check
        if ($request->otp !== '123456') {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        $user = $request->user();
        $user->update([
            'phone_verified_at' => now()
        ]);

        return response()->json([
            'message' => 'Phone verified successfully',
            'user' => $user
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['message' => __($status)])
                    : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(\Illuminate\Support\Str::random(60));

                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
                    ? response()->json(['message' => __($status)])
                    : response()->json(['message' => __($status)], 400);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json(['message' => 'Email successfully verified.']);
    }

    public function resendVerificationEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent!']);
    }
}
