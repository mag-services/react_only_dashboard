interface AppFooterProps {
  /** Optional: use compact layout for standalone pages */
  compact?: boolean
}

export function AppFooter({ compact }: AppFooterProps) {
  return (
    <footer
      className={
        compact
          ? 'mt-auto border-t border-border/60 py-4 text-center text-xs text-muted-foreground'
          : 'mt-auto border-t border-border/60 px-4 py-4 lg:px-6 text-center text-sm text-muted-foreground'
      }
    >
      <p>© {new Date().getFullYear()} Vanuatu Bureau of Statistics</p>
    </footer>
  )
}
