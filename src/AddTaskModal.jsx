import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';
import { Button, Typography, AppBar, Stack, CircularProgress, Box } from '@mui/material';
import { Autocomplete } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddTaskModal(props) {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pokemon-list');
        setPokemonList(response.data);
        setFilteredPokemonList(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch Pokémon list!');
      }
    };

    const fetchPokemonTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pokemon-types');
        setPokemonTypes(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch Pokémon types!');
      }
    };

    fetchPokemonList();
    fetchPokemonTypes();
  }, []);

  const handleTypeChange = (event, value) => {
    setSelectedType(value);
    if (value) {
      filterPokemonByType(value);
    } else {
      setFilteredPokemonList(pokemonList);
    }
  };

  const filterPokemonByType = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/pokemon-by-type/${type.name}`);
      setFilteredPokemonList(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to filter Pokémon by type!');
    }
  };

  const handlePokemonChange = async (event, value) => {
    if (value) {
      try {
        const response = await axios.get(`http://localhost:3001/api/pokemon-data/${value.name}`);
        setSelectedPokemon(response.data);
      } catch (error) {
        toast.error('Failed to fetch Pokémon data!');
      }
    } else {
      setSelectedPokemon(null);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <AppBar position="static" className="app-bar" sx={{ marginBottom: '16px' }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ textAlign: 'center', height: '20px', marginBottom: '16px', marginTop: '8px' }}
          >
            Pokedex
          </Typography>
          </AppBar>
        <Stack spacing={2} sx={{ marginBottom: '16px' }}>
          <Autocomplete
            options={pokemonTypes}
            getOptionLabel={(option) => option.name}
            onChange={handleTypeChange}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <input type="text" {...params.inputProps} placeholder="Filter by type" />
              </div>
            )}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              options={filteredPokemonList}
              getOptionLabel={(option) => option.name}
              onChange={handlePokemonChange}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input type="text" {...params.inputProps} placeholder="Search for a Pokemon" />
                </div>
              )}
            />
          )}
        </Stack>
        {selectedPokemon && selectedPokemon.sprites && (
          <div>
            <Typography variant="body2" component="div" sx={{ color: 'black' }}>
              {selectedPokemon.name}
            </Typography>
            <Box>
              <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
            </Box>
          </div>
        )}
        <div className="button-row">
          <Button
            variant="contained"
            onClick={() => {
              props.onAdd(selectedPokemon);
              props.onClose();
            }}
            disabled={!selectedPokemon}
          >
            Add
          </Button>
          <Button variant="contained" color="error" onClick={props.onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;