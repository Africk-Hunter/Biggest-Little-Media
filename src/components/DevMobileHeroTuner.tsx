import { useState } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import './DevHeroArtTuner.css'

// Mirrors the CSS variable fallbacks in Home.css (.home-hero-bg / -fade).
// Keep these in sync if the defaults there ever change.
export const MOBILE_HERO_DEFAULTS = {
  width: 69,
  height: 100,
  x: 22,
  y: -1,
  zoom: 130,
  fade: 0,
  fadeTop: 38,
  fadeBottom: 72,
}

export type MobileHeroValues = typeof MOBILE_HERO_DEFAULTS

export function mobileHeroCssVars(v: MobileHeroValues): CSSProperties {
  return {
    '--mhero-width': `${v.width}%`,
    '--mhero-height': `${v.height}%`,
    '--mhero-x': `${v.x}%`,
    '--mhero-y': `${v.y}%`,
    '--mhero-zoom': `${v.zoom / 100}`,
    '--mhero-fade': `${v.fade}%`,
    '--mhero-fade-top': `${v.fadeTop}%`,
    '--mhero-fade-bottom': `${v.fadeBottom}%`,
  } as CSSProperties
}

const RANGE_FIELDS: { key: keyof MobileHeroValues; label: string; min: number; max: number }[] = [
  { key: 'width', label: 'Width', min: 5, max: 150 },
  { key: 'height', label: 'Height', min: 5, max: 150 },
  { key: 'x', label: 'X move', min: -100, max: 100 },
  { key: 'y', label: 'Y move', min: -100, max: 100 },
  { key: 'zoom', label: 'Zoom', min: 100, max: 220 },
  { key: 'fade', label: 'Fade (side)', min: 0, max: 100 },
  { key: 'fadeTop', label: 'Fade (top)', min: 0, max: 50 },
  { key: 'fadeBottom', label: 'Fade (bottom)', min: 50, max: 100 },
]

interface Props {
  values: MobileHeroValues
  setValues: Dispatch<SetStateAction<MobileHeroValues>>
}

function exportSnippet(v: MobileHeroValues): string {
  const fields = (Object.keys(v) as (keyof MobileHeroValues)[])
    .map(k => `  ${k}: ${v[k]},`)
    .join('\n')
  return `{\n${fields}\n}`
}

export default function DevMobileHeroTuner({ values, setValues }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [exported, setExported] = useState(false)
  const set = (key: keyof MobileHeroValues, v: number) =>
    setValues(prev => ({ ...prev, [key]: v }))

  const handleExport = async () => {
    const snippet = exportSnippet(values)
    try {
      await navigator.clipboard.writeText(snippet)
    } catch {
      console.log('[Mobile hero image tuner] export:\n' + snippet)
    }
    setExported(true)
    setTimeout(() => setExported(false), 1500)
  }

  return (
    <div className="dev-hero-art-tuner">
      <div className="dev-hero-art-tuner-header">
        <p className="dev-hero-art-tuner-title">Mobile hero image tuner</p>
        <button
          type="button"
          className="dev-hero-art-tuner-collapse"
          onClick={() => setCollapsed(c => !c)}
        >
          {collapsed ? '+' : '−'}
        </button>
      </div>
      {!collapsed && (
        <>
          <div className="dev-hero-art-tuner-grid">
            {RANGE_FIELDS.map(f => (
              <label key={f.key}>
                <span className="dev-hero-art-tuner-field-head">
                  {f.label}
                  <input
                    type="number"
                    className="dev-hero-art-tuner-number"
                    value={values[f.key]}
                    onChange={e => set(f.key, Number(e.target.value))}
                  />
                </span>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  value={values[f.key]}
                  onChange={e => set(f.key, Number(e.target.value))}
                />
              </label>
            ))}
          </div>
          <div className="dev-hero-art-tuner-actions">
            <button type="button" onClick={() => setValues(MOBILE_HERO_DEFAULTS)}>
              Reset
            </button>
            <button type="button" onClick={handleExport}>
              {exported ? 'Copied!' : 'Export'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
