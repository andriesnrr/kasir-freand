'use client'
import { useEffect, useState } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  maxHeight?: string
}

export default function Modal({ open, onClose, children, title, maxHeight = '85vh' }: ModalProps) {
  const [visible, setVisible] = useState(open)
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)))
    } else {
      setAnimIn(false)
      const t = setTimeout(() => setVisible(false), 350)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: animIn ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-surface-container-low flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
        style={{
          borderRadius: '32px 32px 0 0',
          maxHeight,
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full mx-auto mt-4 mb-2" />
          {title && (
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="font-display text-title text-on-surface">{title}</h2>
              <button onClick={onClose} className="text-outline hover:text-on-surface p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </>
  )
}
