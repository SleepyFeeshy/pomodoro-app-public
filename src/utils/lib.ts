import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';

export function useInterval(callback, delay) {
  const savedCallback = useRef(null);
   
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
   
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function getMobileNavHeader(location: Location) {
  // const location = useLocation();
  const pathname = location.pathname;
  switch (pathname) {
  case "/":
    return "Pomodoro Timer"
    break
  case "/stats":
    return "Statistics";
    break;
  case "/settings":
    return "Settings";
    break;
  default:
    return "";
    break;
  }
}