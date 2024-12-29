import { useCallback, useContext, useEffect, useState } from 'react';
import { CalendarContext } from '../Context/CalendarContext';
import Form from '../Components/Form';
import { parseISO, addHours, isEqual, format, isBefore, startOfToday } from 'date-fns';

export default function TimeAvailable() {
    const { dayClicked } = useContext(CalendarContext);

    const [currentDay, setCurrentDay] = useState<Date>(startOfToday());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [meetingsOfDay, setMeetingsOfDay] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [loading, Setloading] = useState(false)

    // Fetch meetings for the selected day
    const fetchMeetingsByDay = async (isoDay: string) => {
        try {
            Setloading(true)
            const cleanedDate = isoDay.split('+')[0];
            console.log('cleanedDate', cleanedDate);

            const baseUrl = import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_API_LOCAL
                : import.meta.env.VITE_API_VERCEL;

            const response = await fetch(
                `${baseUrl}/api/meetings/day?day=${cleanedDate}`
            );
            if (!response.ok) {
                console.error('Failed to fetch meetings:', response.statusText);
                return;
            }
            const meetings = await response.json();
            setMeetingsOfDay(meetings);
            Setloading(false)
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    // Generate time slots for the selected day from 9:00 AM to 6:00 PM
    const generateSlots = useCallback((date: Date | string) => {
        const baseDate = typeof date === 'string' ? parseISO(date) : date;
        const slots: string[] = [];
        for (let hour = 9; hour < 19; hour++) {
            slots.push(addHours(baseDate, hour).toISOString());
        }
        return slots;
    }, []);

    // Check if a slot is disabled
    const isSlotDisabled = useCallback((slot: string) => {
        const now = new Date();
        const slotDate = parseISO(slot);

        return (
            isBefore(slotDate, now) || meetingsOfDay.some(
                (meeting) =>
                    isEqual(parseISO(meeting.startTime), parseISO(slot)) &&
                    meeting.isAvailable === "false"
            ));
    }, [meetingsOfDay]);

    // Format time to display it as "11:00"
    const formatTime = (isoTime: string): string => {
        return format(parseISO(isoTime), 'HH:mm');
    };

    // Handle slot selection and form visibility
    const onSelectSlot = (slot: string) => {
        setSelectedSlot(slot);
        setOpenForm(true);
    };

    // Effect to run on `dayClicked` change
    useEffect(() => {
        const dayToUse = dayClicked ? parseISO(dayClicked.toString()) : currentDay;
        setCurrentDay(dayToUse);
        fetchMeetingsByDay(dayToUse.toISOString());
        setAvailableSlots(generateSlots(dayToUse));
    }, [dayClicked]);

    if (loading) return (<>
        <div className='flex justify-center fixed inset-0 items-center'>
            <div className="float-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                    className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
                >Loading...</span>            </div>
        </div>

    </>
    )

    return (
        <>
            <h1 className="m-5 font-bold text-3xl">Available Time Slots</h1>
            <p className="m-5 text-gray-500">
                {dayClicked &&
                    format(parseISO(dayClicked.toString()), 'dd MMMM yyyy')}
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {availableSlots.map((slot) => {
                    const isDisabled = isSlotDisabled(slot);

                    return (
                        <button
                            key={slot}
                            onClick={() => !isDisabled && onSelectSlot(slot)}
                            disabled={isDisabled}
                            className={`p-3 md:p-5 rounded-lg text-sm font-medium ${selectedSlot === slot
                                ? 'bg-blue-600 text-white'
                                : isDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                                }`}
                        >
                            {formatTime(slot)}
                        </button>
                    );
                })}
            </div>

            {openForm && selectedSlot && (
                <Form
                    isActive={openForm}
                    dayInformation={dayClicked ? dayClicked?.toString() : ''}
                    hourSelected={selectedSlot}
                />
            )}
        </>
    );
}
