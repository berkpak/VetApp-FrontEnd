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
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import ErrorModal from '../../Components/Modal/Modal';

function Animal() {
  const [animal, setAnimal] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [update, setUpdate] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteAnimalId, setDeleteAnimalId] = useState();
  const [filter, setFilter] = useState();
  const [filterCustomer, setFilterCustomer] = useState();
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    colour: '',
    customer: { id: '' },
  });

  const [updateAnimal, setUpdateAnimal] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    colour: '',
    customer: { id: '' },
  });

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/animals')
      .then(res => setAnimal(res.data.content))
      .then(() => setUpdate(false));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/customers')
      .then(res => setCustomer(res.data.content))
      .then(() => setUpdate(false));
  }, [update]);

  const handleAddNewAnimal = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + '/api/v1/animals', newAnimal)
      .then(() => {
        setUpdate(prev => !prev);
        setNewAnimal({
          name: '',
          species: '',
          breed: '',
          gender: '',
          dateOfBirth: '',
          colour: '',
          customer: { id: '' },
        });
      })
      .catch(handleError);
  };
  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewAnimal(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = e => {
    const { value } = e.target;
    setNewAnimal(prev => ({
      ...prev,
      customer: { id: value },
    }));
  };

  //UPDATE

  const handleUpdateAnimalBtn = id => {
    const selectedAnimal = animal.find(anml => anml.id === id);
    setUpdateAnimal({
      ...selectedAnimal,
      customer: { id: selectedAnimal.customer.id },
    });
    setOpenUpdateDialog(true);
  };

  const handleUpdateAnimalInputChange = e => {
    const { name, value } = e.target;
    setUpdateAnimal(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAnimalSelectChange = e => {
    const { value } = e.target;
    setUpdateAnimal(prev => ({
      ...prev,
      customer: { id: value },
    }));
  };

  const handleUpdateAnimalSave = () => {
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/${updateAnimal.id}`,
        updateAnimal
      )
      .then(() => {
        setUpdate(prev => !prev);
        setOpenUpdateDialog(false);
      })
      .catch(handleError);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  //DELETE

  const handleDeleteAnimalBtn = e => {
    setDeleteAnimalId(e.target.id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteAnimal = id => {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/${id}`)
      .then(() => {
        setUpdate(prev => !prev);
        handleDeleteClose();
      })
      .catch(handleError);
  };

  //Filter

  const handleFilterByName = e => {
    setFilter(e.target.value);
    axios
      .get(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/searchByName?name=${
          e.target.value
        }`
      )
      .then(res => setAnimal(res.data.content))
      .catch(handleError);
  };

  const handleFilterByCustomer = e => {
    setFilterCustomer(e.target.value);
    if (e.target.value === '') {
      axios
        .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/animals')
        .then(res => setAnimal(res.data.content))
        .catch(err => console.error(err));
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_APP_BASEURL
          }/api/v1/animals/searchByCustomer?customerName=${e.target.value}`
        )
        .then(res => setAnimal(res.data.content))
        .catch(err => console.error(err));
    }
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
        <Typography variant='h4'>Add New Animal</Typography>
      </Box>

      <Table sx={{ width: '90%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Name'
                name='name'
                value={newAnimal.name}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Species'
                name='species'
                value={newAnimal.species}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Breed'
                name='breed'
                value={newAnimal.breed}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Gender'
                name='gender'
                value={newAnimal.gender}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Birth Date'
                name='dateOfBirth'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={newAnimal.dateOfBirth}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Color'
                name='colour'
                value={newAnimal.colour}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='customer'>Customer</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='customer'
                  name='customer'
                  label='Customer'
                  value={newAnimal.customer.id}
                  onChange={handleSelectChange}
                >
                  {customer.map(cus => (
                    <MenuItem key={cus.id} value={cus.id}>
                      {cus.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleAddNewAnimal}
              >
                Add Animal
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>

      {/* Animal Management */}
      <Box
        sx={{
          width: '80%',
          margin: 'auto',
          textAlign: 'center',
          mb: 2,
          mt: 3,
        }}
      >
        <Typography variant='h4'>Animal Management</Typography>
      </Box>

      <TableContainer sx={{ width: '80%', margin: 'auto', maxHeight: 600 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'orange' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>
                <TextField
                  label='Filter by Name'
                  variant='outlined'
                  value={filter}
                  onChange={handleFilterByName}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  label='Filter by Customer'
                  variant='outlined'
                  value={filterCustomer}
                  onChange={handleFilterByCustomer}
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {animal?.map(anml => (
              <TableRow key={anml.id}>
                <TableCell>{anml.name}</TableCell>
                <TableCell>{anml.species}</TableCell>
                <TableCell>{anml.breed}</TableCell>
                <TableCell>{anml.gender}</TableCell>
                <TableCell>{anml.dateOfBirth}</TableCell>
                <TableCell>{anml.colour}</TableCell>
                <TableCell>{anml.customer.name}</TableCell>
                <TableCell>
                  <Button
                    color='primary'
                    onClick={() => handleUpdateAnimalBtn(anml.id)}
                  >
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteAnimalBtn}
                    id={anml.id}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Animal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the information of the animal
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Name'
            name='name'
            value={updateAnimal.name}
            onChange={handleUpdateAnimalInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Species'
            name='species'
            value={updateAnimal.species}
            onChange={handleUpdateAnimalInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Breed'
            name='breed'
            value={updateAnimal.breed}
            onChange={handleUpdateAnimalInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Gender'
            name='gender'
            value={updateAnimal.gender}
            onChange={handleUpdateAnimalInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Date of Birth'
            name='dateOfBirth'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            value={updateAnimal.dateOfBirth}
            onChange={handleUpdateAnimalInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Color'
            name='colour'
            value={updateAnimal.colour}
            onChange={handleUpdateAnimalInputChange}
            fullWidth
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel id='customer-update'>Customer</InputLabel>
            <Select
              labelId='customer-update'
              name='customer'
              value={updateAnimal.customer.id}
              onChange={handleUpdateAnimalSelectChange}
            >
              {customer.map(cus => (
                <MenuItem key={cus.id} value={cus.id}>
                  {cus.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateAnimalSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete Animal
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this Animal?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteAnimal(deleteAnimalId)}
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

export default Animal;
