# 🚀 Vercel Deploy Instructions

## ✅ Repository: https://github.com/henaihh/sales-chatbot

## 🔧 Deploy Steps:

### 1. Import to Vercel
- Go to: https://vercel.com
- Click "Import Project"  
- Select GitHub: `henaihh/sales-chatbot`
- Framework preset: **Next.js** (auto-detected)

### 2. Environment Variables (REQUIRED)
Add this in Vercel dashboard → Settings → Environment Variables:

```
ANTHROPIC_API_KEY=sk-ant-api03-[your-anthropic-key-here]
```

**⚠️ WITHOUT THIS KEY, Test Bot will show errors!**

### 3. Deploy
- Click "Deploy"
- Wait ~2 minutes for build completion
- 🎉 Your app will be live!

## 🧪 What Works After Deploy:

### ✅ Test Bot with REAL Claude AI
- Haiku for simple questions (fast + cheap)
- Sonnet for complex queries (smart + detailed)
- Automatic escalation for complaints
- Real token usage and costs
- Processing time metrics

### ✅ Complete Dashboard  
- Live statistics (mock data)
- Escalation management
- Store configuration
- Project status page

### ✅ Sample Test Questions:
- `"¿Tienen stock en color azul?"` → Haiku response
- `"Mi pedido no llega, necesito seguimiento"` → Sonnet response
- `"El producto llegó roto, quiero mi dinero"` → Escalation

## 🔮 Next Steps (Optional):
1. Connect Supabase for real data persistence
2. Implement MercadoLibre API for production use  
3. Add knowledge base CRUD functionality

---
**🎯 Current Status**: Frontend complete + Real Anthropic AI integration
**🚀 Ready for**: Demo, testing, and client presentations