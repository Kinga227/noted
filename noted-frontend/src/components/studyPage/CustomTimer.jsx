import React, { useState, useEffect } from 'react';
import { useSubjectQuery } from '../../hooks/useSubjectQuery';

function CustomTimer({ subjectId, onClose }) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const { setMinutesSpent } = useSubjectQuery();

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setTime((prevTime) => {
          let newSeconds = prevTime.seconds + 1;
          let newMinutes = prevTime.minutes;
          let newHours = prevTime.hours;
          if (newSeconds === 60) {
            newMinutes++;
            newSeconds = 0;
          }
          if (newMinutes === 60) {
            newHours++;
            newMinutes = 0;
          }
          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleStop = async () => {
    const totalMinutes = time.hours * 60 + time.minutes;
    try {
      await setMinutesSpent(subjectId, totalMinutes);
      onClose();
    } catch (error) {
      console.error('Error saving study time:', error.message);
    }
  };

  const formattedTime = `${time.hours.toString().padStart(2, '0')}:${time.minutes
    .toString()
    .padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="main-content">
      <div style={{ fontSize: '3em' }}>
        <div className="counter">{formattedTime}</div>
        <div className="buttons">
          <button type="button" className="circle-button" onClick={handleStop}>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
              <path
                d="M38.5 21C38.5 29.2495 38.5 33.3742 35.9362 35.9362C33.376 38.5 29.2495 38.5 21 38.5C12.7505 38.5 8.62575 38.5 6.062 35.9362C3.5 33.376 3.5 29.2495 3.5 21C3.5 12.7505 3.5 8.62575 6.062 6.062C8.6275 3.5 12.7505 3.5 21 3.5C29.2495 3.5 33.3742 3.5 35.9362 6.062C37.6407 7.7665 38.2112 10.1622 38.4037 14"
                stroke="white"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              stop
            </svg>
          </button>
          {!isPaused ? (
            <button type="button" className="circle-button" id="pause" onClick={handlePauseToggle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path
                  d="M4.1665 37.5C4.1665 41.4291 4.1665 43.3916 5.38734 44.6125C6.60817 45.8333 8.57067 45.8333 12.4998 45.8333C16.429 45.8333 18.3915 45.8333 19.6123 44.6125C20.8332 43.3916 20.8332 41.4291 20.8332 37.5V12.5C20.8332 8.57079 20.8332 6.60829 19.6123 5.38746C18.3915 4.16663 16.429 4.16663 12.4998 4.16663C8.57067 4.16663 6.60817 4.16663 5.38734 5.38746C4.1665 6.60829 4.1665 8.57079 4.1665 12.5V29.1666M45.8332 12.5C45.8332 8.57079 45.8332 6.60829 44.6123 5.38746C43.3915 4.16663 41.429 4.16663 37.4998 4.16663C33.5707 4.16663 31.6082 4.16663 30.3873 5.38746C29.1665 6.60829 29.1665 8.57079 29.1665 12.5V37.5C29.1665 41.4291 29.1665 43.3916 30.3873 44.6125C31.6082 45.8333 33.5707 45.8333 37.4998 45.8333C41.429 45.8333 43.3915 45.8333 44.6123 44.6125C45.8332 43.3916 45.8332 41.4291 45.8332 37.5V20.8333"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                pause
              </svg>
            </button>
          ) : (
            <button type="button" className="circle-button" id="pause" onClick={handlePauseToggle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path
                  d="M6.25 25V39.5146C6.25 44.3271 11.5292 47.3667 15.8271 45.0312L22.5 41.4021M6.25 16.6667V10.4854C6.25 5.67291 11.5292 2.63332 15.8271 4.96874L42.5187 19.4854C43.5194 20.0175 44.3563 20.8118 44.94 21.7833C45.5237 22.7547 45.832 23.8667 45.832 25C45.832 26.1333 45.5237 27.2452 44.94 28.2167C44.3563 29.1881 43.5194 29.9825 42.5187 30.5146L29.1729 37.7729"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                continue
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomTimer;
