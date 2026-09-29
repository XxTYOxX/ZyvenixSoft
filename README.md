# Urban Vogue Store

Tienda online de moda urbana con frontend vanilla JS y backend Spring Boot.

## 🏗️ Arquitectura

```
urban-vogue-store_final/
├── urban-vogue-store/     # Frontend (HTML, CSS, JS vanilla ES Modules)
└── urban-vogue-backend/   # Backend (Spring Boot 3.3, Java 17, JPA/Hibernate)
```

## 🚀 Inicio rápido

### Prerrequisitos
- Java 17+
- Maven 3.9+ (o usa `./mvnw`)
- VS Code + extensión **Live Server** (para frontend)

### 1. Backend (puerto 8080)
```bash
cd urban-vogue-backend
./mvnw spring-boot:run
# o: java -jar target/urban-vogue-backend.jar
```
- API: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console` (JDBC: `jdbc:h2:file:./data/urbanvogue`)

### 2. Frontend (puerto 5500 con Live Server)
1. Abre `urban-vogue-store/index.html` en VS Code
2. Click derecho → **Open with Live Server**
3. Se abre en `http://127.0.0.1:5500`

## 🔐 Credenciales demo

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `alexander@urbanboguestore.com` | `admin123` |

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

## 🛠️ Stack técnico

### Frontend
- Vanilla JS (ES Modules)
- CSS Grid/Flexbox, responsive
- Service Worker (PWA básico)
- IndexedDB-ready para offline

### Backend
- Spring Boot 3.3.4
- Spring Data JPA / Hibernate
- H2 Database (file-based, persiste en `./data/`)
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
└── src/main/resources/
    └── application.properties

urban-vogue-store/
├── index.html           # SPA single-file (todas las vistas)
├── styles.css           # Estilos principales
├── admin.css            # Panel admin
├── js/
│   ├── main.js          # Entry point
│   ├── state.js         # Estado global + API calls
│   ├── products.js      # Render productos
│   ├── cart.js          # Carrito
│   ├── account.js       # Auth UI
│   ├── admin*.js        # Panel admin
│   └── ...              # Utilidades
└── img/                 # Assets locales
```

## 🗄️ Base de datos

- **H2 file-based**: `./data/urbanvogue.mv.db`
- Se crea automáticamente al arrancar
- `DataLoader` inserta 24 productos + admin al primer arranque
- Consola web: `http://localhost:8080/h2-console`

## 🔧 Configuración

### Backend (`application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:h2:file:./data/urbanvogue;AUTO_SERVER=TRUE
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
```

### Frontend (`js/config.js`)
```js
export const API_BASE = "http://localhost:8080/api";
```

## 📝 Licencia

MIT - Uso libre para aprendizaje y proyectos personales.