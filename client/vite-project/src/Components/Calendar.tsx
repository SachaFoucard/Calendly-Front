import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MeetingTooltip from './MeetingWidget';
import NewMeeting from './NewMeeting';
import { formatISO } from 'date-fns';
import { add } from 'date-fns';

export default function Calendar({ meetings, onWeekChange }: any) {

  const [hoveredMeeting, setHoveredMeeting] = useState<any>(null);
  const [showModalMeetingCreation, setShowModalMeetingCreation] = useState<boolean>(false);
  const [meetingToCreate, setMeetingToCreate] = useState<any>(null); // Store the meeting data for modal
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 }); // Store modal position

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay()); // Start with Sunday of the current week
    return today;
  });

  // Utility functions
  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes() === 0 ? '00' : date.getMinutes()}`;
  };

  const getWeekDates = (startDate: Date) => {
    const weekStart = new Date(startDate);
    const weekDates: Date[] = [];

    // Set the start of the week (Sunday)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    // Generate the days of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDates.push(day);
    }

    return weekDates;
  };
  const weekDays = getWeekDates(currentWeekStart);

  const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 7 PM

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7); // Move one week back
    setCurrentWeekStart(newDate);
    onWeekChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7); // Move one week forward
    setCurrentWeekStart(newDate);
    onWeekChange(newDate);
  };

  const getMeetingForSlot = (date: Date, hour: number) => {
    return meetings.find((meeting: { startTime: string | number | Date }) => {
      const meetingDate = new Date(meeting.startTime);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getHours() === hour
      );
    });
  };

  const getTimeForHour = (hour: number) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date;
  };

  const PastDate = (date: Date): boolean => {
    const today = new Date()
    return today > date;
  }

  const createMeetingByMe = async (date: Date, hour: number, event: React.MouseEvent) => {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0); // Set the hour for the clicked slot

    const isoStartTime = new Date(startTime).toISOString();

    // Calculate end time by adding 1 hour
    const endTime = add(startTime, { hours: 1 });
    const isoEndTime = formatISO(endTime);

    const meeting = {
      startTime: isoStartTime,  // Start time in ISO format
      endTime: isoEndTime,  // End time is 1 hour after start time
      userBooker: import.meta.env.VITE_MY_MAIL,  // Replace with logged-in user's email
      to: '',  // Target email (placeholder), // #mail to 
      customerName: 'Sacha Foucard',
      customerMail: import.meta.env.VITE_MY_MAIL,
      title: '' // #title
    };

    // Get position of the clicked cell
    const { top, left } = (event.target as HTMLElement).getBoundingClientRect();

    // Check if a meeting already exists at the same time
    const findMeeting = meetings.find((item: any) => item.startTime == meeting.startTime);

    const today = new Date()
    const beforeToday = today > date
    // If a meeting is already booked at this time or the date is in the past, return and do not open the modal 
    if (findMeeting ||  beforeToday) { // 
      setShowModalMeetingCreation(false);
      return; // No modal will open
    }

    // If no meeting is booked, open the modal to create a new meeting
    setMeetingToCreate(meeting);
    setModalPosition({ top, left });
    setShowModalMeetingCreation(true);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden ">
      <div className="flex justify-between items-center p-4 bg-indigo-600 text-white">
        <button onClick={handlePreviousWeek} className="p-1 hover:bg-indigo-700 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} -
          {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <button onClick={handleNextWeek} className="p-1 hover:bg-indigo-700 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 border-r bg-gray-50"></div>
            {weekDays.map((date, i) => (
              <div key={i} className="p-2 text-center border-r bg-gray-50">
                <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-sm text-gray-500">{date.toLocaleDateString('en-US', { day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {hours.map((hour) => (

            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 border-r bg-gray-50 text-sm">
                {formatTime(getTimeForHour(hour))}
              </div>
              {weekDays.map((date, dayIndex) => {
                const meeting = getMeetingForSlot(date, hour);
                return (
                  <div
                    key={dayIndex}
                    onClick={(event) => createMeetingByMe(date, hour, event)} // Pass the event for position
                    className={`p-2 border-r min-h-[64px] ${meeting ? 'bg-blue-50' : ''} ${PastDate(date) ? 'bg-gray-100' : 'hover:bg-blue-50'}`}
                  >

                    {meeting && (
                      <div
                        className="text-sm relative"
                        onMouseEnter={() => setHoveredMeeting(meeting)}
                        onMouseLeave={() => setHoveredMeeting(null)}
                      >
                        <div className="font-medium text-blue-800">{meeting.title}</div>
                        <div className="text-blue-600">{meeting.customerName}</div>
                        {hoveredMeeting === meeting && <MeetingTooltip meeting={meeting} />}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Modal for creating a new meeting */}
      {showModalMeetingCreation && (
        <div
          style={{
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            zIndex: 9999,
            transform: 'translate(10px, 10px)' // Optional offset for the modal
          }}
          className="bg-white rounded-lg shadow-lg p-4 w-[250px] min-w-[250px]"
        >
          <NewMeeting meeting={meetingToCreate} />
        </div>
      )}
    </div>
  );
};

