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

function Report() {
  const [report, setReport] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [update, setUpdate] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState();

  const [newReport, setNewReport] = useState({
    title: '',
    diagnosis: '',
    price: '',
    appointmentId: '',
  });

  const [updateReport, setUpdateReport] = useState({
    title: '',
    diagnosis: '',
    price: '',
    appointmentId: '',
  });

  //GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/reports')
      .then(res => setReport(res.data.content))
      .then(() => setUpdate(true));

    axios
      .get(import.meta.env.VITE_APP_BASEURL + '/api/v1/appointments')
      .then(res => setAppointment(res.data.content))
      .then(() => setUpdate(true))
      .catch(handleError);
  }, [update]);

  //POST
  const handleAddNewReportBtn = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + '/api/v1/reports', newReport)
      .then(() => {
        setUpdate(false);
        setNewReport({
          title: '',
          diagnosis: '',
          price: '',
          appointmentId: '',
        });
      })
      .catch(handleError);
  };

  const handleNewReportInputChange = e => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = e => {
    const { value } = e.target;
    setNewReport(prev => ({
      ...prev,
      appointmentId: value,
    }));
  };

  //UPDATE

  const handleUpdateReportBtn = id => {
    const selectedReport = report.find(rep => rep.id === id);
    setUpdateReport({
      ...selectedReport,
      appointmentId: selectedReport.appointment.id,
    });
    setOpenUpdateDialog(true);
  };

  const handleUpdateReportInputChange = e => {
    const { name, value } = e.target;
    setUpdateReport(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateReportSave = () => {
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${updateReport.id}`,
        updateReport
      )
      .then(() => {
        setUpdate(false);
        setOpenUpdateDialog(false);
      })
      .catch(handleError);
  };

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false);
  };

  //DELETE

  const handleDeleteReportBtn = e => {
    setDeleteReportId(e.target.id);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDeleteReport = id => {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${id}`)
      .then(() => {
        setUpdate(false);
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
        <Typography variant='h4'>Add New Report</Typography>
      </Box>

      <Table sx={{ width: '80%', margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                label='Title'
                name='title'
                value={newReport.title}
                onChange={handleNewReportInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Diagnosis'
                name='diagnosis'
                value={newReport.diagnosis}
                onChange={handleNewReportInputChange}
              />
            </TableCell>
            <TableCell>
              <TextField
                label='Price'
                name='price'
                value={newReport.price}
                onChange={handleNewReportInputChange}
              />
            </TableCell>
            <TableCell>
              <FormControl>
                <InputLabel id='appointment'>Appointment</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  labelId='appointment'
                  name='appointmentId'
                  label='Appointment'
                  value={newReport.appointmentId || ''}
                  onChange={handleSelectChange}
                >
                  {appointment.map(appo => (
                    <MenuItem key={appo.id} value={appo.id}>
                      {appo.appointmentDate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button
                variant='contained'
                color='inherit'
                onClick={handleAddNewReportBtn}
              >
                Add Report
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
        <Typography variant='h4'>Report Management</Typography>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ width: '80%', margin: 'auto', maxHeight: 500 }}
      >
        <Table>
          <TableHead sx={{ position: 'sticky', backgroundColor: 'orange' }}>
            <TableRow>
              <TableCell>Report Title</TableCell>
              <TableCell>Report Diagnosis</TableCell>
              <TableCell>Report Price</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.map(rep => (
              <TableRow key={rep.id}>
                <TableCell>{rep.title}</TableCell>
                <TableCell>{rep.diagnosis}</TableCell>
                <TableCell>{rep.price}</TableCell>
                <TableCell>{rep.appointment.date}</TableCell>

                <TableCell>
                  <Button
                    color='primary'
                    onClick={() => handleUpdateReportBtn(rep.id)}
                  >
                    Update
                  </Button>
                  <Button
                    color='error'
                    onClick={handleDeleteReportBtn}
                    id={rep.id}
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
        <DialogTitle>Update Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the information of the report
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Title'
            name='title'
            value={updateReport.title}
            onChange={handleUpdateReportInputChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            label='Diagnosis'
            name='diagnosis'
            value={updateReport.diagnosis}
            onChange={handleUpdateReportInputChange}
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            label='Price'
            name='price'
            value={updateReport.price}
            onChange={handleUpdateReportInputChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id='update-appointment'>Appointment</InputLabel>
            <Select
              labelId='update-appointment'
              name='appointmentId'
              value={updateReport.appointmentId}
              onChange={handleUpdateReportInputChange}
            >
              {appointment.map(appo => (
                <MenuItem key={appo.id} value={appo.id}>
                  {appo.appointmentDate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleUpdateReportSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ textAlign: 'center', color: 'red' }}>
          Delete Report
        </DialogTitle>
        <DialogContentText sx={{ p: 5 }}>
          Are you sure you want to delete this report?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteReport(deleteReportId)}
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

export default Report;
