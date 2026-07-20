import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import './DevHeroArtTuner.css'

// Mirrors the CSS variable fallbacks in Home.css (.dhome-hero-art / -img).
// Keep these in sync if the defaults there ever change.
export const HERO_ART_DEFAULTS = {
  top: -100,
  right: -101,
  width: 201,
  height: 254,
  flip: true,
  fade: 100,
}

export type HeroArtValues = typeof HERO_ART_DEFAULTS

export function heroArtCssVars(v: HeroArtValues): CSSProperties {
  return {
    '--hero-art-top': `${v.top}%`,
    '--hero-art-right': `${v.right}%`,
    '--hero-art-width': `${v.width}%`,
    '--hero-art-height': `${v.height}%`,
    '--hero-art-flip': v.flip ? -1 : 1,
    '--hero-art-fade': `${v.fade}%`,
  } as CSSProperties
}

const RANGE_FIELDS: { key: keyof Omit<HeroArtValues, 'flip'>; label: string; min: number; max: number }[] = [
  { key: 'top', label: 'Top', min: -400, max: 400 },
  { key: 'right', label: 'Right', min: -400, max: 400 },
  { key: 'width', label: 'Width', min: 5, max: 400 },
  { key: 'height', label: 'Height', min: 5, max: 400 },
  { key: 'fade', label: 'Fade (bottom)', min: 0, max: 100 },
]

interface Props {
  values: HeroArtValues
  setValues: Dispatch<SetStateAction<HeroArtValues>>
}

export default function DevHeroArtTuner({ values, setValues }: Props) {
  const set = (key: keyof Omit<HeroArtValues, 'flip'>, v: number) =>
    setValues(prev => ({ ...prev, [key]: v }))

  const toggleFlip = () => setValues(prev => ({ ...prev, flip: !prev.flip }))

  const readout = [
    ...RANGE_FIELDS.map(f => `${f.key}: ${values[f.key]}%`),
    `flip: ${values.flip}`,
  ].join('\n')

  return (
    <div className="dev-hero-art-tuner">
      <p className="dev-hero-art-tuner-title">Hero art tuner</p>
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
        <button type="button" onClick={toggleFlip} className={values.flip ? 'active' : ''}>
          Flip horizontal
        </button>
        <button type="button" onClick={() => setValues(HERO_ART_DEFAULTS)}>
          Reset
        </button>
      </div>
      <pre className="dev-hero-art-tuner-readout">{readout}</pre>
    </div>
  )
}
