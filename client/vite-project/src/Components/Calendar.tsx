import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MeetingTooltip from './MeetingWidget';

export default function Calendar({ meetings, onWeekChange }: any) {

  const [hoveredMeeting, setHoveredMeeting] = useState<any>(null);

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


  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                <div className="text-sm text-gray-500">{date.toLocaleDateString('en-US', { day: 'numeric' })}</div>
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
                    className={`p-2 border-r min-h-[64px] ${meeting ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
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
    </div>
  );
};

