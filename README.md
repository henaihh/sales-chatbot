# MercadoLibre Auto-Responder

Sistema inteligente de respuestas automáticas para vendedores de MercadoLibre usando IA en cascada.

## 🚀 Características

- **Respuestas automáticas inteligentes** usando IA en cascada (Haiku → Sonnet → Escalación humana)
- **Dashboard completo** para gestión y monitoreo
- **Test Bot** para probar respuestas antes de activar en producción
- **Base de conocimiento personalizable** para cada vendedor
- **Prompts editables** para personalizar el comportamiento del bot
- **Switch ON/OFF** para activar/desactivar el bot cuando necesites
- **Escalaciones inteligentes** para casos complejos o reclamos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Base de Datos**: Supabase (PostgreSQL con RLS)
- **IA**: Anthropic API (Claude Haiku 4.5 + Sonnet 4.6)
- **Auth**: Supabase Auth
- **Deploy**: Vercel

## 📋 Prerequisitos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com)
- API Key de [Anthropic](https://console.anthropic.com)
- App registrada en [MercadoLibre Developers](https://developers.mercadolibre.com)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd meli-autoresponder
   npm install
   ```

2. **Configurar variables de entorno**
   
   Crear `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

   # Anthropic AI
   ANTHROPIC_API_KEY=tu_anthropic_api_key

   # MercadoLibre API
   MELI_APP_ID=tu_app_id
   MELI_CLIENT_SECRET=tu_client_secret
   MELI_REDIRECT_URI=http://localhost:3000/api/meli/auth/callback

   # Cron Security
   CRON_SECRET=tu_cron_secret_aleatorio
   ```

3. **Configurar Supabase**
   
   Ejecuta el script SQL en el editor de Supabase:
   ```bash
   # El archivo supabase-schema.sql contiene todas las tablas necesarias
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── meli/              # MercadoLibre integration
│   │   ├── cron/              # Background jobs  
│   │   └── interactions/      # Interaction management
│   ├── auth/                  # Authentication
│   └── dashboard/             # Dashboard pages
│       ├── test/              # Bot testing interface
│       ├── escalated/         # Manual escalations
│       ├── settings/          # Configuration
│       └── ...
├── components/
│   ├── ui/                    # Base UI components
│   └── dashboard/             # Dashboard-specific components
└── lib/
    ├── supabase/              # Database clients
    ├── meli/                  # MercadoLibre API
    ├── ai/                    # AI integration
    └── utils/                 # Utilities
```

## 🤖 Cómo Funciona el Bot

### Flujo de Respuesta en Cascada

1. **Pregunta/Mensaje llega** (webhook o polling)
2. **Carga configuración** del vendedor desde la base de datos
3. **Obtiene datos del producto** desde MercadoLibre API
4. **Busca información relevante** en la base de conocimiento

5. **Intenta con Haiku (Tier 2)**:
   - Responde preguntas simples y rápidas
   - Si no puede responder → pasa a Sonnet

6. **Intenta con Sonnet (Tier 3)**:
   - Maneja casos más complejos
   - Si no puede responder → escala a humano

7. **Escalación Manual (Tier 4)**:
   - Genera un borrador sugerido
   - Notifica al vendedor para revisión manual

### Reglas de Seguridad (No Negociables)

- ❌ Nunca incluir información de contacto externa
- ❌ Nunca mencionar otras plataformas de venta
- ❌ Nunca ofrecer pagos fuera de Mercado Pago
- ✅ Siempre escalar quejas y amenazas legales
- ✅ Respuestas máximo 2000 caracteres

## 🧪 Test Bot

La funcionalidad **Test Bot** te permite:

- Probar diferentes preguntas antes de activar el bot
- Ver qué tier (Haiku/Sonnet/Manual) se usaría
- Revisar el costo estimado en tokens
- Ajustar prompts y base de conocimiento

**¡Úsalo siempre antes de activar el bot en producción!**

## ⚙️ Configuración

### 1. Información Básica
- Nombre de la tienda
- Tono de comunicación
- Políticas (envíos, devoluciones, garantía, facturación)

### 2. Prompts Personalizables
- **Pre-venta**: Para preguntas sobre productos
- **Post-venta**: Para consultas después de la compra
- Variables disponibles: `{store_name}`, `{shipping_policy}`, etc.

### 3. Base de Conocimiento
- Crear entradas con información específica
- Categorizar por tipo de consulta
- Aplicar a productos específicos o todos

## 📊 Analíticas

El dashboard muestra:
- Consultas del día
- Porcentaje de automatización
- Escalaciones pendientes  
- Costos de IA
- Historial completo de interacciones

## 🔄 Cron Jobs

Configurar en Vercel (vercel.json):

```json
{
  "crons": [
    {
      "path": "/api/cron/process-pending",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/meli/token/refresh", 
      "schedule": "0 */5 * * *"
    }
  ]
}
```

## 🚀 Deploy en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🆘 Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.

---

**⚠️ Importante**: Este sistema empieza con el bot **desactivado** por defecto. Usa la funcionalidad Test Bot para probar y configurar antes de activar la respuesta automática.