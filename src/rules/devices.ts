// Devices shown in the "Devices" card of each tab (layout from the design mockup).
// Content copied from the mockup (DeviceCard.dc.html, design decision 2026-11-15);
// "tablet" changed to "laptop" because the app runs on the crew laptop.

import type { LayerId } from './layers'

export interface Device {
  name: string
  measures: string
  why: string
}

export interface DeviceInfo {
  devices: Device[]
  steps: string[]
}

export type DeviceTab = LayerId | 'radiation'

export const DEVICES: Partial<Record<DeviceTab, DeviceInfo>> = {
  "bones": {
    "devices": [
      {
        "name": "Blood & urine analyzer",
        "measures": "Urine calcium and bone-loss markers",
        "why": "Bones lose mass in weightlessness; this catches it early."
      }
    ],
    "steps": [
      "Prick your finger and place a drop on the cartridge.",
      "Insert it into the analyzer; results appear in about 10 min."
    ]
  },
  "muscles": {
    "devices": [
      {
        "name": "Body mass device",
        "measures": "Body mass",
        "why": "Scales don’t work in zero-g; this tracks weight and muscle loss."
      },
      {
        "name": "Hand dynamometer",
        "measures": "Grip strength",
        "why": "A quick daily check that your muscles keep their strength."
      }
    ],
    "steps": [
      "Sit in the body mass device seat and strap in; it gently rocks you to measure mass.",
      "Then squeeze the dynamometer 3 times as hard as you can."
    ]
  },
  "organs": {
    "devices": [
      {
        "name": "Portable ultrasound",
        "measures": "Kidneys and liver",
        "why": "Spots kidney stones and organ changes early."
      },
      {
        "name": "Eye scanner (OCT)",
        "measures": "Optic nerve swelling",
        "why": "Detects space-related vision changes (SANS)."
      },
      {
        "name": "Eye tonometer",
        "measures": "Intraocular pressure",
        "why": "Pressure changes in space can affect your vision."
      }
    ],
    "steps": [
      "Ultrasound: follow the on-screen guide for probe placement.",
      "Eye scanner: rest your chin on the stand and look at the dot for 30 s.",
      "Tonometer: hold still while the device touches the eye surface."
    ]
  },
  "circulation": {
    "devices": [
      {
        "name": "Smart shirt",
        "measures": "Heart rate, ECG, SpO₂, breathing, temperature",
        "why": "Monitors your heart and lungs all day without wires."
      },
      {
        "name": "Automatic blood pressure cuff",
        "measures": "Blood pressure",
        "why": "Fluid shifts in weightlessness change your blood pressure."
      }
    ],
    "steps": [
      "Put on the shirt in the morning and check that the indicator is green.",
      "Wrap the cuff on your arm, sit still and press Start."
    ]
  },
  "hydration": {
    "devices": [
      {
        "name": "Smart water bottle",
        "measures": "Water intake",
        "why": "Thirst is weaker in space, so intake is counted for you."
      },
      {
        "name": "Urine test reader",
        "measures": "Urine density and electrolytes",
        "why": "Shows dehydration and kidney-stone risk."
      }
    ],
    "steps": [
      "Drink only from the bottle; it counts automatically.",
      "In the morning, wet a test strip and insert it into the reader."
    ]
  },
  "sleep": {
    "devices": [
      {
        "name": "Wrist sleep tracker",
        "measures": "Sleep duration and quality, light exposure, circadian rhythm",
        "why": "Without day and night your body clock drifts; this keeps sleep on track."
      }
    ],
    "steps": [
      "Wear it on your wrist at all times; charge it during your workout."
    ]
  },
  "radiation": {
    "devices": [
      {
        "name": "Ship radiation sensor",
        "measures": "Current dose rate",
        "why": "Warns the crew when to move to the storm shelter."
      },
      {
        "name": "Personal dosimeter",
        "measures": "Your total mission dose",
        "why": "Tracks your own exposure against safe limits."
      }
    ],
    "steps": [
      "Always wear the dosimeter on your chest.",
      "If the app shows “No update”, connect it to the laptop by USB."
    ]
  }
}
