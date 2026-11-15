// "Devices" card from the design mockup: which devices a tab uses, what they measure,
// why, and a collapsible "How to use". Also used as a popover on the radiation strip.

import type { DeviceInfo } from '../rules/devices'

export function DeviceCard({ info, className = '' }: { info: DeviceInfo; className?: string }) {
  return (
    <section className={`device-card ${className}`} aria-label="Devices">
      <span className="eyebrow">Devices</span>
      <ul>
        {info.devices.map((d) => (
          <li key={d.name}>
            <span className="device-name">{d.name}</span>
            <span>
              <span className="muted">Measures:</span> {d.measures}
            </span>
            <span>
              <span className="muted">Why:</span> {d.why}
            </span>
            {/* "How to use" sits right under the device it describes. */}
            <details>
              <summary>
                How to use
                <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </summary>
              <ol>
                {d.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Small "Devices" pill on the radiation strip; opens the card above it.
export function DevicesPopover({ info }: { info: DeviceInfo }) {
  return (
    <details className="devices-pop">
      <summary aria-label="Radiation devices">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-default)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8.5 3h7a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 18.5v-13A2.5 2.5 0 0 1 8.5 3zM10.8 10.5a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0M12 7.5a3 3 0 0 1 2.6 1.5M9.4 9A3 3 0 0 1 12 7.5M9.4 12a3 3 0 0 0 5.2 0M9 17h6" />
        </svg>
        Devices
      </summary>
      <DeviceCard info={info} className="pop" />
    </details>
  )
}
