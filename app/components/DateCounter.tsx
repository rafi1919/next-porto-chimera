'use client'

import { useEffect, useState } from "react";



export default function DateCounter() {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-7xl font-bold text-diamond-900"> 
            {date.getMonth()}.{date.getDate()}
        </div>
    );
}