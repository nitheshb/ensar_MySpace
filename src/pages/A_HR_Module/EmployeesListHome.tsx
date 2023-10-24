import { Helmet } from 'react-helmet-async';
// sections
import EmployeesListView from './EmployeesList';

// ----------------------------------------------------------------------

export default function EmployeesListHome() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>

      <EmployeesListView />
    </>
  );
}
