import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import './EditTaskModal.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Radio, TextField, AppBar, Typography, Backdrop} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

function EditTaskModal(props) {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [deadline, setDeadline] = useState(new Date(props.task.deadline));
  const [priority, setPriority] = useState(props.task.priority);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [deadlineError, setDeadlineError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);
  const [blurred, setBlurred] = useState(false);


  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDeadlineChange = (date) => {
    setDeadline(date);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };


  const handleClose = () => {
    // Close the modal
    props.onClose();
  };

  const handleEdit = () => {
    // Handle form submission
    const updatedTask = {
      ...props.task,
      title,
      description,
      deadline,
      priority
    };

    setTitleError(false);

    if(title === '') {
        setTitleError(true);
    }

    if(description === '') {
        setDescriptionError(true);
    }

    if(deadline === '') {
        setDeadlineError(true);
    }

    if(priority != 'Low' || priority != 'Medium' || priority != 'High') {
        setPriorityError(true);
    }

    if (!title || !description || !deadline || !priority) {
        toast.error('Please fill in all fields');
         return;
     }
     else {
        toast.success('Task edited successfully');
     }

    props.onAdd(updatedTask);
    handleClose();
  };

  const enableBlur = () => {
    setBlurred(true);
  };

  const disableBlur = () => {
    setBlurred(false);
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <AppBar position="static" className='edit-appbar'>
        <Typography variant="h5" component="div" sx={{ textAlign: "center", height:"20px", marginBottom: "35px", marginTop: "20px" }}>
            Edit Task
        </Typography>
        </AppBar>
        <TextField placeholder='Title' value={title} onChange={handleTitleChange} error={titleError}
        helperText={titleError ? 'Title is required' : ''} sx={{m: 3}}>
        </TextField>
        <TextField placeholder='Description' value={description} onChange={handleDescriptionChange}
        error={descriptionError} helperText={descriptionError ? 'Description is required' : ''} sx={{m: 2}}>
        </TextField>
        <label>Deadline:</label>
        <DatePicker dateFormat="MM/dd/yyyy" showTimeSelect={false} selected={deadline} onChange={handleDeadlineChange} />
        <label>Priority:</label>
        <div>
          <label>
            <Radio
              value="Low"
              checked={priority === 'Low'}
              onChange={handlePriorityChange}
            />
            Low
          </label>
        </div>
        <div>
          <label>
            <Radio
              value="Medium"
              checked={priority === 'Medium'}
              onChange={handlePriorityChange}
            />
            Medium
          </label>
        </div>
        <div>
          <label>
            <Radio
              value="High"
              checked={priority === 'High'}
              onChange={handlePriorityChange}
            />
            High
          </label>
        </div>
        <div className="button-row">
          <Button variant='contained' className='edit-button'
            onClick={() => {
              handleEdit();
            }}>
            Save
          </Button>
          <Button variant='contained' color='error' onClick={props.onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;