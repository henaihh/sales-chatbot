# 🚀 Instrucciones de Deploy

## 📋 Estado Actual
- ✅ **Frontend completo** funcionando con datos simulados
- ✅ **Test Bot** funcional para probar (lógica simulada inteligente)
- ❌ **APIs reales** no conectadas (Anthropic + MercadoLibre)
- ❌ **Supabase** no conectado (usa localStorage por ahora)

## 📚 GitHub Setup

### 1. Crear repositorio en GitHub
```bash
# Ir a github.com/henaihh
# Crear nuevo repo: "meli-autoresponder"  
# NO inicializar con README (ya tenemos)
```

### 2. Push inicial
```bash
cd meli-autoresponder
git remote add origin https://github.com/henaihh/meli-autoresponder.git
git push -u origin main
```

## 🌐 Vercel Deploy

### 1. Conectar a Vercel
- Ir a vercel.com
- Import desde GitHub: `henaihh/meli-autoresponder`
- Framework preset: **Next.js** ✅

### 2. Variables de entorno (OPCIONALES por ahora)
```
# Estas son opcionales - el app funciona sin ellas usando mocks
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
ANTHROPIC_API_KEY=tu_key_aqui
```

### 3. Deploy
- Click **Deploy** 
- ✅ Debería funcionar inmediatamente con datos simulados

## 🧪 Lo que SÍ funciona después del deploy

### Test Bot Inteligente
Puedes probar preguntas y verás respuestas realistas:
- **Preguntas simples** → Tier 2 (Haiku simulado)
- **Consultas complejas** → Tier 3 (Sonnet simulado)  
- **Palabras clave de reclamo** → Tier 4 (Escalación)

### Dashboard Completo
- Estadísticas simuladas
- Interacciones de ejemplo
- Escalaciones con borradores sugeridos
- Configuración de tienda

### Funcionalidades
- Switch ON/OFF del bot
- Navegación completa
- UI responsive
- Todo el flujo de usuario

## 🔮 Próximos Pasos (Cuando Quieras)

### Fase 1: Conectar APIs Reales
1. **Supabase** - Crear proyecto y conectar DB
2. **Anthropic** - Integrar Claude real en Test Bot
3. **MercadoLibre** - OAuth y webhook

### Fase 2: Funcionalidades Avanzadas
1. Base de conocimiento CRUD
2. Analytics con gráficos
3. Autenticación completa

---

## 💡 **Resumen**

**Lo deployable ahora**: Frontend completo con Test Bot funcional (simulado)
**Lo que falta**: APIs reales para producción
**Valor actual**: Puedes probar toda la UX y funcionalidad antes de conectar APIs

¡El deploy va a funcionar perfectamente para demostrar y probar el sistema!