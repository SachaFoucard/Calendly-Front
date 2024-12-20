import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './Pages/Admin';
import Book from './Pages/Book';
import { CalendarProvider } from './Context/CalendarContext';
import ErrorPage from './Pages/ErrorPage';
import ThanksPage from './Pages/ThanksPage';

const App = () => {
  return (
    <CalendarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Admin />} />
          <Route path="/" element={<Book />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/Merci" element={<ThanksPage />} />

        </Routes>
      </BrowserRouter>
    </CalendarProvider>
  );
};

export default App;
