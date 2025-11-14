# 📱 Solución: Ejecutar ComuniApp en iPhone 13

## 🔴 Problema identificado

Tu proyecto tiene `"newArchEnabled": true` en `app.json`, lo cual **NO es compatible con Expo Go** en iOS. Esta es la causa más probable del problema.

---

## ✅ SOLUCIÓN 1: Deshabilitar Nueva Arquitectura (RECOMENDADO)

Esta es la solución más rápida para que funcione con Expo Go:

### Paso 1: Editar `app.json`

Cambia esta línea:

```json
{
  "expo": {
    "newArchEnabled": true,  // ❌ CAMBIAR ESTO
  }
}
```

Por:

```json
{
  "expo": {
    "newArchEnabled": false,  // ✅ USAR ESTO
  }
}
```

### Paso 2: Limpiar caché y reiniciar

```bash
cd comuniApp
npx expo start --clear
```

### Paso 3: En el iPhone de tu amigo

1. Asegurarse de que **Expo Go** esté actualizado (App Store)
2. Verificar que estén en la **misma red WiFi**
3. Escanear el código QR con la app **Cámara** de iOS (no con Expo Go)
4. La app debería abrirse automáticamente en Expo Go

---

## ✅ SOLUCIÓN 2: Modo Túnel (Si hay problemas de red)

Si el problema es de conectividad (diferentes redes, firewall, etc.):

```bash
npx expo start --tunnel
```

**Ventajas:**
- Funciona aunque NO estén en la misma red WiFi
- Bypass de firewalls y VPNs

**Desventajas:**
- Un poco más lento
- Requiere cuenta de Expo (gratis)

---

## ✅ SOLUCIÓN 3: Usar Expo Dev Client (Avanzado)

Si quieres usar la nueva arquitectura, necesitas un "Development Build" en lugar de Expo Go:

### Opción A: Build en la nube (EAS)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Crear development build para iOS
eas build --platform ios --profile development
```

**Tiempo:** ~15-20 minutos
**Costo:** Gratis (cuenta de Expo)
**Resultado:** Archivo .ipa para instalar en el iPhone vía TestFlight

### Opción B: Build local (requiere macOS)

```bash
npx expo run:ios
```

❌ **No disponible en Windows**

---

## 🔧 Checklist de problemas comunes

Si aún no funciona, verifica:

### ☑️ En tu computadora:

```bash
# 1. Verificar que Expo esté corriendo
npx expo start

# 2. Ver la IP de conexión
# Debe mostrar algo como: exp://192.168.1.X:8081

# 3. Verificar versión de Expo CLI
npx expo --version
# Debería ser >= 0.18.0
```

### ☑️ En el iPhone:

- [ ] Expo Go está actualizado (última versión en App Store)
- [ ] WiFi conectado a la MISMA red que la PC
- [ ] Permisos de cámara habilitados para Expo Go
- [ ] No hay VPN activa en el iPhone
- [ ] iOS >= 13.4 (iPhone 13 usa iOS 15+, está bien)

### ☑️ En la red:

- [ ] PC y iPhone en la misma red WiFi
- [ ] No hay firewall bloqueando el puerto 8081
- [ ] Router permite comunicación entre dispositivos (AP Isolation desactivado)

---

## 🚨 Errores específicos y soluciones

### Error: "Unable to connect to Metro"

```bash
# Solución:
npx expo start --tunnel
```

### Error: "Network response timed out"

**Causa:** Firewall de Windows o antivirus bloqueando

**Solución:**
1. Desactiva temporalmente el firewall
2. O agrega excepción para Node.js en el firewall

### Error: "Uncaught Error: newArchEnabled requires custom build"

**Causa:** Intentando usar nueva arquitectura en Expo Go

**Solución:** Sigue la SOLUCIÓN 1 (cambiar `newArchEnabled: false`)

### Error: "This QR code is not valid"

**Causa:** Código QR corrupto o versión incompatible

**Solución:**
```bash
# Limpiar caché
npx expo start --clear

# O reiniciar completamente
rm -rf node_modules
npm install
npx expo start
```

---

## 📲 Instrucciones paso a paso para tu amigo (iPhone)

Envíale esto a tu amigo:

### 1️⃣ Instalar Expo Go

- Ir a App Store
- Buscar "Expo Go"
- Descargar e instalar

### 2️⃣ Conectarse a WiFi

- Conectar a la **misma red WiFi** que la PC del desarrollador
- Desactivar VPN si tiene una

### 3️⃣ Escanear QR

- Abrir la app **Cámara** de iOS (no Expo Go)
- Apuntar a la pantalla de la computadora donde aparece el QR
- Tocar la notificación que aparece
- Se abrirá automáticamente en Expo Go

### 4️⃣ Esperar

- La primera vez tarda ~30 segundos en cargar
- Se descarga el código JavaScript
- Una vez cargado, funciona normal

---

## 🎯 Recomendación final

**Para desarrollo rápido:**
1. Cambiar `newArchEnabled: false` en `app.json`
2. Usar `npx expo start --tunnel` si hay problemas de red
3. Tu amigo usa Expo Go en el iPhone 13

**Para producción (app real):**
1. Usar EAS Build para compilar
2. Distribuir vía TestFlight o App Store
3. Mantener `newArchEnabled: true` si lo necesitas

---

## 💡 ¿Necesitas ayuda?

Si después de todo esto sigue sin funcionar:

1. **Toma captura del error exacto** que aparece en el iPhone
2. **Comparte los logs** de la terminal donde ejecutas `expo start`
3. **Verifica la versión de Expo Go** en el iPhone (Settings > About)

---

## 🔗 Enlaces útiles

- [Expo Go Limitations](https://docs.expo.dev/workflow/expo-go/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Troubleshooting Connection](https://docs.expo.dev/troubleshooting/network/)
