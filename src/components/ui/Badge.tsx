import { clsx } from 'clsx'
import type { InteractionStatus, InteractionType, TierLevel } from '@/lib/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge',
        {
          'bg-slate-50 text-slate-700 border-slate-200': variant === 'default',
          'bg-slate-100 text-slate-800 border-slate-300': variant === 'secondary',
          'bg-green-50 text-green-700 border-green-200': variant === 'success',
          'bg-yellow-50 text-yellow-700 border-yellow-200': variant === 'warning',
          'bg-red-50 text-red-700 border-red-200': variant === 'destructive',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

// Specialized badge components for specific data types
export function TierBadge({ tier }: { tier: TierLevel }) {
  const config = {
    2: { label: 'Haiku', className: 'badge-tier-2' },
    3: { label: 'Sonnet', className: 'badge-tier-3' },
    4: { label: 'Manual', className: 'badge-tier-4' },
  }

  const { label, className } = config[tier]

  return <span className={clsx('badge', className)}>{label}</span>
}

export function StatusBadge({ status }: { status: InteractionStatus }) {
  const config = {
    pending: { label: 'Pendiente', className: 'badge-status-pending' },
    answered: { label: 'Respondida', className: 'badge-status-answered' },
    escalated: { label: 'Escalada', className: 'badge-status-escalated' },
    error: { label: 'Error', className: 'badge-status-escalated' },
  }

  const { label, className } = config[status]

  return <span className={clsx('badge', className)}>{label}</span>
}

export function TypeBadge({ type }: { type: InteractionType }) {
  const config = {
    question: { label: 'Consulta', className: 'badge-type-question' },
    message: { label: 'Mensaje', className: 'badge-type-message' },
  }

  const { label, className } = config[type]

  return <span className={clsx('badge', className)}>{label}</span>
}