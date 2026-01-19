// app/Http/Middleware/RedirectIfAuthenticated.php

public function handle(Request $request, Closure $next, string ...$guards): Response
{
    $guards = empty($guards) ? [null] : $guards;

    foreach ($guards as $guard) {
        if (Auth::guard($guard)->check()) {
            // Pengalihan standar setelah login
            $user = Auth::user();
            if ($user->role === 'admin') {
                return redirect(route('dashboard.home'));
            }
            if ($user->role === 'pengawas') {
                return redirect(route('pengawas.index'));
            }
            if ($user->role === 'ruang') {
                return redirect(route('ruang.welcome'));
            }

            // Fallback default
            return redirect('/');
        }
    }

    return $next($request);
}