import { useState, useCallback } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
// types
import { IKanbanTask } from 'src/types/kanban';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomDateRangePicker, { useDateRangePicker } from 'src/components/custom-date-range-picker';
import { UserCreateView } from 'src/sections/user/view';
import EmployeeNewEditForm from './AddEmployeeForm';


// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

type Props = {
//   task: IKanbanTask;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  //
};

export default function EmployeeDetails({
//   task,
  openDetails,
  onCloseDetails,
  //

}: Props) {


  return (
    <Drawer
    open={openDetails}
    onClose={onCloseDetails}
    anchor="right"
    slotProps={{
      backdrop: { invisible: true },
    }}
    PaperProps={{
      sx: {
        width: {
          xs: 1,
          sm: 780,
        },
      },
    }}
  >
<span> <EmployeeNewEditForm /></span>
</Drawer>
  );
}
