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
  InputLabel,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ErrorModal from '../../Components/Modal/Modal';

function Vaccine() {
  const [vaccine, setVaccine] = useState([]);
  const [animal, setAnimal] = useState([]);
  const [update, setUpdate] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteVaccineId, setDeleteVaccineId] = useState();
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animalWithoutCustomer: { id: '' },
  });

  const [updateVaccine, setUpdateVaccine] = useState({
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animalWithoutCustomer: { id: '' },
  });

  const [filter, setFilter] = useState({ animalId: '' });
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: '',
  });

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/vaccinations')
      .then(res => {
        setVaccine(res.data.content);
        setFilteredVaccines(res.data.content);
      })
      .then(() => setUpdate(false));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/animals')
      .then(res => setAnimal(res.data.content))
      .then(() => setUpdate(false))
      .catch(handleError);
  }, [update]);

  //POST

  const handleAddNewVaccineBtn = () => {
    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + '/api/v1/vaccinations',
        newVaccine
      )
      .then(() => {
        setUpdate(prev => !prev);
        setNewVaccine({
          name: '',
          code: '',
          protectionStartDate: '',
          protectionFinishDate: '',
          animalWithoutCustomer: { id: '' },
        });
      })
      .catch(handleError);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewVaccine(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = e => {
    const { value } = e.target;
    setNewVaccine(prev => ({
      ...prev,
      animalWithoutCustomer: { id: value },
    }));
  };

  //UPDATE

  const handleUpdateVaccineBtn = id => {
    const selectedVaccine = vaccine.find(vac => vac.id === id);
    setUpdateVaccine({
      ...selectedVaccine,
      animalWithoutCustomer: {
        id: selectedVaccine.animalWithoutCustomer?.id || '',
      },
    });
    setOpenUpdateDialog(true);
  };

  const handleUpdateVaccineSelectChange = e => {
    const { value } = e.target;
    setUpdateVaccine(prev => ({
      ...prev,
      animalWithoutCustomer: { id: value },
    }));
  };

  const handleUpdateVaccineInputChange = e => {
    const { name, value } = e.target;
    setUpdateVaccine(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateVaccine = () => {
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${
          updateVaccine.id
        }`,
        updateVaccine
      )
      .then(() => {
        setUpdate(prev => !prev);
        handleUpdateClose();
      });
  };

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false);
  };

  //DELETE

  const handleDeleteVaccineBtn = e => {
    setDeleteVaccineId(e.target.id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteVaccine = id => {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${id}`)
      .then(() => {
        setUpdate(prev => !prev);
        handleDeleteClose();
      })
      .catch(handleError);
  };

  //FILTER

  const handleFilterSelectChange = e => {
    const { value } = e.target;
    setFilter({ animalId: value });
  };

  const handleFilterAnimal = () => {
    const { animalId } = filter;
    if (!animalId) {
      setFilteredVaccines(vaccine);
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_APP_BASEURL
          }/api/v1/vaccinations/searchByAnimal?id=${animalId}`
        )
        .then(res => setFilteredVaccines(res.data.content))
        .catch(handleError);
    }
  };

  const handleClear = () => {
    setFilteredVaccines(vaccine);
    setFilterDate({ startDate: '', endDate: '' });
    setFilter({ animalId: '' });
  };

  const handleFilterInputChange = e => {
    const { name, value } = e.target;
    setFilterDate(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterDate = () => {
    const { startDate, endDate } = filterDate;

    if (startDate && endDate) {
      axios
        .get(
          `${
            import.meta.env.VITE_APP_BASEURL
          }/api/v1/vaccinations/searchByVaccinationRange?startDate=${startDate}&endDate=${endDate}`
        )
        .then(res => setFilteredVaccines(res.data.content))
        .catch(handleError);
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
        <Typography variant='h4'>Add Vaccine</Typography>
      </Box>

      <Table sx={{ width: '80%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Name'
                name='name'
                value={newVaccine.name}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Code'
                name='code'
                value={newVaccine.code}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Protection Start Date'
                name='protectionStartDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={newVaccine.protectionStartDate}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Protection Finish Date'
                name='protectionFinishDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={newVaccine.protectionFinishDate}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='animal'>Animal</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='animal'
                  name='animal'
                  label='Animal'
                  value={newVaccine.animalWithoutCustomer.id}
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
              <Button
                variant='contained'
                color='inherit'
                onClick={handleAddNewVaccineBtn}
              >
                Add Vaccine
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>

      {/* FILTER */}
      <Box
        sx={{
          width: '80%',
          margin: 'auto',
          textAlign: 'center',
          mb: 2,
          mt: 3,
        }}
      >
        <Typography variant='h4'>Filter Vaccines</Typography>
      </Box>

      <Table sx={{ width: '80%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormControl>
                <InputLabel id='filter-animal'>Animal</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='filter-animal'
                  name='animalId'
                  label='Animal'
                  value={filter.animalId}
                  onChange={handleFilterSelectChange}
                >
                  <MenuItem value=''>Select Animal</MenuItem>
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
                onClick={handleFilterAnimal}
              >
                Search
              </Button>
            </TableCell>
            <TableCell>
              <TextField
                label='Start Date'
                name='startDate'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                value={filterDate.startDate}
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
                value={filterDate.endDate}
                onChange={handleFilterInputChange}
              />
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleFilterDate}
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

      {/* MANAGEMENT */}

      <Box
        sx={{
          width: '80%',
          margin: 'auto',
          textAlign: 'center',
          mb: 2,
          mt: 3,
        }}
      >
        <Typography variant='h4'>Vaccine Management</Typography>
      </Box>

      <TableContainer sx={{ width: '80%', margin: 'auto', maxHeight: 600 }}>
        <Table>
          <TableHead sx={{ position: 'sticky', backgroundColor: 'orange' }}>
            <TableRow>
              <TableCell>Vaccine Name</TableCell>
              <TableCell>Vaccine Code</TableCell>
              <TableCell>Protection Start Date</TableCell>
              <TableCell>Protection Finish Date</TableCell>
              <TableCell>Animal Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredVaccines?.map(vac => (
              <TableRow key={vac.id}>
                <TableCell>{vac.name}</TableCell>
                <TableCell>{vac.code}</TableCell>
                <TableCell>{vac.protectionStartDate}</TableCell>
                <TableCell>{vac.protectionFinishDate}</TableCell>
                <TableCell>{vac.animal.name}</TableCell>
                <TableCell>
                  <Button
                    color='primary'
                    onClick={() => handleUpdateVaccineBtn(vac.id)}
                  >
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteVaccineBtn}
                    id={vac.id}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdateDialog} onClose={handleUpdateClose}>
        <DialogTitle>Update Vaccine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the information of the vaccine
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Name'
            name='name'
            value={updateVaccine.name}
            onChange={handleUpdateVaccineInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Code'
            name='code'
            value={updateVaccine.code}
            onChange={handleUpdateVaccineInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Protection Start Date'
            name='protectionStartDate'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            value={updateVaccine.protectionStartDate}
            onChange={handleUpdateVaccineInputChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Protection Finish Date'
            name='protectionFinishDate'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            value={updateVaccine.protectionFinishDate}
            onChange={handleUpdateVaccineInputChange}
            fullWidth
          />
          <FormControl>
            <InputLabel id='animal'>Animal</InputLabel>
            <Select
              margin='dense'
              sx={{ width: 150 }}
              labelId='animal'
              name='animal'
              label='Animal'
              value={updateVaccine.animalWithoutCustomer.id}
              onChange={handleUpdateVaccineSelectChange}
              fullWidth
            >
              {animal.map(anml => (
                <MenuItem key={anml.id} value={anml.id}>
                  {anml.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleUpdateVaccine} color='primary'>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete Vaccine
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this vaccine?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteVaccine(deleteVaccineId)}
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

export default Vaccine;
