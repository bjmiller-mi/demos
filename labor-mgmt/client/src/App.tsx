import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import PunchClock from './pages/PunchClock'
import Timesheets from './pages/Timesheets'
import VacationRequests from './pages/VacationRequests'
import ManageVacation from './pages/ManageVacation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/punch-clock" replace />} />
          <Route path="punch-clock" element={<PunchClock />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="vacation-requests" element={<VacationRequests />} />
          <Route path="manage-vacation" element={<ManageVacation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
