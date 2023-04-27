import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Typography, LinearProgress } from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';

function BattleModal({ userPokemon, onClose, onBattleEnd, updateBattleHistory }) {
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [userCurrentHp, setUserCurrentHp] = useState(userPokemon.stats[0].base_stat);
  const [opponentCurrentHp, setOpponentCurrentHp] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [isBattling, setIsBattling] = useState(false);

  useEffect(() => {
    const fetchOpponentPokemon = async () => {
      try {
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await axios.get(`http://localhost:3001/api/pokemon-data/${randomId}`);
        const data = response.data;
        setOpponentPokemon(data);
        setOpponentCurrentHp(data.stats[0].base_stat);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch opponent Pokémon data!");
      }
    };

    fetchOpponentPokemon();
  }, []);

  const logMessage = (message) => {
    setBattleLog((prevBattleLog) => [...prevBattleLog, message]);
  };

  useEffect(() => {
    if (isBattling) {
      if (userCurrentHp > 0 && opponentCurrentHp > 0) {
        setTimeout(() => performBattle(), 1000);
      } else {
        setIsBattling(false);
      }
    }
  }, [isBattling, userCurrentHp, opponentCurrentHp]);
  
  const performBattle = () => {
    const logMessage = (message) => {
      setBattleLog((prevBattleLog) => [...prevBattleLog, message]);
    };
  
    const userSpeedStat = userPokemon.stats.find((stat) => stat.stat && stat.stat.name === "speed");
    const userSpeed = userSpeedStat ? userSpeedStat.base_stat : 0;
    const opponentSpeedStat = opponentPokemon.stats.find((stat) => stat.stat && stat.stat.name === "speed");
    const opponentSpeed = opponentSpeedStat ? opponentSpeedStat.base_stat : 0;
    let userTurn = userSpeed >= opponentSpeed;
  
    const attacker = userTurn ? userPokemon : opponentPokemon;
    const defender = userTurn ? opponentPokemon : userPokemon;
    const attackStat = attacker.stats[1].base_stat;
    const defenseStat = defender.stats[2].base_stat;
    const damage = Math.max(1, Math.floor((attackStat / defenseStat) * 10));
  
    if (userTurn) {
      setOpponentCurrentHp((prevHp) => {
        const newHp = Math.max(0, prevHp - damage);
        logMessage(`${attacker.name} attacked ${defender.name} for ${damage} damage!`);
        if (newHp === 0) {
          logMessage(`${userPokemon.name} won the battle!`);
          updateBattleHistory(userPokemon._id, {
            opponent: opponentPokemon.name,
            result: 'Won',
            remainingHp: userCurrentHp,
          });
        }
        return newHp;
      });
    } else {
      setUserCurrentHp((prevHp) => {
        const newHp = Math.max(0, prevHp - damage);
        logMessage(`${attacker.name} attacked ${defender.name} for ${damage} damage!`);
        if (newHp === 0) {
          logMessage(`${userPokemon.name} lost the battle.`);
          updateBattleHistory(userPokemon._id, {
            opponent: opponentPokemon.name,
            result: 'Lost',
            remainingHp: userCurrentHp,
          });
        }
        return newHp;
      });
    }
  };

  if (!opponentPokemon) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Battle</DialogTitle>
      <DialogContent>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>{userPokemon.name}</Typography>
          <Typography>{opponentPokemon.name}</Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <img src={userPokemon.sprites.front_default} alt={userPokemon.name} width="100" height="100" />
          <img src={opponentPokemon.sprites.front_default} alt={opponentPokemon.name} width="100" height="100" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <LinearProgress
            variant="determinate"
            value={(userCurrentHp / userPokemon.stats[0].base_stat) * 100}
            style={{ flexGrow: 1, marginRight: '16px' }}
          />
          <LinearProgress
            variant="determinate"
            value={(opponentCurrentHp / opponentPokemon.stats[0].base_stat) * 100}
            style={{ flexGrow: 1, marginLeft: '16px' }}
          />
        </div>
        <div style={{ marginTop: '16px', marginBottom: '16px', minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}>
          {battleLog.map((message, index) => (
            <Typography key={index}>{message}</Typography>
          ))}
        </div>
        {isBattling ? (
          <Button variant="contained" color="primary" disabled>
            Battling...
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={() => performBattle(userPokemon, opponentPokemon, setUserCurrentHp, setOpponentCurrentHp)}>
            Start Battle
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BattleModal;