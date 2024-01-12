import { useEffect, useState } from 'react';

const DigitalClock = () => {
  const [dateTime, setdateTime] = useState('');

  const currentTime = () => {
    const date = new Date();
    const time = date.toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    const weekday = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ];
    const week = weekday[date.getDay()];
    const text = `${time}, ${week}`;
    setdateTime(text);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      currentTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dateTime]);

  return <p>{dateTime}</p>;
};

export default DigitalClock;
