import React, { createContext, useState, ReactNode } from 'react';

// Define types for the context values
interface CalendarContextType {
    dayClicked: Date | null;
    setDayClicked: (date: any) => void;
    monthClicked: number | null;
    setMonthClicked: (month: number) => void;
    yearClicked: number | null;
    setYearClicked: (year: number) => void;
}

interface CalendarProviderProps {
    children: ReactNode;
}

// Initialize the context with default values
export const CalendarContext = createContext<CalendarContextType>({
    dayClicked: null,
    setDayClicked: () => {}, // Default no-op function
    monthClicked: null,
    setMonthClicked: () => {}, // Default no-op function
    yearClicked: null,
    setYearClicked: () => {}, // Default no-op function
});

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
    const [dayClicked, setDayClickedState] = useState<Date | null>(null);
    const [monthClicked, setMonthClickedState] = useState<number | null>(null);
    const [yearClicked, setYearClickedState] = useState<number | null>(null);

    // Setters to update the state
    const setDayClicked = (date: Date) => {
        setDayClickedState(date);
    };

    const setMonthClicked = (month: number) => {
        setMonthClickedState(month);
    };

    const setYearClicked = (year: number) => {
        setYearClickedState(year);
    };

    return (
        <CalendarContext.Provider
            value={{
                dayClicked,
                setDayClicked,
                monthClicked,
                setMonthClicked,
                yearClicked,
                setYearClicked,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
