import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ErrorModal from '../../Components/Modal/Modal';

function AvailableDate() {
  const [availableDate, setAvailableDate] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [update, setUpdate] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [deleteAvailableDateId, setAvailableDateId] = useState();
  const [newAvailableDate, setNewAvailableDate] = useState({
    workDay: '',
    doctorId: '',
  });

  const [updateAvailableDate, setUpdateAvailableDate] = useState({
    workDay: '',
    doctorId: '',
  });

  const [error, setError] = useState(null);

  const handleErrorClose = () => {
    setError(null);
  };

  const handleError = err => {
    setError(err.response.data.message);
  };

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/available-dates')
      .then(res => setAvailableDate(res.data.content))
      .then(() => setUpdate(true));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/doctors')
      .then(res => setDoctor(res.data.content))
      .then(() => setUpdate(true))
      .catch(handleError);
  }, [update]);

  //POST
  const handleAddNewWorkdayBtn = () => {
    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + '/api/v1/available-dates',
        newAvailableDate
      )
      .then(() => {
        setUpdate(false);
        setNewAvailableDate({
          workDay: '',
          doctorId: '',
        });
      })
      .catch(handleError);
  };
  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewAvailableDate(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = e => {
    const { value } = e.target;
    setNewAvailableDate(prev => ({
      ...prev,
      doctorId: value,
    }));
    // console.log('Doktor Id:', value);
  };

  // Delete
  const handleDeleteWorkdayBtn = e => {
    setAvailableDateId(e.target.id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteWorkday = id => {
    axios
      .delete(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates/${id}`
      )
      .then(() => {
        setUpdate(false);
        handleDeleteClose();
      })
      .catch(handleError);
  };

  // Update
  const handleUpdateInputChange = e => {
    const { name, value } = e.target;
    setUpdateAvailableDate(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSelectChange = e => {
    const { value } = e.target;
    setUpdateAvailableDate(prev => ({
      ...prev,
      doctorId: value,
    }));
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleUpdateWorkdayBtn = e => {
    const index = e.target.id;
    setUpdateAvailableDate({
      ...availableDate[index],
    });
    setOpenUpdateDialog(true);
  };

  // const handleUpdateWorkdaySave = () => {
  //   axios
  //     .put(
  //       `${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates/${
  //         updateAvailableDate.id
  //       }`,
  //       {
  //         workDay: updateAvailableDate.workDay,
  //         doctorId: updateAvailableDate.doctorId,
  //       }
  //     )
  //     .then(() => {
  //       setUpdate(false);
  //       setOpenUpdateDialog(false);
  //     });
  // };

  return (
    <>
      <Box
        sx={{
          width: '80%',
          margin: 'auto',
          textAlign: 'center',
          mb: 2,
          mt: 3,
        }}
      >
        <Typography variant='h4' mt={7}>
          Add New AvailableDate
        </Typography>
      </Box>

      <Table
        sx={{
          width: '40%',
          margin: 'auto',
          mb: 5,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Work Day'
                name='workDay'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={newAvailableDate.workDay}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='doctor'>Doctor</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='doctor'
                  name='doctorId'
                  label='Doctor'
                  value={newAvailableDate.doctorId || ''}
                  onChange={handleSelectChange}
                >
                  {doctor.map(doc => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleAddNewWorkdayBtn}
              >
                Add Workday
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>

      <Box
        sx={{
          width: '80%',
          margin: 'auto',
          textAlign: 'center',
          mb: 2,
          mt: 3,
        }}
      >
        <Typography variant='h4'>AvailableDate Management</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: '80%', margin: 'auto', maxHeight: 500 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'orange' }}>
            <TableCell>AvailableDate</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Actions</TableCell>
          </TableHead>
          <TableBody>
            {availableDate?.map(ava => (
              <TableRow key={ava.id}>
                <TableCell>{ava.workDay}</TableCell>
                <TableCell>{ava.doctor.name}</TableCell>
                <TableCell>
                  <Button color='primary' onClick={handleUpdateWorkdayBtn}>
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteWorkdayBtn}
                    id={ava.id}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update WorkDay</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Update the information of the workday
          </DialogContentText>
          <TextField
            label='Work Day'
            name='workDay'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            value={updateAvailableDate.workDay}
            onChange={handleUpdateInputChange}
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel id='doctor'>Doctor</InputLabel>
            <Select
              sx={{ width: 150 }}
              labelId='doctor'
              name='doctorId'
              label='Doctor'
              value={updateAvailableDate.doctorId || ''}
              onChange={handleUpdateSelectChange}
            >
              {doctor.map(doc => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button color='primary'>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete WorkDay
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this workday?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteWorkday(deleteAvailableDateId)}
            color='error'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <ErrorModal
          open={Boolean(error)}
          message={error}
          onClose={handleErrorClose}
        />
      )}
    </>
  );
}

export default AvailableDate;
