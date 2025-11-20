import { useEffect, useState, useRef } from "react";

type Status = 'RUN' | 'EXPIRED'

interface Response {
  status:Status;
  time:number
}

function fetchServer(isExpired:boolean = false):Response {
  return !isExpired ? { status: "RUN", time: 10 } : { status: "EXPIRED", time: 0 };
}

export default function Timer() {
  const [time, setTime] = useState<number>(0);
  const [status, setStatus] = useState<Status>("RUN");
 const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const { time, status } = fetchServer();
    setTime(time);
    setStatus(status);
  }, []);

  useEffect(() => {
    if (status !== "RUN" || intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setTime((t: number) => {
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