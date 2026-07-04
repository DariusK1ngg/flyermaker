# 🎨 Auto-Generador de Flyers de Ofertas (FlyerMaker)

Un generador automático y dinámico de flyers promocionales diseñado específicamente para negocios, mercados y tiendas locales. Permite diseñar, previsualizar en tiempo real y exportar imágenes de alta resolución (2.5x) optimizadas para redes sociales (formatos Story y Cuadrado).

El sistema está construido con un diseño visual prémium e interactivo que facilita a los usuarios crear piezas de marketing espectaculares en segundos.

---

## 🚀 Características Principales

*   ✨ **Edición en Tiempo Real:** Modifica títulos, subtítulos, textos de validez, y detalles de productos viendo los cambios reflejados instantáneamente.
*   📦 **Catálogo Integrado con Base de Datos:** Guarda y recupera tus productos en una base de datos PostgreSQL serverless administrada por **Neon DB**.
*   🛍️ **Gestión Inteligente de Productos:**
    *   Soporte para hasta 4 productos simultáneos destacados en el flyer para garantizar la legibilidad y armonía visual.
    *   **Guardado Seguro:** Si intentas agregar un producto nuevo y tu flyer ya está lleno (máximo de 4), el producto **se guarda automáticamente en tu catálogo** para que lo uses después.
    *   Destaca productos con fondos amarillos especiales con un solo clic.
*   🎨 **Temas y Estilo Visual Personalizado:**
    *   Temas preestablecidos (Verde Mercado, Rojo Supermercado, etc.).
    *   Selector de colores personalizados para fondos y acentos.
    *   Control preciso de fuentes y escalado de imágenes.
*   📸 **Exportación en Alta Definición:**
    *   Exporta en formatos **PNG** o **JPEG**.
    *   Multiplicador de resolución a **2.5x** para que las imágenes luzcan cristalinas al imprimirse o compartirse en Instagram, WhatsApp o Facebook.
    *   Soporte para formatos **Story (9:16)** y **Post/Cuadrado (1:1)**.

---

## 🛠️ Tecnologías Utilizadas

*   ⚛️ **Frontend:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   ⚡ **Base de Datos:** [Neon serverless PostgreSQL](https://neon.tech/) (API local integrada en `/api/products`)
*   🎨 **Diseño & Estilo:** CSS Vanilla moderno (Glassmorphism, variables dinámicas de diseño, fuentes premium de Google Fonts)
*   📸 **Procesamiento de Imagen:** [html-to-image](https://www.npmjs.com/package/html-to-image)
*   🛡️ **Linter:** [Oxlint](https://oxc.rs/) para análisis estático ultra rápido

---

## 💻 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio e instalar dependencias
```bash
# Clonar el proyecto
git clone https://github.com/DariusK1ngg/flyermaker.git
cd flyermaker

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y agrega tu cadena de conexión de Neon DB:
```env
DATABASE_URL="postgres://tu_usuario:tu_contraseña@tu-endpoint.neon.tech/neondb?sslmode=require"
```

### 3. Ejecutar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173` para comenzar a crear tus flyers.

### 4. Compilar para Producción
```bash
npm run build
```

---

## 📂 Estructura del Proyecto

```text
├── api/                  # Endpoints del Backend (Conexión de Base de Datos Neon)
│   └── products.ts       # API para CRUD de productos en Neon DB
├── public/               # Recursos estáticos (Logos, favicons, iconos)
├── src/
│   ├── assets/           # Imágenes y recursos estáticos internos
│   ├── components/       # Componentes React
│   │   ├── EditorPanel.tsx             # Panel izquierdo de configuración y edición
│   │   ├── FlyerPreview.tsx            # Lienzo derecho con previsualización exacta
│   │   ├── Navbar.tsx                  # Barra de navegación superior y acciones
│   │   ├── PredefinedCatalogModal.tsx  # Modal del catálogo de productos
│   │   └── ProductModal.tsx            # Modal para agregar/editar productos
│   ├── data/             # Archivos de datos estáticos y temas preestablecidos
│   ├── types.ts          # Definición de tipos de TypeScript
│   ├── App.tsx           # Componente principal y control de estado
│   └── index.css         # Sistema global de estilos, variables CSS y animaciones
├── package.json          # Dependencias y scripts del proyecto
└── tsconfig.json         # Configuración del compilador TypeScript
```

---

## 🤝 Contribuciones y Soporte

Las contribuciones son bienvenidas. Si tienes alguna sugerencia para mejorar la estética, agregar nuevos formatos o extender la integración de base de datos, no dudes en crear un *Pull Request* o abrir un *Issue*.

Desarrollado con ❤️ por **DariusK1ngg**.
