import { useContext, useEffect, useState } from 'react';
import { CalendarContext } from '../Context/CalendarContext';
import Form from '../Components/Form';
import { parseISO, addHours, isEqual, format, isBefore } from 'date-fns';

export default function TimeAvailable() {
    const { dayClicked } = useContext(CalendarContext);

    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [meetingsOfDay, setMeetingsOfDay] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);


    // Fetch meetings for the selected day
    const fetchMeetingsByDay = async (isoDay: string) => {
        try {
            const cleanedDate = isoDay.split('+')[0];

            const response = await fetch(
                `https://calendy-back.vercel.app/api/meetings/day?day=${cleanedDate}`
            );
            if (!response.ok) {
                console.error('Failed to fetch meetings:', response.statusText);
                return;
            }
            const meetings = await response.json();
            setMeetingsOfDay(meetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    // Generate time slots for the selected day from 9:00 AM to 6:00 PM
    const generateSlots = (isoDay: string) => {
        const baseDate = parseISO(isoDay);
        const slots: string[] = [];
        for (let hour = 9; hour < 19; hour++) {
            slots.push(addHours(baseDate, hour).toISOString());
        }
        return slots;
    };

    // Check if a slot is disabled
    const isSlotDisabled = (slot: string) => {

        const now = new Date();
        const slotDate = parseISO(slot)

        return (
            isBefore(slotDate, now) || meetingsOfDay.some(
                (meeting) =>
                    isEqual(parseISO(meeting.startTime), parseISO(slot)) &&
                    meeting.isAvailable === "false"
            ));
    };

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
        if (dayClicked) {
            fetchMeetingsByDay(dayClicked.toString());
            setAvailableSlots(generateSlots(dayClicked.toString()));
        }
    }, [dayClicked]);
    {
        console.log('meetingsOfDay', meetingsOfDay);

    }
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
