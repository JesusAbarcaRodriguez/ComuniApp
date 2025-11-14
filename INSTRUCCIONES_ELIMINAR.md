# Instrucciones para habilitar la eliminación de eventos y grupos

## Problema
Los botones de eliminar están implementados pero no funcionan porque **faltan las políticas RLS (Row Level Security)** en Supabase.

## Solución: Ejecutar el script SQL en Supabase

### Paso 1: Abrir Supabase Dashboard
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto **ComuniApp**

### Paso 2: Abrir SQL Editor
1. En el menú lateral izquierdo, haz clic en **SQL Editor**
2. Haz clic en el botón **"New query"** o **"+ New query"**

### Paso 3: Copiar y ejecutar el script
1. Abre el archivo `supabase_delete_policies.sql` que está en la raíz del proyecto
2. Copia **TODO** el contenido del archivo
3. Pega el contenido en el editor SQL de Supabase
4. Haz clic en el botón **"Run"** (esquina inferior derecha)

### Paso 4: Verificar que funcionó
Deberías ver un mensaje de éxito similar a:
```
Success. No rows returned
```

Si ves algún error, copia el mensaje y compártelo.

## ¿Qué hace este script?

El script crea dos políticas de seguridad:

1. **Política para eliminar eventos:**
   - Permite eliminar eventos si eres owner o admin del grupo

2. **Política para eliminar grupos:**
   - Permite eliminar grupos SOLO si eres el owner

## Verificación adicional

Después de ejecutar el script, verifica:

### 1. Verificar RLS está habilitado
En el SQL Editor, ejecuta:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('events', 'groups');
```

Ambas tablas deben mostrar `rowsecurity = true`

### 2. Verificar las políticas creadas
El mismo script incluye al final queries de verificación que muestran las políticas.

## ¿Sigue sin funcionar?

Si después de ejecutar el script los DELETE aún no funcionan:

1. **Revisa los logs de Postgres:**
   - Dashboard > Logs > Postgres Logs
   - Busca errores relacionados con "permission denied" o "policy violation"

2. **Verifica las relaciones CASCADE:**
   - Dashboard > Database > Tables
   - Selecciona la tabla `events`
   - Ve a la pestaña "Foreign Keys"
   - Verifica que todas tengan `ON DELETE CASCADE`

3. **Prueba manualmente en SQL:**
   ```sql
   -- Intenta eliminar un evento de prueba
   DELETE FROM events WHERE id = 'algún-id-de-prueba';
   ```

   Si esto funciona pero la app no, el problema está en el código.
   Si esto falla, el problema está en las políticas de Supabase.

## Contacto
Si encuentras algún error al ejecutar el script, comparte:
- El mensaje de error completo
- La tabla donde ocurre el error
- Una captura de pantalla si es posible
