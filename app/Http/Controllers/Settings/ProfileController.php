<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Menampilkan halaman edit profil.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Memperbarui informasi profil pengguna.
     * Mampu menangani: update nama, upload avatar baru, atau hapus avatar yang ada.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'], // max 2MB
            'remove_avatar' => ['nullable', 'boolean'],
        ]);

        try {
            $user->name = $validatedData['name'];

            // Prioritas 1: Cek jika user ingin menghapus avatar
            if ($request->boolean('remove_avatar')) {
                // Hapus file avatar lama dari storage jika ada
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                // Set kolom avatar di database menjadi null
                $user->avatar = null;
            } 
            // Prioritas 2: Jika tidak menghapus, cek jika ada upload avatar baru
            else if ($request->hasFile('avatar')) {
                $avatarFile = $request->file('avatar');
                
                // Hapus avatar lama dari storage jika ada
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                
                // Simpan avatar baru dan dapatkan path-nya
                $avatarPath = $avatarFile->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }
            // Jika tidak ada aksi terkait avatar, hanya nama yang akan diperbarui.

            $user->save();

            return redirect()->route('profile.edit')->with('status', 'Profile updated successfully');

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return redirect()->route('profile.edit')
                ->with('error', 'Failed to update profile.');
        }
    }
    
    /**
     * Menghapus akun pengguna.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        auth()->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->to('/')->with('status', 'Your account has been deleted.');
    }
}