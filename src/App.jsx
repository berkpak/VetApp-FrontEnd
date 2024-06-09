import { Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Doctor from './Pages/Doctor/Doctor';
import Animal from './Pages/Animal/Animal';
import Navbar from './Components/Navbar/Navbar';
import Customer from './Pages/Customer/Customer';
import Report from './Pages/Report/Report';
import Vaccine from './Pages/Vaccine/Vaccine';
import Appointment from './Pages/Appointment/Appointment';
import AvailableDate from './Pages/AvailableDate/AvailableDate';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/doctor' element={<Doctor />}>
          <Route index={true} element={<AvailableDate />} />
        </Route>
        <Route path='/customer' element={<Customer />}></Route>
        <Route path='/animal' element={<Animal />}></Route>
        <Route path='/report' element={<Report />}></Route>
        <Route path='/vaccine' element={<Vaccine />}></Route>
        <Route path='/appointment' element={<Appointment />}></Route>
      </Routes>
    </>
  );
}

export default App;
