import { useState } from "react";
import WelcomeAnimation from "src/components/Animation/Animation";
import Login from "src/pages/Auth/Auth";

export default function App() {
  const [animDone, setAnimDone] = useState(false);

  return (
    <>
      {!animDone && <WelcomeAnimation onComplete={() => setAnimDone(true)} />}
      {animDone && <Login />}
    </>
  );
}
