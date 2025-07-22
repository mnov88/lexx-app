'use client'

import { KeyboardShortcuts, useKeyboardShortcuts } from '@/components/ui/KeyboardShortcuts'

export function KeyboardShortcutsProvider() {
  const { isShortcutsOpen, hideShortcuts } = useKeyboardShortcuts()

  return (
    <KeyboardShortcuts
      isOpen={isShortcutsOpen}
      onClose={hideShortcuts}
    />
  )
}