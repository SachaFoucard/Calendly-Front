import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


export default function NewMeeting({ meeting }: any) {
    const [title, setTitle] = useState<string>();
    const [to, setTo] = useState<string>();

    const create = async () => {

        const baseUrl = import.meta.env.VITE_API_NODE_ENV === 'development'
            ? import.meta.env.VITE_API_LOCAL
            : import.meta.env.VITE_API_VERCEL;

        // Ensure title and mail are not null before sending
        if (!title || !to) {
            alert('Please fill out all fields.');
            return;
        }


        const newMeeting = {
            _id: uuidv4(),
            ...meeting,
            title: title,
            to: to,
            status: 'confirmed',
            isAvailable: "false"
        }

        try {
            const response = await fetch(`${baseUrl}/api/meetings/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeeting),
            });

            if (!response.ok) {
                return null;
            }
            alert('Meeting created successfully!');
            //reload the page 
            window.location.reload();


        } catch (error) {
            console.error('Error creating meeting:', error);
            alert('Failed to create meeting. Please try again.');
        }
    };
   

    return (
        <div className="absolute bg-blue-50 rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
            <div className="space-y-2">
                <h4 className="font-small text-gray-400">
                    {title || 'New Meeting'}
                </h4>
                <div className="text-sm text-gray-600">
                    {/* Input field for "To" */}
                    <p className="space-x-2">
                        <span className="font-medium">To:</span>
                        <input
                            type="email"
                            value={to || ''}
                            onChange={(e) => setTo(e.target.value)}
                            className="border border-gray-300 p-1 text-xs rounded-md w-1/2"
                            placeholder="Enter email"
                        />
                    </p>
                    {/* Input field for "Title" */}
                    <p className="space-x-2">
                        <span className="font-medium">Title:</span>
                        <input
                            type="text"
                            value={title || ''}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 p-1 text-xs rounded-md w-1/2"
                            placeholder="Enter meeting title"
                        />
                    </p>
                    {/* Display other meeting details */}
                    {meeting?.startTime && (
                        <p>
                            <span className="font-light">Start Time:</span> {new Date(meeting?.startTime).toLocaleTimeString().slice(0, 5)}
                        </p>
                    )}
                    {meeting?.startTime && (
                        <p>
                            <span className="font-light">Start Date:</span> {new Date(meeting?.startTime).toLocaleDateString()}
                        </p>
                    )}
                    {meeting?.userBooker && (
                        <p>
                            <span className="font-light">From:</span> {meeting?.userBooker}
                        </p>
                    )}
                </div>
                <button className="text-white m-auto w-full p-2 text-xs rounded-lg bg-[#4F46E5] hover:bg-blue-400" onClick={() => create()}>
                    Create Meeting
                </button>
            </div>
        </div>
    );
}
