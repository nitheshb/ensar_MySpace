/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import isEqual from 'lodash/isEqual';
import { useState,useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// _mock
import { _userList, _roles, USER_STATUS_OPTIONS, _userFollowers} from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserItem, IUserProfileFollower, IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
import UserTableRow from 'src/sections/user/user-table-row';
import UserTableFiltersResult from 'src/sections/user/user-table-filters-result';
import UserTableToolbar from 'src/sections/user/user-table-toolbar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { getEmpByStatus } from 'src/db/dbQueryFirestore';
import { useAuthContext } from 'src/auth/hooks';
import EmployeeDetails from './EmployeeDetails';
import EmpTableRow from './Tables/asset-table-row';
import EmpTableHeadCustom from './Tables/asset-table-head-custom';
//
// import UserTableRow from '../user-table-row';
// import UserTableToolbar from '../user-table-toolbar';
// import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Status', width: 180 },
  { id: 'company', label: 'Company', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Join Details', width: 100 },
  { id: 'empId', label: 'Emp Id', width: 100 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function EmployeesListView() {
  const table = useTable();

  const { user:user1 } = useAuthContext();


  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();
  const openDetails = useBoolean();


  const [tableData, setTableData] = useState(_userList);

  const [filters, setFilters] = useState(defaultFilters);
  const [empRawData, setEmpRawData] = useState([])
  const [empFilData, setEmpFilData] = useState([])
 
  useEffect(() => {
    getEmployeeList()
  }, [])
  
  const getEmployeeList = async () => {
  
    if (user1?.role=== "admin") {
      console.log('user1?.role', user1?.role=== "admin")
      const unsubscribe = getEmpByStatus(
        user1?.orgId,
        (querySnapshot: any) => {
          const usersListA = querySnapshot.docs.map((docSnapshot: { data: () => any; id: any }) => {
            const x = docSnapshot.data();
            x.id = docSnapshot.id;
            return x;
          });
          console.log('check it',usersListA )
          setEmpRawData(usersListA);
        },
        {
          status: [''],
        },
        (error:any) => setEmpRawData([])
      );
      
      return unsubscribe;
    }
    
  }
  useEffect(() => {
    if(filters.status === 'all'){
      setEmpFilData(empRawData)
    }else if(filters.status === 'active'){
      setEmpFilData(empRawData.filter((user: any) => user?.Status === 'assigned'))
    }else if(filters.status === 'un_allocated'){
      setEmpFilData(empRawData.filter((user: any) => user?.Status === 'unassigned'))
    }else if(filters.status === 'repair'){
      setEmpFilData(empRawData.filter((user: any) => user?.Status === 'repair'))
    }
  }, [filters, empRawData])
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const followers=_userFollowers

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Employees List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
            //   component={RouterLink}
            //   href={paths.dashboard.user.new}
            //   variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openDetails.onTrue}
            >
              Add Employee
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

<Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {empFilData?.map((follower:any) => (
          <FollowerItem
            key={follower.id}
            follower={follower} selected={undefined} onSelected={undefined}            // selected={followed.includes(follower.id)}
            // onSelected={() => handleClick(follower.id)}
          />
        ))}
      </Box>
        <Card sx={{mt: 3}}>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && _userList.length}
                    {tab.value === 'active' &&
                      _userList.filter((user) => user.status === 'active').length}

                    {tab.value === 'pending' &&
                      _userList.filter((user) => user.status === 'pending').length}
                    {tab.value === 'banned' &&
                      _userList.filter((user) => user.status === 'banned').length}
                    {tab.value === 'rejected' &&
                      _userList.filter((user) => user.status === 'rejected').length}
                  </Label>
                }
              />
            ))}
          </Tabs>
{/* 
          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_roles}
          /> */}

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <EmpTableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  { empFilData                    
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, i) => (
                      <EmpTableRow
                        key={i}
                        row={row}
                        selected={false}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
         <EmployeeDetails
        // task={task}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        // onUpdateTask={onUpdateTask}
        // onDeleteTask={onDeleteTask}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUserItem[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}


// ----------------------------------------------------------------------

type FollowerItemProps = {
  follower: any;
  selected: any;
  onSelected: any;
};

function FollowerItem({ follower, selected, onSelected }: FollowerItemProps) {
  const { name, country, avatarUrl, status } = follower;
const statusBool =  status === "Active"
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: (theme) => theme.spacing(3, 2, 3, 3),
      }}
    >
      <Avatar alt={follower?.first_name} src={avatarUrl} sx={{ width: 48, height: 48, mr: 2 }} />

      <ListItemText
        primary={`${follower?.first_name} ${follower?.lastname}`}
        secondary={
          <>
            {/* <Iconify icon="mingcute:location-fill" width={16} sx={{ flexShrink: 0, mr: 0.5 }} /> */}
            {follower?.designation} 
            {/* <Iconify icon="mingcute:location-fill" width={16} sx={{ flexShrink: 0, mr: 0.5 }} /> */}
            .{follower?.company} 
          </>
        }
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
        }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          display: 'flex',
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />

      <Button
        size="small"
        variant={statusBool ? 'text' : 'outlined'}
        color={statusBool ? 'success' : 'inherit'}
        startIcon={
          statusBool ? <Iconify width={18} icon="eva:checkmark-fill" sx={{ mr: -0.75 }} /> : null
        }
        onClick={onSelected}
        sx={{ flexShrink: 0, ml: 1.5 }}
      >
        {statusBool ? 'Active' : 'InActive'}
      </Button>
    </Card>
  );
}

