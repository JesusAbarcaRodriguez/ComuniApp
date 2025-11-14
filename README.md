# 📱 ComuniApp

<div align="center">

**Aplicación móvil para la gestión y organización de comunidades**

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

---

## 📋 Índice

- [Descripción](#-descripción)
- [Problema que resuelve](#-problema-que-resuelve)
- [Características principales](#-características-principales)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Decisiones técnicas](#-decisiones-técnicas)
- [Contribución](#-contribución)

---

## 🎯 Descripción

**ComuniApp** es una aplicación móvil diseñada para mejorar la organización y comunicación dentro de comunidades como barrios, iglesias, asociaciones, clubes deportivos y grupos comunitarios.

La aplicación centraliza toda la gestión de anuncios, eventos y comunicación en un solo lugar, eliminando la dispersión de información en múltiples plataformas como WhatsApp, Facebook o correo electrónico.

---

## 🔍 Problema que resuelve

Las comunidades actuales enfrentan varios desafíos en la organización:

- **Dispersión de información**: Anuncios en WhatsApp, eventos en Facebook, archivos en Drive
- **Pérdida de comunicaciones**: Mensajes importantes se pierden en grupos de chat
- **Desorganización de eventos**: Difícil gestionar asistencias y confirmaciones
- **Falta de centralización**: No hay un único punto de referencia para la comunidad

### Solución

ComuniApp unifica toda la gestión comunitaria en una sola aplicación móvil:

✅ **Un solo lugar** para toda la información comunitaria
✅ **Gestión eficiente** de eventos y confirmaciones de asistencia
✅ **Comunicación centralizada** sin perder mensajes importantes
✅ **Acceso móvil** desde cualquier dispositivo

---

## ✨ Características principales

### Para usuarios

- 🔐 **Autenticación segura** con verificación de correo electrónico
- 👥 **Gestión de grupos** - Únete a grupos existentes o crea nuevos
- 📅 **Eventos** - Visualiza próximos eventos y confirma tu asistencia
- 🔔 **Notificaciones** - Recibe alertas sobre nuevos eventos y anuncios
- 👤 **Perfil personalizable** - Administra tu información personal
- 🔍 **Exploración** - Descubre grupos y eventos de tu comunidad

### Para administradores/owners

- ➕ **Crear eventos** - Organiza actividades para tu grupo
- ✅ **Aprobar solicitudes** - Gestiona nuevos miembros y solicitudes de eventos
- 📊 **Ver asistentes** - Controla quién confirmó asistencia a tus eventos
- 🗑️ **Eliminar contenido** - Elimina eventos o grupos cuando sea necesario
- 👥 **Gestionar miembros** - Administra los roles y permisos del grupo

---

## 🛠️ Stack tecnológico

### Frontend

- **[React Native](https://reactnative.dev/)** - Framework para desarrollo móvil multiplataforma
- **[Expo](https://expo.dev/)** - Plataforma para desarrollo, compilación y despliegue
- **[React Navigation](https://reactnavigation.org/)** - Navegación entre pantallas
- **[@expo/vector-icons](https://icons.expo.fyi/)** - Iconografía

### Backend

- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
  - PostgreSQL como base de datos
  - Autenticación integrada
  - API REST automática
  - Row Level Security (RLS)
  - Almacenamiento de archivos

### Herramientas de desarrollo

- **Git** - Control de versiones
- **npm** - Gestor de paquetes
- **Expo Go** - Testing en dispositivos físicos

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         React Native App (Expo)         │
│  ┌───────────┐  ┌──────────────────┐   │
│  │  Screens  │  │   Components     │   │
│  └─────┬─────┘  └────────┬─────────┘   │
│        │                 │              │
│  ┌─────▼─────────────────▼─────────┐   │
│  │      Context Providers           │   │
│  │   (Auth, Navigation, etc.)       │   │
│  └─────────────┬────────────────────┘   │
│                │                         │
│  ┌─────────────▼────────────────────┐   │
│  │   Supabase Client (Data Layer)   │   │
│  └─────────────┬────────────────────┘   │
└────────────────┼────────────────────────┘
                 │
                 │ HTTPS/WebSocket
                 │
┌────────────────▼────────────────────────┐
│          Supabase Backend               │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  PostgreSQL  │  │  Authentication │ │
│  │   Database   │  │     Service     │ │
│  └──────────────┘  └─────────────────┘ │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │  REST API    │  │   Row Level     │ │
│  │  (Auto)      │  │   Security      │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18.x
- npm o yarn
- Expo CLI
- Cuenta de Supabase

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/ComuniApp.git
cd ComuniApp/comuniApp
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en `comuniApp/`:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar Supabase**

Ejecutar el script SQL en Supabase Dashboard > SQL Editor:

```bash
# Ver archivo: supabase_delete_policies.sql
```

5. **Iniciar la aplicación**

```bash
npm start
```

6. **Ejecutar en dispositivo**

- **Android**: Presiona `a` o escanea el QR con Expo Go
- **iOS**: Presiona `i` o escanea el QR con la cámara
- **Web**: Presiona `w`

---

## ⚙️ Configuración

### Configuración de Supabase

#### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda la URL y la API Key (anon/public)

#### 2. Configurar base de datos

Crear las siguientes tablas en SQL Editor:

- `profiles` - Información de usuarios
- `groups` - Grupos comunitarios
- `group_members` - Membresías de grupos
- `group_join_requests` - Solicitudes de unión
- `events` - Eventos comunitarios
- `event_attendees` - Asistencias a eventos

#### 3. Habilitar políticas RLS

Ejecutar el archivo `supabase_delete_policies.sql` para configurar las políticas de seguridad.

Ver [INSTRUCCIONES_ELIMINAR.md](./INSTRUCCIONES_ELIMINAR.md) para detalles.

---

## 📱 Uso

### Para usuarios

1. **Registro**: Crea una cuenta con tu correo electrónico
2. **Verificación**: Confirma tu correo (revisa SPAM)
3. **Seleccionar grupo**: Únete a un grupo existente o crea uno nuevo
4. **Explorar**: Navega eventos próximos y confirma tu asistencia
5. **Perfil**: Personaliza tu información

### Para administradores

1. **Crear grupo**: Desde el perfil, crea tu grupo comunitario
2. **Crear eventos**: Agrega eventos con fecha, hora y ubicación
3. **Aprobar miembros**: Revisa y aprueba solicitudes de unión
4. **Gestionar asistencias**: Aprueba confirmaciones de asistencia

---

## 📂 Estructura del proyecto

```
ComuniApp/
├── comuniApp/                    # Aplicación principal
│   ├── src/
│   │   ├── assets/              # Imágenes, fuentes, etc.
│   │   ├── components/          # Componentes reutilizables
│   │   │   └── PrimaryButton.js
│   │   ├── context/             # Context providers
│   │   │   └── AuthProvider.js
│   │   ├── data/                # Capa de datos (Supabase)
│   │   │   ├── events.supabase.js
│   │   │   ├── groups.supabase.js
│   │   │   └── requests.supabase.js
│   │   ├── lib/                 # Configuración
│   │   │   └── supabase.js
│   │   ├── navigation/          # Configuración de navegación
│   │   │   └── AppNavigator.js
│   │   └── screens/             # Pantallas de la app
│   │       ├── auth/            # Autenticación
│   │       │   ├── SignInScreen.js
│   │       │   └── SignUpScreen.js
│   │       └── private/         # Pantallas privadas
│   │           ├── EventDetailsScreen.js
│   │           ├── CreateEventScreen.js
│   │           ├── ProfileScreen.js
│   │           └── ...
│   ├── .env                     # Variables de entorno
│   ├── app.json                 # Configuración de Expo
│   └── package.json             # Dependencias
├── supabase_delete_policies.sql # Script SQL para políticas
├── INSTRUCCIONES_ELIMINAR.md    # Guía de configuración
└── README.md                    # Este archivo
```

---

## 🤔 Decisiones técnicas

Durante el desarrollo se realizaron cambios importantes respecto al plan inicial:

### ✅ De Web App a Mobile App (React Native + Expo)

**Razón**: La mayoría de usuarios acceden desde dispositivos móviles. Expo simplifica el desarrollo, las pruebas y las compilaciones sin necesidad de configuración nativa compleja.

**Ventajas**:
- Desarrollo más rápido
- Hot reload y desarrollo ágil
- Testing sencillo con Expo Go
- Una sola base de código para iOS y Android
- Compilación en la nube con EAS Build

### ✅ De Firebase a Supabase

**Razón**: Supabase ofrece PostgreSQL real, autenticación integrada, API REST automática y mayor control sobre los datos.

**Ventajas**:
- Base de datos relacional (PostgreSQL)
- Consultas SQL directas y complejas
- Row Level Security (RLS) nativo
- Open source y más económico
- Mejor control sobre la estructura de datos
- Migraciones y backups más sencillos

### ✅ Backend simplificado (sin Node.js/Express)

**Razón**: Supabase genera automáticamente la API REST al crear las tablas, eliminando la necesidad de un backend personalizado.

**Ventajas**:
- Menos código que mantener
- Menor superficie de ataque (seguridad)
- APIs consistentes y documentadas automáticamente
- Reducción de costos de infraestructura
- Tiempo de desarrollo más corto

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de estilo

- Usar nombres descriptivos en variables y funciones
- Comentar código complejo
- Seguir la estructura de carpetas existente
- Probar en iOS y Android antes de hacer PR

---

## 👥 Autores

- **Francisco Amador** - *Desarrollo inicial* - [GitHub](https://github.com/Francisco-Amador)
- **Jesus Abarca** - *Desarrollo inicial* - [GitHub](https://github.com/JesusAbarcaRodriguez)

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

## 📞 Contacto

¿Preguntas o sugerencias? Abre un [issue](https://github.com/tu-usuario/ComuniApp/issues) en GitHub.

---

<div align="center">

**Hecho con ❤️ para mejorar la organización comunitaria**

⭐ Si te gustó este proyecto, dale una estrella en GitHub

</div>
