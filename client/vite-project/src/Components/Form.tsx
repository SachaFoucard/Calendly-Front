import { Clock } from 'lucide-react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meeting } from '../Types/Types'


export default function Form({ isActive, dayInformation, hourSelected }: { isActive: boolean, dayInformation: string, hourSelected: string }) {
    const { register, handleSubmit, formState: { errors } } = useForm<Meeting>(); // Specify 'Meeting' type

    const nav = useNavigate();
    const id = useId();

    const [formattedDate, setFormattedDate] = useState<string | null>(null);
    const [formattedTime, setFormattedTime] = useState<string | null>(null);

    const [formattedEndTime, setFormattedEndTime] = useState<string>('');
    const [isoEndTime, setIsoEndTime] = useState<string>('');

    // Utility functions to build formatISO from destructuring format 
    const getDateFromDestructuringFormat = (format: string, hourSelected: string): string => {
        const date = new Date(format);  // Parse the date string
        const year = date.getFullYear();  // Get the full year
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Get the month (0-indexed, so +1) and pad with leading zero
        const day = String(date.getDate()).padStart(2, '0');  // Get the day and pad with leading zero

        return `${year}-${month}-${day}T${hourSelected.split('T')[1]}`; // Return in 'YYYY-MM-DDTHH:MM:SS.000Z' format
    };

    const isoHoursToString = (dateString: string): string => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const calculateEndTime = (startTime: string) => {
        const startDate = new Date(startTime);  // Parse the start time string

        // Add 1 hour to the start time
        startDate.setHours(startDate.getHours() + 1);

        // Format the end time to "HH:MM"
        const hours = String(startDate.getHours()).padStart(2, '0');
        const minutes = String(startDate.getMinutes()).padStart(2, '0');
        const formattedEndTime = `${hours}:${minutes}`;

        // Convert to ISO string format for database use
        const isoEndTime = startDate.toISOString();

        // Update the state
        setFormattedEndTime(formattedEndTime);
        setIsoEndTime(isoEndTime);
    };

    useEffect(() => {

        if (dayInformation && hourSelected) {
            const startTime = getDateFromDestructuringFormat(dayInformation, hourSelected);
            setFormattedDate(startTime);
            setFormattedTime(isoHoursToString(startTime));
            calculateEndTime(startTime);
        }
    }, [dayInformation, hourSelected]);

    // Handle form submission
    const onSubmit: SubmitHandler<Meeting> = async (data: any) => {
        if (!hourSelected) {
            alert('Please select a time.');
            return;
        }

        const createMeeting: Meeting = {
            ...data,
            _id: id,
            startTime: formattedDate ?? '',
            endTime: isoEndTime,  // You can add logic to set the end time here if needed
            userBooker: data.customerMail,
            to: 'sachafoucard8@gmail.com', // Placeholder email, adjust if necessary
        };

        console.log("createMeeting", createMeeting);

        const baseUrl = import.meta.env.VITE_API_NODE_ENV === 'development'
            ? import.meta.env.VITE_API_LOCAL
            : import.meta.env.VITE_API_VERCEL;


        try {
            const response = await fetch(`${baseUrl}/api/meetings/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createMeeting),
            });

            if (!response.ok) {
                return null;
            }
            alert('Meeting created successfully!');
            nav('/Merci')

        } catch (error) {
            console.error('Error creating meeting:', error);
            alert('Failed to create meeting. Please try again.');
        }
    };

    if (!isActive) return null;

    return (
        <div className="p-6 bg-white shadow rounded-lg my-5">
            <h1 className="py-5 text-2xl font-bold text-gray-700 text-center">Complete Your Booking</h1>

            {/* Time Info */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-2 text-gray-600 text-lg">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>{formattedTime ? `${formattedTime} PM - ${formattedEndTime} PM` : "No time selected"}</span>
            </div>

            {/* Error Message */}
            {errors.customerName && <div className="bg-red-100 text-red-700 p-2 rounded my-2">Name is required</div>}
            {errors.customerMail && <div className="bg-red-100 text-red-700 p-2 rounded my-2">Email is required</div>}
            {errors.title && <div className="bg-red-100 text-red-700 p-2 rounded my-2">Event Title is required</div>}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Input */}
                <div className="mb-4">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        id="customerName"
                        type="text"
                        {...register("customerName", { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <label htmlFor="customerMail" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="customerMail"
                        type="email"
                        {...register("customerMail", { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Event Title Input */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                    <input
                        id="title"
                        type="text"
                        {...register("title", { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
                >
                    Book Now
                </button>
            </form>
        </div>
    );
}
