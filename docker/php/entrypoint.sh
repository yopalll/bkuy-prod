#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# Shared entrypoint for every PHP container (app, queue, scheduler, reverb).
# Runs as root so it can fix volume permissions, then drops to www-data.
# ---------------------------------------------------------------------------

# Ensure runtime directories exist inside the (possibly empty) storage volume.
mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Only the primary "app" container runs migrations & one-time setup.
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "[entrypoint] Waiting for database ${DB_HOST}:${DB_PORT:-3306} ..."
    until php -r '
        $h = getenv("DB_HOST"); $p = getenv("DB_PORT") ?: 3306;
        $u = getenv("DB_USERNAME"); $pw = getenv("DB_PASSWORD");
        try { new PDO("mysql:host=$h;port=$p", $u, $pw); exit(0); }
        catch (Throwable $e) { exit(1); }
    ' 2>/dev/null; do
        sleep 2
    done
    echo "[entrypoint] Database is up — migrating."
    gosu www-data php artisan migrate --force
    gosu www-data php artisan storage:link 2>/dev/null || true
fi

# (Re)build framework caches for this container.
gosu www-data php artisan config:cache
gosu www-data php artisan view:cache
gosu www-data php artisan route:cache || gosu www-data php artisan route:clear

echo "[entrypoint] Starting: $*"
# php-fpm must start as root to open log fds, then drops to www-data via pool config.
if [ "$(basename "$1")" = "php-fpm" ]; then
    exec "$@"
else
    exec gosu www-data "$@"
fi
