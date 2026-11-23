# Cuentas Luma con Supabase

Luma ya incluye la interfaz de **inicio de sesión**, **registro** y **sincronización del progreso**. Solo falta conectar tu proyecto de Supabase.

## 1. Crear el proyecto

1. Entra en https://supabase.com y crea un proyecto gratuito.
2. Ve a **Project Settings → API** y copia:
   - **Project URL** (parece `https://xxxx.supabase.co`)
   - **anon / public key** (empieza por `eyJ…`)

La clave anónima es pública por diseño: Luma la necesita en el navegador. **Nunca pegues la clave `service_role`.**

## 2. Activar correo y contraseña

1. Ve a **Authentication → Providers** y asegúrate de que **Email** esté activado.
2. Si quieres que la cuenta se use sin confirmar el correo, desactiva **Confirm email** en *Authentication → Settings*. Si lo dejas activado, el usuario deberá confirmar su correo la primera vez.
3. En **URL Configuration**, añade como Site URL y Redirect URL:

```
https://eduerking-crypto.github.io/luma-web/
```

## 3. Crear la tabla de progreso

Pega esto en **SQL Editor → New query** y ejecútalo:

```sql
create table if not exists public.luma_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.luma_profiles enable row level security;

create policy "Perfil propio: leer"
  on public.luma_profiles for select
  using (auth.uid() = id);

create policy "Perfil propio: crear"
  on public.luma_profiles for insert
  with check (auth.uid() = id);

create policy "Perfil propio: actualizar"
  on public.luma_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

Si las políticas ya existen de una prueba anterior, usa `drop policy ...` antes de volver a crearlas.

## 4. Conectar Luma

Tienes dos formas:

- **Desde la app (recomendado):** abre Luma → Configuración → Mi cuenta → pega la URL y la clave anónima → **Guardar configuración**.
- **En el código:** edita `auth-config.js` y rellena `url` y `anonKey`, luego vuelve a publicar.

Después ya puedes crear tu cuenta desde el onboarding o desde Configuración → Mi cuenta.

## 5. Qué se sincroniza

Al iniciar sesión, Luma descarga tu progreso guardado (nivel, disciplina, racha, actividades completadas, ajustes) y lo combina con el progreso local. Cada cambio se sube automáticamente unos segundos después.

Tus **borradores de escritura** se guardan en este dispositivo y se separan por correo, así que cada cuenta ve solamente sus propios textos. Si cierras sesión, la app sigue funcionando sin conexión con el progreso local de ese dispositivo.

## Solución de problemas

- **«Falta la configuración de Supabase»**: revisa la URL y la clave en Configuración → Mi cuenta.
- **«Correo o contraseña incorrectos»**: comprueba las credenciales o usa *¿Olvidaste tu contraseña?*.
- **«Confirma tu correo antes de entrar»**: abre el correo de confirmación o desactiva *Confirm email* en Supabase.
- **No sincroniza**: comprueba que la tabla `luma_profiles` exista y que las políticas RLS permitan leer y escribir tu propio `id`.
