import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

import ErrorModal from '../../Components/Modal/Modal';

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState();
  const [filter, setFilter] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  const [updateCustomer, setUpdateCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/customers')
      .then(res => setCustomer(res.data.content))
      .then(() => setUpdate(true))
      .catch(handleError);
  }, [update]);

  //POST
  const handleAddNewCustomer = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + '/api/v1/customers', newCustomer)
      .then(() => {
        setUpdate(false);
        setNewCustomer({
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

  const handleNewCustomerInputChange = e => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  //DELETE
  const handleDeleteCustomer = id => {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/customers/${id}`)
      .then(() => {
        setUpdate(false);
        handleDeleteClose();
      })
      .catch(handleError);
  };

  const handleDeleteCustomerBtn = e => {
    const id = e.target.id;
    setDeleteCustomerId(id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  //UPDATE
  const handleUpdateCustomer = () => {
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/customers/${
          updateCustomer.id
        }`,
        updateCustomer
      )
      .then(() => {
        setUpdate(prev => !prev);
        handleClose();
      })
      .catch(handleError);
  };

  const handleUpdateCustomerInputChange = e => {
    const { name, value } = e.target;
    setUpdateCustomer(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCustomerBtn = e => {
    const index = e.target.id;
    setUpdateCustomer({ ...customer[index] });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //FILTER NAME
  const handleFilterChange = e => {
    setFilter(e.target.value);
    axios
      .get(
        `${
          import.meta.env.VITE_APP_BASEURL
        }/api/v1/customers/searchByName?name=${e.target.value}`
      )
      .then(res => setCustomer(res.data.content))
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
        <Typography variant='h4'>Add New Customer</Typography>
      </Box>
      <Table sx={{ width: '80%', margin: 'auto', mb: 5 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Name'
                name='name'
                value={newCustomer.name}
                onChange={handleNewCustomerInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Phone'
                name='phone'
                value={newCustomer.phone}
                onChange={handleNewCustomerInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Email'
                name='email'
                value={newCustomer.email}
                onChange={handleNewCustomerInputChange}
              />
            </TableCell>
            <TableCell>
              {' '}
              <TextField
                label='Address'
                name='address'
                value={newCustomer.address}
                onChange={handleNewCustomerInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='City'
                name='city'
                value={newCustomer.city}
                onChange={handleNewCustomerInputChange}
              />
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleAddNewCustomer}
              >
                Add Customer
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
        <Typography variant='h4'>Customer Management</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: '80%', margin: 'auto', maxHeight: 500 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'orange' }}>
                Customer Name
              </TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>
                Customer Phone
              </TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>
                Customer Mail
              </TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>
                Customer Address
              </TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>
                Customer City
              </TableCell>
              <TableCell sx={{ backgroundColor: 'orange' }}>
                <TextField
                  label='Filter by Name'
                  variant='outlined'
                  value={filter}
                  onChange={handleFilterChange}
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customer.map((cus, index) => (
              <TableRow key={cus.id}>
                <TableCell>{cus.name}</TableCell>
                <TableCell>{cus.phone}</TableCell>
                <TableCell>{cus.email}</TableCell>
                <TableCell>{cus.address}</TableCell>
                <TableCell>{cus.city}</TableCell>
                <TableCell>
                  <Button
                    color='primary'
                    onClick={handleUpdateCustomerBtn}
                    id={index}
                  >
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteCustomerBtn}
                    id={cus.id}
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
        <DialogTitle>Update Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the information of the customer
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Name'
            name='name'
            value={updateCustomer.name}
            onChange={handleUpdateCustomerInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Phone'
            name='phone'
            value={updateCustomer.phone}
            onChange={handleUpdateCustomerInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Email'
            name='email'
            value={updateCustomer.email}
            onChange={handleUpdateCustomerInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Address'
            name='address'
            value={updateCustomer.address}
            onChange={handleUpdateCustomerInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='City'
            name='city'
            value={updateCustomer.city}
            onChange={handleUpdateCustomerInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleUpdateCustomer} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete Customer
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this customer?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteCustomer(deleteCustomerId)}
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

export default Customer;
