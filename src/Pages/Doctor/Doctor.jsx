import { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
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
  Typography,
  Box,
} from '@mui/material';
import ErrorModal from '../../Components/Modal/Modal';

function Doctor() {
  const [doctor, setDoctor] = useState([]);
  const [update, setUpdate] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState();
  const [open, setOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  const [updateDoctor, setUpdateDoctor] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/doctors')
      .then(res => setDoctor(res.data.content))
      .then(() => setUpdate(true))
      .catch(handleError);
  }, [update]);

  //POST
  const handleAddNewDoctor = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + '/api/v1/doctors', newDoctor)
      .then(() => {
        setUpdate(prev => !prev);
        setNewDoctor({
          id: '',
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        });
      })
      .catch(handleError);
  };

  const handleNewDoctorInputChange = e => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  //UPDATE
  const handleUpdateDoctor = () => {
    const { id } = updateDoctor;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors/${id}`,
        updateDoctor
      )
      .then(() => {
        setUpdate(prev => !prev);
        handleClose();
      })
      .catch(handleError);
  };

  const handleUpdateDoctorInputChange = e => {
    const { name, value } = e.target;
    setUpdateDoctor(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateDoctorBtn = e => {
    const index = e.target.id;
    setUpdateDoctor({ ...doctor[index] });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //DELETE
  const handleDeleteDoctorBtn = e => {
    setDeleteDoctorId(e.target.id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteDoctor = id => {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors/${id}`)
      .then(() => {
        setUpdate(prev => !prev);
        handleDeleteClose();
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
        <Typography variant='h4'>Add New Doctor</Typography>
      </Box>

      {/* Add new doctor */}
      <Table sx={{ width: '80%', margin: 'auto', mb: 5 }}>
        <TableHead>
          <TableCell>
            <TextField
              label='Name'
              name='name'
              value={newDoctor.name}
              onChange={handleNewDoctorInputChange}
            />
          </TableCell>
          <TableCell>
            <TextField
              label='Phone'
              name='phone'
              value={newDoctor.phone}
              onChange={handleNewDoctorInputChange}
            />
          </TableCell>
          <TableCell>
            <TextField
              label='Email'
              name='email'
              value={newDoctor.email}
              onChange={handleNewDoctorInputChange}
            />
          </TableCell>
          <TableCell>
            <TextField
              label='Address'
              name='address'
              value={newDoctor.address}
              onChange={handleNewDoctorInputChange}
            />
          </TableCell>
          <TableCell>
            <TextField
              label='City'
              name='city'
              value={newDoctor.city}
              onChange={handleNewDoctorInputChange}
            />
          </TableCell>
          <TableCell>
            <Button
              variant='contained'
              color='inherit'
              onClick={handleAddNewDoctor}
            >
              Add Doctor
            </Button>
          </TableCell>
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
        <Typography variant='h4'>Doctor Management</Typography>
      </Box>

      <TableContainer
        sx={{
          width: '80%',
          margin: 'auto',
          maxHeight: 500,
        }}
      >
        <Table stickyHeader>
          <TableHead
            sx={{
              top: 0,
              zIndex: 1300,
            }}
          >
            <TableRow>
              <TableCell sx={{ backgroundColor: 'orange' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>Phone</TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}> Mail</TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>Addres</TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>City</TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctor?.map((doc, index) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.phone}</TableCell>
                <TableCell>{doc.email}</TableCell>
                <TableCell>{doc.address}</TableCell>
                <TableCell>{doc.city}</TableCell>
                <TableCell>
                  <Button
                    color='primary'
                    onClick={handleUpdateDoctorBtn}
                    id={index}
                  >
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteDoctorBtn}
                    id={doc.id}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Doctor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the information of the doctor.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Name'
            name='name'
            value={updateDoctor.name}
            onChange={handleUpdateDoctorInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Phone'
            name='phone'
            value={updateDoctor.phone}
            onChange={handleUpdateDoctorInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Email'
            name='email'
            value={updateDoctor.email}
            onChange={handleUpdateDoctorInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Address'
            name='address'
            value={updateDoctor.address}
            onChange={handleUpdateDoctorInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='City'
            name='city'
            value={updateDoctor.city}
            onChange={handleUpdateDoctorInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleUpdateDoctor} color='primary'>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete Doctor
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this Doctor?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteDoctor(deleteDoctorId)}
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
      <Outlet />
    </>
  );
}

export default Doctor;
