// components/shop/CountdownTimer.js
import React, { useState, useEffect } from 'react';

// Helper function to calculate time difference
const calculateTimeLeft = (endDate) => {
    // Ensure endDate is a valid date object or string parseable by Date
    const targetDate = new Date(endDate);
    if (isNaN(targetDate.getTime())) {
         // Handle invalid date input - return all zeros or throw an error
         console.error("Invalid endDate provided to CountdownTimer:", endDate);
         return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const difference = targetDate.getTime() - Date.now(); // Use Date.now() for current time
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference // Keep the total milliseconds if needed
        };
    } else {
        // Time is up
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    return timeLeft;
};

// The Countdown Timer Component
const CountdownTimer = ({ endDate }) => {
    // Initialize state with calculated time left
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endDate));

    useEffect(() => {
        // Exit early if the date is invalid or time is already up on initial load
        if (timeLeft.total <= 0) {
            return;
        }

        // Set up the timer to update every second
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(endDate);
            setTimeLeft(newTimeLeft);

            // Clear interval if the time runs out
            if (newTimeLeft.total <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        // Cleanup function: clear the interval when the component unmounts or endDate changes
        return () => clearInterval(timer);

    }, [endDate]); // Re-run the effect if the endDate prop changes


    // Helper to format time units with leading zeros
    const formatTime = (value) => value.toString().padStart(2, '0');

    // Build the display string
    const timerComponents = [];
    if (timeLeft.days > 0) timerComponents.push(`${timeLeft.days}d`);
    // Always show hours, minutes, seconds even if days are present, format them
    timerComponents.push(`${formatTime(timeLeft.hours)}h`);
    timerComponents.push(`${formatTime(timeLeft.minutes)}m`);
    timerComponents.push(`${formatTime(timeLeft.seconds)}s`);

    // Check if the countdown has finished
    const isTimeUp = timeLeft.total <= 0;

    return (
        <span className="countdown-timer fw-bold"> {/* Added fw-bold */}
            {isTimeUp ? "Offer ended" : timerComponents.join(' ')}
        </span>
    );
};

export default CountdownTimer;