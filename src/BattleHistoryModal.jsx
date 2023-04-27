import React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function BattleHistoryModal({ pokemon, onClose }) {
  const renderBattleHistory = () => {
    if (!pokemon || pokemon.battleHistory.length === 0) {
      return <Typography>This Pokémon hasn't battled yet!</Typography>;
    }

    return pokemon.battleHistory.map((history, index) => (
      <Typography key={index}>
        Battle {index + 1}: {history.result} against {history.opponent} with {history.remainingHp} HP remaining
      </Typography>
    ));
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{pokemon ? `Battle history for ${pokemon.name}` : 'Loading...'}</DialogTitle>
      <DialogContent>{renderBattleHistory()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BattleHistoryModal;