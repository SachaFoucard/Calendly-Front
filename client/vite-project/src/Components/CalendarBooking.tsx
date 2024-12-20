import { useContext, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarContext } from '../Context/CalendarContext';
import { formatISO } from 'date-fns';

const CalendarBooking = () => {
    const [days, setDays] = useState<number[]>([]);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const { setDayClicked } = useContext(CalendarContext);

    // Generate the days for the current month
    const generateDays = (month: number, year: number) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    };

    useEffect(() => {
        generateDays(currentMonth, currentYear);
    }, [currentMonth, currentYear]);

    const handleDateClick = (dayNumber: number) => {
        const selectedDate = new Date(currentYear, currentMonth, dayNumber);
        console.log('selectedDate',selectedDate);
        
        setSelectedDay(selectedDate); // Update selected day
        setDayClicked(formatISO(selectedDate)); // Set ISO date in context
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prevYear) => prevYear - 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prevYear) => prevYear + 1);
        } else {
            setCurrentMonth((prevMonth) => prevMonth + 1);
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handlePreviousMonth}
                    aria-label="Previous Month"
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    onClick={handleNextMonth}
                    aria-label="Next Month"
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const dayDate = new Date(currentYear, currentMonth, day);
                    const isSelected = selectedDay?.getTime() === dayDate.getTime();
                    const isToday = (() => {
                        const today = new Date();
                        return (
                            day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear()
                        );
                    })();

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`p-2 w-10 h-10 rounded-md flex items-center justify-center 
                                ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-300'}
                                ${isToday && !isSelected ? 'border-2 border-red-500' : ''}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarBooking;
