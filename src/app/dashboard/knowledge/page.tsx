'use client'

import { useState, useMemo } from 'react'
import { 
  BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, Search, 
  Zap, ChevronDown, ChevronUp, X, Save, Copy, BarChart3
} from 'lucide-react'
import { 
  type KBEntry, type KBEntryType, KB_TYPE_CONFIG, DEFAULT_ENTRIES, 
  estimateTokens, buildKBContext 
} from '@/lib/knowledge'

// ─── Entry Form ─────────────────────────────────────────
interface EntryFormProps {
  entry?: KBEntry
  onSave: (entry: Omit<KBEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

function EntryForm({ entry, onSave, onCancel }: EntryFormProps) {
  const [type, setType] = useState<KBEntryType>(entry?.type || 'faq')
  const [title, setTitle] = useState(entry?.title || '')
  const [question, setQuestion] = useState(entry?.question || '')
  const [content, setContent] = useState(entry?.content || '')
  const [tagsText, setTagsText] = useState(entry?.tags.join(', ') || '')
  const [priority, setPriority] = useState(entry?.priority || 3)

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    onSave({
      type,
      title: title.trim(),
      question: type === 'faq' ? question.trim() : undefined,
      content: content.trim(),
      tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
      priority,
      active: entry?.active ?? true,
    })
  }

  const tokenEstimate = estimateTokens(
    (type === 'faq' ? `P: ${question}\nR: ${content}` : `${title}: ${content}`)
  )

  return (
    <div className="card">
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            {entry ? 'Editar Entrada' : 'Nueva Entrada'}
          </h3>
          <button onClick={onCancel} className="p-1.5 rounded hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {(Object.entries(KB_TYPE_CONFIG) as [KBEntryType, typeof KB_TYPE_CONFIG[KBEntryType]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`p-2 rounded-lg border text-xs text-center transition-colors ${
                  type === key 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-base block mb-0.5">{config.emoji}</span>
                {config.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">{KB_TYPE_CONFIG[type].description}</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input"
            placeholder="Ej: Consulta de stock"
          />
        </div>

        {/* Question (FAQ only) */}
        {type === 'faq' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pregunta del comprador (ejemplo)
            </label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="textarea text-sm"
              rows={2}
              placeholder="Ej: ¿Tienen stock disponible en color azul?"
            />
          </div>
        )}

        {/* Content / Answer */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {type === 'faq' ? 'Respuesta ideal' : 'Contenido'}
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="textarea text-sm"
            rows={4}
            placeholder={type === 'faq' 
              ? '¡Hola! Sí, tenemos stock en azul...' 
              : 'Escribe el contenido...'
            }
          />
          <p className="text-xs text-slate-400 mt-1">~{tokenEstimate} tokens estimados</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tags de relevancia <span className="text-slate-400">(separados por coma)</span>
          </label>
          <input
            value={tagsText}
            onChange={e => setTagsText(e.target.value)}
            className="input text-sm"
            placeholder="stock, disponible, color, hay"
          />
          <p className="text-xs text-slate-400 mt-1">
            El bot usa estos tags para decidir cuándo incluir esta entrada
          </p>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Prioridad
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                  priority === p
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            1 = siempre incluir · 5 = solo si es muy relevante
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button onClick={handleSubmit} className="btn btn-primary flex-1">
            <Save className="h-4 w-4" />
            {entry ? 'Guardar Cambios' : 'Crear Entrada'}
          </button>
          <button onClick={onCancel} className="btn btn-outline">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Entry Card ─────────────────────────────────────────
interface EntryCardProps {
  entry: KBEntry
  onEdit: (entry: KBEntry) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

function EntryCard({ entry, onEdit, onDelete, onToggle }: EntryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config = KB_TYPE_CONFIG[entry.type]
  const tokens = estimateTokens(entry.content + (entry.question || ''))

  return (
    <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
      entry.active ? 'border-slate-200' : 'border-slate-200 opacity-50'
    }`}>
      <div className="p-3 lg:p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm flex-shrink-0">{config.emoji}</span>
            <span className={`badge text-xs badge-${
              config.color === 'blue' ? 'tier-2' : 
              config.color === 'green' ? 'success' :
              config.color === 'amber' ? 'tier-3' :
              config.color === 'purple' ? 'default' : 'tier-4'
            }`}>
              {config.label}
            </span>
            <span className="text-sm font-medium text-slate-900 truncate">{entry.title}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onToggle(entry.id)} className="p-1.5 rounded hover:bg-slate-100">
              {entry.active 
                ? <Eye className="h-3.5 w-3.5 text-green-500" />
                : <EyeOff className="h-3.5 w-3.5 text-slate-400" />
              }
            </button>
            <button onClick={() => onEdit(entry)} className="p-1.5 rounded hover:bg-slate-100">
              <Pencil className="h-3.5 w-3.5 text-slate-400" />
            </button>
            <button onClick={() => onDelete(entry.id)} className="p-1.5 rounded hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </button>
          </div>
        </div>

        {/* FAQ question preview */}
        {entry.type === 'faq' && entry.question && (
          <p className="text-xs text-slate-500 mt-1.5 italic">P: "{entry.question}"</p>
        )}

        {/* Content preview / expanded */}
        <div className="mt-2">
          <p className={`text-sm text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {entry.type === 'faq' ? `R: ${entry.content}` : entry.content}
          </p>
          {entry.content.length > 120 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-600 mt-1 flex items-center gap-0.5"
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Menos</> : <><ChevronDown className="h-3 w-3" /> Más</>}
            </button>
          )}
        </div>

        {/* Footer: tags + tokens */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {entry.tags.length > 4 && (
              <span className="text-xs text-slate-400">+{entry.tags.length - 4}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>P{entry.priority}</span>
            <span>~{tokens} tok</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Context Preview ────────────────────────────────────
function ContextPreview({ entries }: { entries: KBEntry[] }) {
  const [testQuery, setTestQuery] = useState('¿Tienen stock disponible?')
  const [showPreview, setShowPreview] = useState(false)

  const { context, tokensUsed, entriesUsed } = useMemo(
    () => buildKBContext(entries, testQuery),
    [entries, testQuery]
  )

  return (
    <div className="card">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Preview del Contexto
          </h3>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-indigo-600"
          >
            {showPreview ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Simula qué información se inyecta al modelo según la pregunta
        </p>

        <div className="flex gap-2 mb-3">
          <input
            value={testQuery}
            onChange={e => setTestQuery(e.target.value)}
            className="input text-sm flex-1"
            placeholder="Simular pregunta del comprador..."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-slate-900">{entriesUsed}</p>
            <p className="text-xs text-slate-500">Entradas</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-indigo-600">{tokensUsed}</p>
            <p className="text-xs text-slate-500">Tokens</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600">${(tokensUsed * 0.000001).toFixed(5)}</p>
            <p className="text-xs text-slate-500">Costo est.</p>
          </div>
        </div>

        {showPreview && context && (
          <div className="bg-slate-900 rounded-lg p-3 overflow-auto max-h-64">
            <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">{context}</pre>
          </div>
        )}

        {showPreview && !context && (
          <p className="text-sm text-slate-400 italic">No hay entradas activas para mostrar</p>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────
export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState<KBEntry[]>(DEFAULT_ENTRIES)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<KBEntry | undefined>()
  const [filterType, setFilterType] = useState<KBEntryType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (filterType !== 'all' && e.type !== filterType) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          (e.question || '').toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [entries, filterType, searchQuery])

  const stats = useMemo(() => {
    const active = entries.filter(e => e.active)
    const totalTokens = active.reduce((sum, e) => sum + estimateTokens(e.content + (e.question || '')), 0)
    return {
      total: entries.length,
      active: active.length,
      totalTokens,
      byType: Object.fromEntries(
        (Object.keys(KB_TYPE_CONFIG) as KBEntryType[]).map(t => [t, entries.filter(e => e.type === t).length])
      )
    }
  }, [entries])

  const handleSave = (data: Omit<KBEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => 
        e.id === editingEntry.id 
          ? { ...e, ...data, updatedAt: new Date().toISOString() }
          : e
      ))
    } else {
      const newEntry: KBEntry = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEntries(prev => [...prev, newEntry])
    }
    setShowForm(false)
    setEditingEntry(undefined)
  }

  const handleEdit = (entry: KBEntry) => {
    setEditingEntry(entry)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta entrada?')) {
      setEntries(prev => prev.filter(e => e.id !== id))
    }
  }

  const handleToggle = (id: string) => {
    setEntries(prev => prev.map(e => 
      e.id === id ? { ...e, active: !e.active, updatedAt: new Date().toISOString() } : e
    ))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Base de Conocimiento</h1>
          </div>
          <button 
            onClick={() => { setEditingEntry(undefined); setShowForm(true) }}
            className="btn btn-primary text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva</span>
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Entrena al bot con ejemplos, información y reglas. Menos es más — prioriza calidad.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-slate-500">Activas</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-indigo-600">{stats.totalTokens}</p>
          <p className="text-xs text-slate-500">Tokens</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-amber-600">{stats.byType.faq || 0}</p>
          <p className="text-xs text-slate-500">Q&A</p>
        </div>
      </div>

      {/* Context Preview */}
      <div className="mb-4">
        <ContextPreview entries={entries} />
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4">
          <EntryForm
            entry={editingEntry}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingEntry(undefined) }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input pl-9 text-sm"
            placeholder="Buscar entradas..."
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterType === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({entries.length})
          </button>
          {(Object.entries(KB_TYPE_CONFIG) as [KBEntryType, typeof KB_TYPE_CONFIG[KBEntryType]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {config.emoji} {stats.byType[key] || 0}
            </button>
          ))}
        </div>
      </div>

      {/* Entries list */}
      <div className="space-y-2">
        {filteredEntries.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
            <p className="text-sm text-slate-500">
              {searchQuery ? 'No se encontraron entradas' : 'No hay entradas aún. ¡Creá la primera!'}
            </p>
          </div>
        )}
        {filteredEntries.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs font-medium text-blue-800 mb-1.5">💡 Tips para optimizar tokens:</p>
        <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
          <li><strong>Ejemplos Q&A</strong> son lo más poderoso — el bot copia tu estilo</li>
          <li><strong>Tags precisos</strong> = solo se inyecta lo relevante a cada pregunta</li>
          <li><strong>Prioridad 1</strong> = siempre se incluye (úsalo para reglas clave)</li>
          <li><strong>Menos texto, más impacto</strong> — sé conciso en cada entrada</li>
          <li>Usa el <strong>Preview</strong> para ver exactamente qué recibe el modelo</li>
        </ul>
      </div>
    </div>
  )
}