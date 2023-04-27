import React, { useState, useEffect } from 'react';
import AddTaskModal from './AddTaskModal';
import { Button, Table, TableRow, TableHead, TableBody, TableCell, Typography, AppBar, Toolbar, Box } from '@mui/material';
import EditTaskModal from './EditTaskModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import toast, { Toaster } from 'react-hot-toast';
import PokeBall from './Poké_Ball_icon.svg.png';
import PokeIndex from './poke_index.png';
import styles from './Crud.module.css';
import classNames from 'classnames';
import BattleModal from './BattleModal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './fonts.css';
import './retroButtons.css';
import BattleHistoryModal from './BattleHistoryModal';
import axios from 'axios';
import EditPokemonModal from './EditPokemonModal';

const Crud = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(null);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBattleHistoryModal, setShowBattleHistoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pokemon-from-db');
        const data = response.data;
        const enhancedPokemonData = data.map((pokemon) => ({ ...pokemon, battleHistory: [] }));
        setTableData(enhancedPokemonData);
      } catch (error) {
        toast.error('Failed to fetch Pokémon data!');
      }
    };
  

    fetchPokemonData();
  }, []);

  const getPokemonTypeColor = (type) => {
    switch (type) {
      case 'fire':
        return 'rgba(255, 69, 58, 0.6)';
      case 'water':
        return 'rgba(58, 167, 255, 0.6)';
      default:
        return 'rgba(0, 0, 0, 0.3)';
    }
  };

  const handleHistoryButtonClick = (e, pokemon) => {
    e.stopPropagation(); // Prevent triggering TableRow's onClick
    setSelectedPokemon(pokemon);
    setShowBattleHistoryModal(true);
  };

  const updateTableData = (newPokemon) => {
    if (tableData.length >= 36) {
      toast.error('Cannot add more than 36 Pokémon to the table!');
      return;
    }
    if (!tableData.some((pokemon) => pokemon.id === newPokemon.id)) {
      // Convert the types array to an array of type names
      newPokemon.types = newPokemon.types.map((type) => type.type.name);
      addPokemonToDatabase(newPokemon);
    } else {
      toast.error('This Pokémon already exists in the table!');
    }
  };

  const deleteAllPokemon = async () => {
    try {
      const response = await axios.delete('http://localhost:3001/api/delete-all-pokemon');
      toast.success(response.data.message);
      // Clear the table data
      setTableData([]);
    } catch (error) {
      console.error('Error deleting all Pokémon from the database:', error);
      toast.error('Failed to delete all Pokémon from the database!');
    }
  };

  const addPokemonToDatabase = async (pokemon) => {
    try {
      const response = await axios.post('http://localhost:3001/api/add-pokemon', pokemon);
      toast.success(response.data.message);
      // Update table data with the new Pokemon returned from the server
      setTableData([...tableData, response.data.data]);
    } catch (error) {
      console.error('Error adding Pokémon to the database:', error);
      toast.error('Failed to add Pokémon to the database!');
    }
  };

  const paginatedData = tableData.slice((currentPage - 1) * 12, currentPage * 12);

  const updateBattleHistory = async (pokemonId, battleDetails) => {
    try {
      console.log('Updating battle history:', pokemonId, battleDetails);
      const response = await axios.put(`http://localhost:3001/api/update-battle-history/${pokemonId}`, { battleData: battleDetails });
      const updatedPokemon = response.data;
  
      const updatedTableData = tableData.map((item) =>
        item.id === updatedPokemon.id ? updatedPokemon : item
      );
      setTableData(updatedTableData);
    } catch (error) {
      console.error('Failed to update battle history:', error);
    }
  };

  const handleBattleButtonClick = (e, pokemon) => {
    e.stopPropagation(); // Prevent triggering TableRow's onClick
    setSelectedPokemon(pokemon);
    setShowBattleModal(true);
  };

  const removePokemon = async (pokemon) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/delete-pokemon/${pokemon.id}`);
      toast.success(response.data.message);
      // Remove the deleted Pokemon from the table data
      const newTableData = tableData.filter((item) => item !== pokemon);
      setTableData(newTableData);
    } catch (error) {
      console.error('Failed to delete Pokémon:', error);
      toast.error('Failed to delete Pokémon!');
    }
  };

  const showBattleHistory = (pokemon) => {
    const battleHistoryString = pokemon.battleHistory
      .map(
        (history, index) =>
          `Battle ${index + 1}: ${history.result} against ${history.opponent} with ${history.remainingHp} HP remaining`
      )
      .join('\n');
  };

  const updatePokemonStats = async (updatedPokemon) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/update-pokemon/${updatedPokemon.id}`, updatedPokemon);
      const updatedTableData = tableData.map((item) =>
        item.id === updatedPokemon.id ? response.data.data : item
      );
      setTableData(updatedTableData);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Failed to update Pokémon stats:', error);
      toast.error('Failed to update Pokémon stats!');
    }
  };

  return (
    <div className={styles.container}>
    <AppBar position="sticky" className={styles.appBar}>
      <Toolbar variant="dense" className={styles.toolbar}>
        <Box
          component="img"
          sx={{ height: 64 }}
          alt="Your logo."
          src={PokeBall}
          className={styles.pokeball}
        />
        <Typography
          variant="h4"
          component="div"
          className={styles.frameworkText}
        >
          <Box
            component="img"
            sx={{ height: 80, marginTop: '0px', marginRight: '-85px' }}
            alt="Your logo."
            src={PokeIndex}
            className={styles.pokeIndex}
          />
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          className={styles.addButton}
          sx={{backgroundColor: 'green'}}
          onClick={() => setShowAddModal(true)}
        >
          Add Pokémon
        </Button>
        {showAddModal && (
          <AddTaskModal
            onAdd={updateTableData}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </Toolbar>
    </AppBar>
    <Table aria-label="Pokémon" className={styles.flTable}>
      <TableHead>
        <TableRow>
          <TableCell align="center" className={styles.tableText}>Pokémon</TableCell>
          <TableCell align="center" className={styles.tableText}>Name</TableCell>
          <TableCell align="center" className={styles.tableText}>Type</TableCell>
          <TableCell align="center" className={styles.tableText}>HP</TableCell>
          <TableCell align="center" className={styles.tableText}>Attack</TableCell>
          <TableCell align="center" className={styles.tableText}>Defense</TableCell>
          <TableCell align="center" className={styles.tableText}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {paginatedData.map((pokemon, index) => (
          <TableRow
          key={index}
          onClick={() => {
            setSelectedPokemonIndex(index);
            showBattleHistory(pokemon);
          }}
          className={classNames({
            [styles.selectedPokemon]: selectedPokemonIndex === index,
            [styles.tableRow]: true,
          })}
          style={{
            '--box-shadow-color': selectedPokemonIndex === index
              ? getPokemonTypeColor(pokemon.types?.[0]?.type?.name)
              : undefined,
          }}
        >
              <TableCell align="center" className={styles.tableText}>
              <img src={pokemon.sprites?.front_default ?? 'default_image_url'} alt={pokemon.name} className={styles.pokemonImage} />
              </TableCell>
              <TableCell align="center" className={styles.tableText}>{pokemon.name}</TableCell>
              <TableCell align="center" className={styles.tableText}>
  {pokemon.types?.map((typeName, index) => (
    <div key={index}>{typeName ?? 'N/A'}</div>
  )) ?? <div>No types available</div>}
</TableCell>
              <TableCell align="center" className={styles.tableText}>{pokemon.stats?.[0]?.base_stat ?? 'N/A'}</TableCell>
<TableCell align="center" className={styles.tableText}>{pokemon.stats?.[1]?.base_stat ?? 'N/A'}</TableCell>
<TableCell align="center" className={styles.tableText}>{pokemon.stats?.[2]?.base_stat ?? 'N/A'}</TableCell>
              <TableCell align="center">
  <Button
    variant="contained"
    color="primary"
    className="battle-button"
    sx={{ m: 1 }}
    onClick={(e) => handleBattleButtonClick(e, pokemon)}
  >
    Battle
  </Button>
  <br />
            <Button
              variant="contained"
              className="history-button"
              sx={{ m: 1 }}
              onClick={(e) => handleHistoryButtonClick(e, pokemon)}
            >
              History
            </Button>
  <br />
  <Button
  variant="contained"
  startIcon={<CancelIcon />}
  color="error"
  className="delete-button"
  sx={{ m: 1, alignItems: "right" }}
  onClick={async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/delete-pokemon/${pokemon._id}`);
      const data = response.data;
      const newTableData = tableData.filter((item) => item._id !== pokemon._id);
      toast.success(data.message);
      setTableData(newTableData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete Pokémon');
    }
  }}
>
  Delete
</Button>
</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <Button
  variant="contained"
  color="error"
  className="delete-all-button"
  sx={{ m: 1 }}
  onClick={deleteAllPokemon}
>
  Delete All Pokémon
</Button>
  <Stack spacing={2} className={styles.pagination} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}>
        <Pagination
          count={Math.ceil(tableData.length / 12)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          shape="rounded"
          sx={{
            // Add custom styling to the Pagination component
            '.MuiPaginationItem-root': {
              fontSize: '1.25rem',
              fontWeight: 'bold',
            },
            '.MuiPaginationItem-page': {
              color: 'rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
              },
            },
            '.Mui-selected': {
              color: '#ffffff',
              backgroundColor: 'rgba(58, 167, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(58, 167, 255, 0.9)',
              },
            },
          }}
        />
      </Stack>
      {showBattleHistoryModal && (
      <BattleHistoryModal
        pokemon={selectedPokemon}
        onClose={() => setShowBattleHistoryModal(false)}
      />
    )}
  {showBattleModal && (
     <BattleModal
     userPokemon={selectedPokemon}
     onClose={() => setShowBattleModal(false)}
     onBattleEnd={(success, battleDetails) => {
       updateBattleHistory(selectedPokemon, battleDetails);
       if (!success) removePokemon(selectedPokemon);
     }}
     updateBattleHistory={updateBattleHistory}
   />
    )}
    {showEditModal && (
  <EditPokemonModal
    pokemon={selectedPokemon}
    onSave={updatePokemonStats}
    onClose={() => setShowEditModal(false)}
  />
)}
  <Toaster
    position="bottom-right"
    reverseOrder={false}
  />
</div>
);
};

export default Crud;