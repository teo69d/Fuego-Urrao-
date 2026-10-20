# Fuego Urrao

## Configurar el acceso administrativo en XAMPP

1. Copia `admin_config.example.php` como `admin_config.php` en esta carpeta. Ese archivo está excluido de Git.
2. Genera un hash para una contraseña nueva y fuerte desde PowerShell:

   ```powershell
   & 'C:\xampp\php\php.exe' -r "echo password_hash('ESCRIBE_AQUI_TU_NUEVA_CLAVE', PASSWORD_DEFAULT), PHP_EOL;"
   ```

3. En `admin_config.php`, cambia `usuario` y reemplaza `hash_contrasena` por el resultado del comando. No subas ese archivo al repositorio.
4. Inicia el proyecto desde Apache en XAMPP. Las operaciones administrativas solo funcionan después de iniciar sesión y la sesión vence tras 30 minutos de inactividad.

No reutilices la contraseña que estaba escrita en el JavaScript; cámbiala si la usabas en otro lugar.
