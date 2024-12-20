import { useEffect, useState } from 'react';
import Calendar from '../Components/Calendar';
import { Meeting } from '../Types/Types';

const Admin = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch meetings for the selected week
  const fetchMeetings = async (queryDate: Date) => {
    try {
      const isoDate = queryDate.toISOString();
      
      const data = await fetch(
        `https://calendly-back.onrender.com/api/weeklyMeetings?date=${isoDate}`
      );
  
      if (!data.ok) {
        throw new Error(`Error: ${data.status} ${data.statusText}`);
      }
  
      const json = await data.json();
      setMeetings(json);
      console.log('Fetched meetings:', json);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  // useEffect hook to fetch meetings whenever currentDate changes
  useEffect(() => {
    fetchMeetings(currentDate);
  }, [currentDate]); // This will run when currentDate is updated

  
  // Navigate to the current week (default view)
  const handleWeekChange = (weekDate: Date | null = null) => {
    const queryDate = weekDate || new Date();
    setCurrentDate(queryDate); // This triggers useEffect to fetch meetings
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
        <p className="text-gray-600 mt-1">View and manage your upcoming meetings</p>
      </div>

      <div className="flex justify-between items-center mb-6">
      
        <h2 className="text-lg font-semibold text-gray-800">
          Week of {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </h2>
        
      </div>

      <Calendar meetings={meetings} onWeekChange={handleWeekChange} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
        <div className="bg-white rounded-lg shadow divide-y">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div key={meeting?._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                      {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {meeting?.customerName} ({meeting?.customerMail})
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        meeting.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : meeting.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No meetings found for this week.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
