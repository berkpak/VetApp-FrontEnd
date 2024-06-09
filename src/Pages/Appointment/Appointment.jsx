import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ErrorModal from '../../Components/Modal/Modal';

function Appointment() {
  const [appointment, setAppointment] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [animal, setAnimal] = useState([]);
  const [update, setUpdate] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: '',
    appointmentTime: '',
    doctorId: '',
    animalId: '',
  });
  const [updateAppointment, setUpdateAppointment] = useState({
    appointmentDate: '',
    appointmentTime: '',
    doctorId: '',
    animalId: '',
  });
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    doctorId: '',
  });
  const [filterAnimal, setFilterAnimal] = useState({
    startDate: '',
    endDate: '',
    animalId: '',
  });

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/appointments')
      .then(res => {
        setAppointment(res.data.content);
        setFilteredAppointments(res.data.content);
      });
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/animals')
      .then(res => setAnimal(res.data.content));
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/doctors')
      .then(res => setDoctor(res.data.content));
    setUpdate(false);
  }, [update]);

  //POST
  const handleAddNewAppointmentBtn = () => {
    const appointmentDateTime = `${newAppointment.appointmentDate}T${newAppointment.appointmentTime}`;
    const appointmentData = {
      appointmentDate: appointmentDateTime,
      doctor: {
        id: newAppointment.doctorId,
      },
      animal: {
        id: newAppointment.animalId,
      },
    };

    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + '/api/v1/appointments',
        appointmentData
      )
      .then(() => {
        setUpdate(true);
        setNewAppointment({
          appointmentDate: '',
          appointmentTime: '',
          doctorId: '',
          animalId: '',
        });
      })
      .catch(handleError);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = e => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // DELETE
  const handleDeleteAppointmentBtn = e => {
    setDeleteAppointmentId(e.target.id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteAppointment = id => {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${id}`)
      .then(() => {
        setUpdate(prev => !prev);
        handleDeleteClose();
      })
      .catch(handleError);
  };

  // UPDATE
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleUpdateAppointmentBtn = id => {
    const selectedAppointment = appointment.find(appo => appo.id === id);
    const [date, time] = selectedAppointment.appointmentDate.split('T');
    setUpdateAppointment({
      id: selectedAppointment.id,
      appointmentDate: date,
      appointmentTime: time,
      doctorId: selectedAppointment.doctor.id,
      animalId: selectedAppointment.animal.id,
    });
    setOpenUpdateDialog(true);
  };

  const handleUpdateInputChange = e => {
    const { name, value } = e.target;
    setUpdateAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSelectChange = e => {
    const { name, value } = e.target;
    setUpdateAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAppointmentSave = () => {
    const appointmentDateTime = `${updateAppointment.appointmentDate}T${updateAppointment.appointmentTime}`;
    const updatedData = {
      appointmentDate: appointmentDateTime,
      doctor: {
        id: updateAppointment.doctorId,
      },
      animal: {
        id: updateAppointment.animalId,
      },
    };

    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${
          updateAppointment.id
        }`,
        updatedData
      )
      .then(() => {
        setUpdate(true);
        setOpenUpdateDialog(false);
      })
      .catch(handleError);
  };

  // FILTER
  const handleFilterInputChange = e => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterAnimalInputChange = e => {
    const { name, value } = e.target;
    setFilterAnimal(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterDoctorRange = () => {
    const { startDate, endDate, doctorId } = filter;
    axios
      .get(
        `${
          import.meta.env.VITE_APP_BASEURL
        }/api/v1/appointments/searchByDoctorAndDateRange?startDate=${startDate}&endDate=${endDate}&doctorId=${doctorId}`
      )
      .then(res => {
        const appointmentsInRange = res.data.content;
        // Seçilen doktorun randevuları içinde filtreleme aralığındaki randevuları kontrol et
        const doctorAppointmentsInRange = appointmentsInRange.filter(
          appo => appo.doctor.id === doctorId
        );
        // Seçilen doktorun o tarih aralığında randevusu varsa filtreleme işlemini gerçekleştir
        setFilteredAppointments(doctorAppointmentsInRange);
      })
      .catch(handleError);
  };

  const handleClear = () => {
    setFilteredAppointments(appointment);
    setFilterAnimal({ startDate: '', endDate: '', animalId: '' });
  };

  const handleDoctorClear = () => {
    setFilteredAppointments(appointment);
    setFilter({ startDate: '', endDate: '', doctorId: '' });
  };

  const handleFilterAnimalRange = () => {
    const { startDate, endDate, animalId } = filterAnimal;
    axios
      .get(
        `${
          import.meta.env.VITE_APP_BASEURL
        }/api/v1/appointments/searchByAnimalAndDateRange?startDate=${startDate}&endDate=${endDate}&animalId=${animalId}`
      )
      .then(res => {
        const appointmentsInRange = res.data.content;
        const animalAppointmentsInRange = appointmentsInRange.filter(
          appo => appo.animal.id === animalId
        );
        setFilteredAppointments(animalAppointmentsInRange);
      })
      .catch(handleError);
  };

  //Error Modal
  const [error, setError] = useState(null);

  const handleErrorClose = () => {
    setError(null);
  };

  const handleError = err => {
    setError(err.response.data.message);
  };

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
        <Typography variant='h4'>Add New Appointment</Typography>
      </Box>
      <Table sx={{ width: '80%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Appointment Date'
                name='appointmentDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={newAppointment.appointmentDate}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Appointment Time'
                name='appointmentTime'
                type='time'
                InputLabelProps={{
                  shrink: true,
                }}
                value={newAppointment.appointmentTime}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='animal'>Animal</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='animal'
                  name='animalId'
                  label='Animal'
                  value={newAppointment.animalId}
                  onChange={handleSelectChange}
                >
                  {animal.map(anml => (
                    <MenuItem key={anml.id} value={anml.id}>
                      {anml.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='doctor'>Doctor</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='doctor'
                  name='doctorId'
                  label='Doctor'
                  value={newAppointment.doctorId}
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
                onClick={handleAddNewAppointmentBtn}
              >
                Add Appointment
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
        <Typography variant='h4'>Filter Doctor Appointments</Typography>
      </Box>
      <Table sx={{ width: '80%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Start Date'
                name='startDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={filter.startDate}
                onChange={handleFilterInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='End Date'
                name='endDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={filter.endDate}
                onChange={handleFilterInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='filter-doctor'>Doctor</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='filter-doctor'
                  name='doctorId'
                  label='Doctor'
                  value={filter.doctorId}
                  onChange={handleFilterInputChange}
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
                onClick={handleFilterDoctorRange}
              >
                Search
              </Button>
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleDoctorClear}
              >
                Clear
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
        <Typography variant='h4'>Filter Animal Appointments</Typography>
      </Box>
      <Table sx={{ width: '80%', margin: 'auto', mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Start Date'
                name='startDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={filterAnimal.startDate}
                onChange={handleFilterAnimalInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='End Date'
                name='endDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={filterAnimal.endDate}
                onChange={handleFilterAnimalInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='filter-animal'>Animal</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='filter-animal'
                  name='animalId'
                  label='Animal'
                  value={filterAnimal.animalId}
                  onChange={handleFilterAnimalInputChange}
                >
                  {animal.map(anml => (
                    <MenuItem key={anml.id} value={anml.id}>
                      {anml.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleFilterAnimalRange}
              >
                Search
              </Button>
            </TableCell>
            <TableCell>
              <Button variant='contained' color='inherit' onClick={handleClear}>
                Clear
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
        <Typography variant='h4'>Appointments</Typography>
      </Box>
      <TableContainer sx={{ width: '70%', margin: 'auto', maxHeight: 600 }}>
        <Table>
          <TableHead sx={{ position: 'sticky', backgroundColor: 'orange' }}>
            <TableRow>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Animal</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAppointments?.map(appo => (
              <TableRow key={appo.id}>
                <TableCell>{appo.appointmentDate}</TableCell>
                <TableCell>{appo.animal.name}</TableCell>
                <TableCell>{appo.doctor.name}</TableCell>
                <TableCell>
                  <Button
                    color='primary'
                    onClick={() => handleUpdateAppointmentBtn(appo.id)}
                  >
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteAppointmentBtn}
                    id={appo.id}
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
        <DialogTitle>Update Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the information of the appointment
          </DialogContentText>
          <TextField
            label='Appointment Date'
            name='appointmentDate'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            value={updateAppointment.appointmentDate}
            onChange={handleUpdateInputChange}
            fullWidth
            margin='dense'
          />
          <TextField
            label='Appointment Time'
            name='appointmentTime'
            type='time'
            InputLabelProps={{
              shrink: true,
            }}
            value={updateAppointment.appointmentTime}
            onChange={handleUpdateInputChange}
            fullWidth
            margin='dense'
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel id='animal'>Animal</InputLabel>
            <Select
              labelId='animal'
              name='animalId'
              label='Animal'
              value={updateAppointment.animalId}
              onChange={handleUpdateSelectChange}
            >
              {animal.map(anml => (
                <MenuItem key={anml.id} value={anml.id}>
                  {anml.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <InputLabel id='doctor'>Doctor</InputLabel>
            <Select
              labelId='doctor'
              name='doctorId'
              label='Doctor'
              value={updateAppointment.doctorId}
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
          <Button onClick={handleUpdateAppointmentSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete Appointment
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this Appointment?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteAppointment(deleteAppointmentId)}
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

export default Appointment;
