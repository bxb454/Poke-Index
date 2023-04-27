import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const EditPokemonModal = ({ pokemon, onSave, onClose }) => {
  const [editedStats, setEditedStats] = useState(pokemon ? pokemon.stats : []);

  const handleChange = (index, event) => {
    const newStats = [...editedStats];
    newStats[index].base_stat = parseInt(event.target.value);
    setEditedStats(newStats);
  };

  const handleSave = () => {
    onSave(pokemon._id, editedStats);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Pokémon Stats</DialogTitle>
      <DialogContent>
        {editedStats.map((stat, index) => (
          stat.stat && (
            <TextField
              key={index}
              label={stat.stat.name}
              type="number"
              value={stat.base_stat}
              onChange={(event) => handleChange(index, event)}
              margin="normal"
              fullWidth
            />
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPokemonModal