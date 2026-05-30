# 🍽️ Cookly — Buscador de Recetas

App mobile Android para explorar y guardar recetas de cocina, desarrollada con React Native como proyecto final de la materia Aplicaciones Mobile.

## Integrantes

| Nombre           | GitHub                                               |
|------------------|------------------------------------------------------|
| Eliana Garcia    | [@elianagarcia01] |
| Serafin Gonzalez | @seragonzrov |

---

## Descripción

Cookly permite buscar recetas por nombre o categoría (pollo, carne, postres, etc.), ver el detalle con ingredientes y preparación, abrir el video en YouTube y guardar recetas favoritas para consultarlas sin internet.

**API utilizada:** [TheMealDB](https://www.themealdb.com/api.php) — API pública y gratuita con más de 300 recetas.

---

## Funcionalidades

- Búsqueda de recetas por nombre
- Filtros por categoría (Desayuno, Pasta, Pollo, Carne, Postres, etc.)
- Detalle de receta con ingredientes, pasos de preparación y video de YouTube
- Guardado de recetas favoritas en base de datos local (SQLite)
- Acceso a favoritos sin conexión a internet
- Aviso de conectividad cuando se pierde o restaura la red

---

## Arquitectura

El proyecto sigue una arquitectura de **separación en capas**:

```
src/
├── screens/        # Capa de presentación — pantallas de la app
├── components/     # Componentes UI reutilizables
├── services/       # Capa de datos remotos — llamadas a TheMealDB API
├── database/       # Capa de datos locales — SQLite con op-sqlite
├── navigation/     # Configuración de rutas y navegación
├── hooks/          # Lógica reutilizable
└── constants/      # Traducciones y constantes
```

### Pantallas

| Pantalla | Descripción |
|----------|-------------|
| `HomeScreen` | Pantalla principal con buscador y filtros por categoría |
| `SearchResultsScreen` | Resultados de búsqueda |
| `RecipeDetailScreen` | Detalle de receta con ingredientes, preparación y YouTube |
| `FavoritesScreen` | Recetas guardadas localmente |
| `SplashScreen` | Pantalla de carga inicial |

### Componentes Android nativos

| Componente | Clase | Función |
|------------|-------|---------|
| Activity | `MainActivity.kt` | Pantalla principal, entrada de la app |
| Service | `FavoritesService.java` | Sincronización de favoritos en background |
| BroadcastReceiver | `NetworkReceiver.java` | Detecta cambios de conectividad |
| ContentProvider | `FavoritesProvider.java` | Expone la tabla de favoritos |
| Intent | `Linking.openURL()` en RecipeDetailScreen | Abre videos en YouTube |

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React Native | 0.85.3 | Framework principal |
| TypeScript | 5.x | Lenguaje |
| React Navigation | 7.x | Navegación entre pantallas |
| @op-engineering/op-sqlite | latest | Base de datos local SQLite |
| React Native Paper | latest | Componentes Material Design |
| Axios | latest | Cliente HTTP |
| TheMealDB API | v1 | Fuente de recetas |
| Detekt | 1.23.6 | Análisis estático SAST |
| Jest | latest | Tests unitarios |
| Fastlane | latest | CI/CD automatización |

---

## Requisitos previos

- Node.js v18 o superior
- JDK 17 o superior
- Android Studio con Android SDK
- Emulador Android o dispositivo físico

---

## Pasos para compilar y ejecutar

### 1. Clonar el repositorio

```bash
git clone https://github.com/elianagarcia01/cookly-app.git
cd cookly-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar Metro

```bash
npm start
```

### 4. Correr en Android

En otra terminal:

```bash
npm run android
```

---

## Tests

Correr los tests unitarios con Jest:

```bash
npx jest
```

Los tests cubren el servicio `mealDbApi`:
- `searchMeals` — búsqueda por nombre
- `fetchCategories` — obtener categorías
- `fetchMealsByCategory` — filtrar por categoría
- `fetchMealById` — obtener detalle de receta

---

## Seguridad y calidad

### Detekt (SAST)

Análisis estático del código Kotlin/Java:

```bash
cd android && ./gradlew detekt
```

Reporte generado en: `android/app/build/reports/detekt/detekt.html`

Resultado: **0 code smells, 0 fallos críticos**

### Dependency Check

Análisis de vulnerabilidades en dependencias:

```bash
npm audit
```

Reporte generado en: `dependency-check-report.txt`

Resultado: 7 vulnerabilidades moderadas en dependencias del CLI de React Native (no en código propio).

---

## Estructura del repositorio

```
cookly-app/
├── android/                  # Proyecto Android nativo
│   └── app/src/main/java/com/cookly/
│       ├── MainActivity.kt
│       ├── MainApplication.kt
│       ├── NetworkReceiver.java
│       ├── NetworkEventEmitter.java
│       ├── NetworkPackage.kt
│       ├── FavoritesService.java
│       ├── FavoritesServiceModule.java
│       └── FavoritesProvider.java
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/
│   ├── database/
│   ├── navigation/
│   ├── hooks/
│   └── constants/
├── __tests__/
│   └── mealDbApi.test.ts
├── App.tsx
├── detekt-config.yml
├── dependency-check-report.txt
└── README.md
```

---

## Manual de usuario

1. **Buscar recetas** — escribí en la barra de búsqueda o tocá una categoría
2. **Ver detalle** — tocá cualquier receta para ver ingredientes y preparación
3. **Ver en YouTube** — tocá el botón rojo en el detalle para abrir el video
4. **Guardar favorito** — tocá "Guardar en Favoritos" en el detalle
5. **Ver favoritos** — tocá el ícono de corazón en la barra de navegación
6. **Eliminar favorito** — en la pantalla de favoritos, deslizá o tocá eliminar

---

## Mockups

Los mockups fueron diseñados en Figma con flujo de navegación entre las 5 pantallas.
