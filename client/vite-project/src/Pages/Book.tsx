import TimeAvailable from '../Components/TimeAvailable';
import CalendarBooking from '../Components/CalendarBooking';


export default function Book() {

    return (
        <div className="flex flex-col md:flex-row md:space-x-4 w-full m-auto justify-center p-9">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <CalendarBooking />
            </div>
            <div className="w-full md:w-1/2">
                <TimeAvailable />
            </div>
        </div>

    );
}
