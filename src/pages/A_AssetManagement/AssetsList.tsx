import { Helmet } from 'react-helmet-async';
// sections
import AssetsListTableView from './Views/assets-list-table-view';

// ----------------------------------------------------------------------

export default function AssetsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>

      <AssetsListTableView />
    </>
  );
}
