# Health app — astronaut health self-monitoring

NASA Space Apps 2026 · challenge "Health Monitoring Software for Astronauts".

A web app that helps an astronaut on the way to Mars check their own health: devices
send data automatically, the app compares each value with the astronaut's own
pre-flight norm, shows a green / yellow / red status, explains why and says what to do.
Everything runs on board, without a link to Earth. Data in this prototype is simulated.

## Live demo

**https://alekastryzhevska-hue.github.io/nasa_hackathon/** — opens in the browser, nothing to install. It updates by itself a minute or
two after every push to `main`.

## Run it locally

Needs [Node.js](https://nodejs.org) (LTS) and git.

```bash
git pull
npm install
npm run dev
```

Then open http://localhost:5173 in the browser. Stop it with `Ctrl+C` in the terminal.

## Things to try

- Switch astronaut (top right): **Alex Rivera** is healthy, **Sam Okafor** sleeps badly,
  **Mia Chen** is losing bone.
- Click the body layers (Bones, Muscles, Organs…) and the tasks in the daily plan.
- Hydration: press **+ 250 ml**. Emotions: do the mood check-in.
- **🧪 Test panel** (bottom right): move sliders to make any metric yellow or red, or
  press **Simulate solar event** for the radiation alarm.

Thresholds are illustrative, not medical advice.
