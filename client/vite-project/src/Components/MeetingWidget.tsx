
const MeetingTooltip = ({ meeting }: { meeting: any }) => {
 

  return (
    <div className="absolute right-full top-0 ml-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[250px] ">
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Customer:</span> {meeting.customerName}</p>
          <p><span className="font-medium">Link:</span> meeting.bookingLink</p>
          {meeting.status && (
            <p><span className="font-medium">status:</span> {meeting.status}</p>
          )}
          {meeting.startTime && (
            <p><span className="font-medium">startTime:</span> {new Date(meeting.startTime).toLocaleTimeString().slice(0,5)}</p>
          )}
          {meeting.customerMail && (
            <p><span className="font-medium">mail:</span> {meeting.customerMail}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default MeetingTooltip
