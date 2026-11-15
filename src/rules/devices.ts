// Devices shown in the "Devices" card of each tab (layout from the design mockup).
// Content follows docs/devices.md: what each device measures, why, and how to use it.

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
  bones: {
    devices: [
      { name: 'Urine test strip + laptop camera', measures: 'Urine calcium', why: 'Bones lose mass in weightlessness; rising calcium in urine catches it early.' },
      { name: 'Exercise machines', measures: 'Training time', why: 'Daily resistance training is the main protection for bones.' },
    ],
    steps: ['Once a week, dip the strip in urine and wait 1–2 min.', 'Hold it up to the laptop camera; the app reads the colors.'],
  },
  muscles: {
    devices: [
      { name: 'Hand dynamometer', measures: 'Grip strength', why: 'A quick check that your muscles keep their strength without gravity.' },
      { name: 'Exercise machines', measures: 'Training time', why: 'Logs every workout on its own.' },
    ],
    steps: ['Once a week, squeeze the dynamometer 3 times as hard as you can.', 'It sends the best result by itself.'],
  },
  organs: {
    devices: [
      { name: 'Urine test strip + laptop camera', measures: 'Urine calcium (kidneys)', why: 'High calcium raises the risk of kidney stones.' },
      { name: 'Glucometer', measures: 'Fasting blood sugar (liver)', why: 'In flight the body responds less well to insulin.' },
      { name: 'Thermometer', measures: 'Body temperature', why: 'Fever is often the first sign of an infection in a closed cabin.' },
    ],
    steps: [
      'Strip: dip it, wait 1–2 min, hold it up to the laptop camera.',
      'Glucometer: before breakfast, prick a finger and put a drop on the strip.',
      'Thermometer: every morning, under the tongue for 1 minute.',
    ],
  },
  circulation: {
    devices: [
      { name: 'Wristband', measures: 'Heart rate, every second', why: 'Watches your heart all day without wires.' },
      { name: 'Blood pressure cuff', measures: 'Blood pressure', why: 'Fluid shifts in weightlessness change your blood pressure.' },
    ],
    steps: ['Wear the wristband all the time.', 'Every morning: rest 5 min, feet in foot restraints, wrap the cuff on your arm and press Start.'],
  },
  hydration: {
    devices: [{ name: 'Water pouches, 250 ml', measures: 'Water intake', why: 'Thirst is weaker in space, so intake is counted for you.' }],
    steps: ['After each pouch, press “+1 pouch”.', 'Goal: 8 pouches (2 L) a day.'],
  },
  sleep: {
    devices: [{ name: 'Wristband', measures: 'Sleep duration', why: 'Without day and night your body clock drifts; this keeps sleep on track.' }],
    steps: ['Wear it at night; nothing else to do.'],
  },
  radiation: {
    devices: [
      { name: 'Ship radiation sensors', measures: 'Current dose rate', why: 'Warn the crew when to move to the storm shelter.' },
      { name: 'Personal dosimeter', measures: 'Your personal dose', why: 'Records your own exposure for the flight surgeons.' },
    ],
    steps: ['Always wear the dosimeter.', 'If the ship sensor is silent for more than 2 h, connect the dosimeter to the laptop.'],
  },
}
