# Urban Vogue Store

Tienda online de moda urbana con frontend vanilla JS y backend Spring Boot.

## 🌐 **Producción (Desplegado)**

| Componente | URL | Plataforma |
|------------|-----|------------|
| **Frontend** | `https://zyvenix-soft.vercel.app` | Vercel |
| **Backend API** | `https://urban-vogue-backend.onrender.com/api` | Render |
| **Base de datos** | PostgreSQL (Supabase) | Supabase |

> **Credenciales demo:** `alexander@urbanboguestore.com` / `admin123`

---

## 🏗️ Arquitectura

```
urban-vogue-store_final/
├── urban-vogue-store/     # Frontend (HTML, CSS, JS vanilla ES Modules)
└── urban-vogue-backend/   # Backend (Spring Boot 3.3, Java 17, JPA/Hibernate)
```

---

## 🚀 Inicio rápido (Desarrollo Local)

### Prerrequisitos
- Java 17+
- Maven 3.9+ (o usa `./mvnw`)
- VS Code + extensión **Live Server** (para frontend)

### 1. Backend Local (puerto 8080 + H2)
```bash
cd urban-vogue-backend
./mvnw spring-boot:run
# o: java -jar target/urban-vogue-backend.jar
```
- API Local: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console` (JDBC: `jdbc:h2:file:./data/urbanvogue`)

### 2. Frontend Local (puerto 5500 con Live Server)
1. Abre `urban-vogue-store/index.html` en VS Code
2. Click derecho → **Open with Live Server**
3. Se abre en `http://127.0.0.1:5500`

> **Config local:** `urban-vogue-store/js/config.js` → `export const API_BASE = "http://localhost:8080/api";`

---

## ☁️ Despliegue en Producción

### Backend → Render (Docker + Supabase)
1. **Dockerfile** incluido en `urban-vogue-backend/`
2. **Variables de entorno en Render:**
   ```bash
   SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
   SPRING_DATASOURCE_USERNAME=postgres.tu-project-ref
   SPRING_DATASOURCE_PASSWORD=tu_password_supabase
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
   SPRING_H2_CONSOLE_ENABLED=false
   ```
3. Render usa el **Connection Pooler** de Supabase (puerto 5432/6543)

### Frontend → Vercel
- **Root Directory:** `urban-vogue-store`
- **Build Command:** *(vacío)*
- **Output Directory:** `.`
- **Environment:** `API_BASE` apunta a Render backend

### Base de datos → Supabase (PostgreSQL)
- **DataLoader** crea tablas + seed automático al primer arranque
- 24 productos + 3 admins (1 Admin + 2 SuperAdmin)
- Connection pooling habilitado para serverless

---

## 🔐 Credenciales demo

| Rol | Email | Password | Notas |
|-----|-------|----------|-------|
| Admin | `alexander@urbanboguestore.com` | `admin123` | Seed local/prod |
| SuperAdmin (Soporte) | `soporte@zyvenixsoft.com` | `SuperAdmin2024!` | Seed prod |
| SuperAdmin (Owner) | `owner@zyvenixsoft.com` | `OwnerPass2024!` | Seed prod |

> ⚠️ **Cambia passwords en `DataLoader.java` antes de producción real**

---

## 📦 Endpoints principales

### Auth
- `POST /api/auth/registro` - Registro de cliente
- `POST /api/auth/login` - Login

### Productos
- `GET /api/productos` - Lista (filtro `?categoria=Hombres`)
- `GET /api/productos/{id}` - Detalle
- `POST /api/productos` - Crear (admin)
- `PUT /api/productos/{id}` - Actualizar (admin)
- `PUT /api/productos/{id}/stock` - Ajustar stock (admin)

### Pedidos
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/usuario/{email}` - Historial usuario
- `GET /api/pedidos` - Todos (admin)
- `PUT /api/pedidos/{id}/estado` - Cambiar estado (admin)

---

## 🛠️ Stack técnico

### Frontend
- Vanilla JS (ES Modules)
- CSS Grid/Flexbox, responsive
- Service Worker (PWA básico)
- IndexedDB-ready para offline

### Backend
- Spring Boot 3.3.4
- Spring Data JPA / Hibernate
- **H2 (local) / PostgreSQL/Supabase (prod)**
- Bean Validation
- CORS configurado para `*`

### Modelo de datos
```
Usuario (abstracto, JOINED)
├── UsuarioFinal (cliente) → Pedidos
├── Administrador
└── SuperAdministrador

Producto → ComentarioCalificacion
Pedido → PedidoItem → Producto
```

---

## 📁 Estructura del proyecto

```
urban-vogue-backend/
├── src/main/java/com/tienda/
│   ├── config/          # CorsConfig, DataLoader
│   ├── controller/      # REST endpoints
│   ├── dto/             # Request/Response objects
│   ├── model/           # JPA Entities
│   ├── repository/      # Spring Data Repositories
│   └── service/         # Business logic
├── src/main/resources/
│   ├── application.properties          # Local (H2) + env vars para prod
│   └── application-supabase.properties # Template para Supabase
├── Dockerfile                          # Para Render
└── pom.xml

urban-vogue-store/
├── index.html           # SPA single-file (todas las vistas)
├── styles.css           # Estilos principales
├── admin.css            # Panel admin
├── js/
│   ├── main.js          # Entry point + restoreAdminSession()
│   ├── config.js        # API_BASE (local vs prod)
│   ├── state.js         # Estado global + API calls + auth
│   ├── products.js      # Render productos
│   ├── cart.js          # Carrito
│   ├── account.js       # Auth UI
│   ├── admin*.js        # Panel admin completo
│   └── ...              # Utilidades
├── img/                 # Assets locales (15+ imágenes)
└── sw.js                # Service Worker
```

---

## 🗄️ Base de datos

### Local (H2)
- Archivo: `./data/urbanvogue.mv.db`
- Se crea automáticamente al arrancar
- Consola web: `http://localhost:8080/h2-console`

### Producción (Supabase PostgreSQL)
- Tablas creadas por Hibernate (`ddl-auto=update`)
- `DataLoader` inserta seed data al primer arranque
- Connection pooler para serverless (Render)

---

## 🔧 Configuración

### Backend (`application.properties`)
```properties
# Local (por defecto)
spring.datasource.url=jdbc:h2:file:./data/urbanvogue;AUTO_SERVER=TRUE

# Prod (via env vars en Render)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.driver-class-name=${SPRING_DATASOURCE_DRIVER_CLASS_NAME}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.database-platform=${SPRING_JPA_DATABASE_PLATFORM}
spring.h2.console.enabled=${SPRING_H2_CONSOLE_ENABLED:false}
```

### Frontend (`js/config.js`)
```js
// Desarrollo
export const API_BASE = "http://localhost:8080/api";

// Producción (actualizado al deployar)
export const API_BASE = "https://urban-vogue-backend.onrender.com/api";
```

---

## 🐳 Docker (Render)

```dockerfile
# Multi-stage build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/urban-vogue-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

---

## 📝 Licencia

MIT - Uso libre para aprendizaje y proyectos personales.