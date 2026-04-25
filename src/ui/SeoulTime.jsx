import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default function SeoulTime({ prefix = "KST" }) {
  const [time, setTime] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    const now = new Date();
    const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    let intervalId;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 60000);
    }, msToNextMinute);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return <span>{prefix} {time}</span>;
}
