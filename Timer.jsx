import { useEffect, useState, useRef } from "react";

function fetchServer(isExpired = false) {
  return !isExpired ? { status: "RUN", time: 10 } : { status: "EXPIRED", time: 0 };
}

export default function Timer() {
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("");
  const intervalRef = useRef();

  useEffect(() => {
    const { time, status } = fetchServer();
    setTime(time);
    setStatus(status);
  }, []);

  useEffect(() => {
    if (status !== "RUN" || intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setStatus(fetchServer(true).status);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [status]);

  return (
    <div>
      <h1>Статус: {status}</h1>
      <h2>Осталось: {time} сек.</h2>
    </div>
  );
}