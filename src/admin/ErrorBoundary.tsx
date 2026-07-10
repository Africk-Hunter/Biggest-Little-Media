import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// Firebase throws synchronously at module-eval time when config is missing
// or invalid (e.g. no .env.local yet) — without this, that crashes the whole
// admin route to a blank white page instead of an actionable message.
export default class AdminErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="admin-loading" style={{ flexDirection: 'column', gap: 8, textAlign: 'center', padding: 24 }}>
          <p>Admin panel failed to load — Firebase isn't configured yet.</p>
          <p style={{ fontSize: 13, opacity: 0.7 }}>See docs/SETUP.md and add a .env.local. ({this.state.error.message})</p>
        </div>
      )
    }
    return this.props.children
  }
}
