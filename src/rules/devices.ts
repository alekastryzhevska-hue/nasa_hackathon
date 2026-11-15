// Devices shown in the "Devices" card of each tab (layout from the design mockup).
// Content follows docs/devices.md: what each device measures, why, and how to use it.
// Each device has its own "How to use", shown right under that device.

import type { LayerId } from './layers'

export interface Device {
  name: string
  measures: string
  why: string
  steps: string[]
}

export interface DeviceInfo {
  devices: Device[]
}

export type DeviceTab = LayerId | 'radiation'

const STRIP: Device = {
  name: 'Urine test strip + laptop camera',
  measures: 'Urine calcium',
  why: 'Bones lose mass in weightlessness; rising calcium in urine catches it early.',
  steps: ['Once a week, dip the strip in urine and wait 1–2 min.', 'Hold it up to the laptop camera; the app reads the colors.'],
}
const MACHINES: Device = {
  name: 'Exercise machines',
  measures: 'Training time',
  why: 'Daily resistance training is the main protection for bones and muscles.',
  steps: ['Nothing to do: each machine logs your workout by itself.'],
}
const WRISTBAND_HR: Device = {
  name: 'Wristband',
  measures: 'Heart rate, every second',
  why: 'Watches your heart all day without wires.',
  steps: ['Wear it all the time.', 'For the resting value, lie still for 5 min in the morning.'],
}

export const DEVICES: Partial<Record<DeviceTab, DeviceInfo>> = {
  bones: { devices: [STRIP, MACHINES] },
  muscles: {
    devices: [
      {
        name: 'Hand dynamometer',
        measures: 'Grip strength',
        why: 'A quick check that your muscles keep their strength without gravity.',
        steps: ['Once a week, squeeze it 3 times as hard as you can.', 'It sends the best result by itself.'],
      },
      MACHINES,
    ],
  },
  organs: {
    devices: [
      { ...STRIP, measures: 'Urine calcium (kidneys)', why: 'High calcium raises the risk of kidney stones.' },
      {
        name: 'Glucometer',
        measures: 'Fasting blood sugar (liver)',
        why: 'In flight the body responds less well to insulin.',
        steps: ['Before breakfast, prick a finger and put a drop on the strip.', 'It sends the result by itself.'],
      },
      {
        name: 'Thermometer',
        measures: 'Body temperature',
        why: 'Fever is often the first sign of an infection in a closed cabin.',
        steps: ['Every morning, under the tongue for 1 minute.'],
      },
    ],
  },
  circulation: {
    devices: [
      WRISTBAND_HR,
      {
        name: 'Blood pressure cuff',
        measures: 'Blood pressure',
        why: 'Fluid shifts in weightlessness change your blood pressure.',
        steps: ['Every morning, rest for 5 min with your feet in the foot restraints.', 'Wrap the cuff on your arm at heart level and press Start.'],
      },
    ],
  },
  hydration: {
    devices: [
      {
        name: 'Water pouches, 250 ml',
        measures: 'Water intake',
        why: 'Thirst is weaker in space, so intake is counted for you.',
        steps: ['After each pouch, press “+1 pouch”.', 'Goal: 8 pouches (2 L) a day.'],
      },
    ],
  },
  sleep: {
    devices: [
      {
        name: 'Wristband',
        measures: 'Sleep duration',
        why: 'Without day and night your body clock drifts; this keeps sleep on track.',
        steps: ['Wear it at night; nothing else to do.'],
      },
    ],
  },
  radiation: {
    devices: [
      {
        name: 'Ship radiation sensors',
        measures: 'Current dose rate',
        why: 'Warn the crew when to move to the storm shelter.',
        steps: ['Nothing to do: they measure all the time, also in the shelter.'],
      },
      {
        name: 'Personal dosimeter',
        measures: 'Your personal dose',
        why: 'Records your own exposure for the flight surgeons.',
        steps: ['Always wear it.', 'If the ship sensor is silent for more than 2 h, connect it to the laptop.'],
      },
    ],
  },
}
