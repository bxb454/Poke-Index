const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemon');

let fetch;

(async () => {
  const module = await import('node-fetch');
  fetch = module.default;
})();

router.get('/pokemon-from-db', async (req, res) => {
  try {
    const pokemons = await Pokemon.find({});
    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

  // Route to fetch opponent Pokémon data from the external PokeAPI
router.get('/pokemon-data/:id', async (req, res) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  router.put('/update-battle-history/:id', async (req, res) => {
    try {
      const pokemonId = req.params.id;
      const battleData = req.body.battleData;
  
      const pokemon = await Pokemon.findOne({ id: pokemonId });
  
      if (!pokemon) {
        return res.status(404).send('Pokémon not found');
      }
  
      pokemon.battleHistory.push(battleData);
      await pokemon.save();
  
      res.json(pokemon);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  router.delete('/delete-all-pokemon', async (req, res) => {
  try {
    await Pokemon.deleteMany({});
    res.status(200).json({ message: 'All Pokémon deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.delete('/delete-pokemon/:id', async (req, res) => {
  try {
    const pokemonId = req.params.id;
    const deletedPokemon = await Pokemon.findByIdAndDelete(pokemonId);
    
    if (!deletedPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    res.status(200).json({ message: 'Pokemon deleted successfully', data: deletedPokemon });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

  // Route to fetch Pokémon list
router.get('/pokemon-list', async (req, res) => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
      const data = await response.json();
      res.json(data.results);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Route to fetch Pokémon types
  router.get('/pokemon-types', async (req, res) => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/type');
      const data = await response.json();
      res.json(data.results);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Route to fetch Pokémon data by type
  router.get('/pokemon-by-type/:type', async (req, res) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${req.params.type}`);
      const data = await response.json();
      const filteredList = data.pokemon.map((entry) => entry.pokemon);
      res.json(filteredList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  router.post('/add-pokemon', async (req, res) => {
    try {
      const pokemon = req.body;
  
      // Log the incoming pokemon object and its properties
      console.log('Incoming pokemon object:', pokemon);
      console.log('pokemon.name:', pokemon.name);
      console.log('pokemon.types:', pokemon.types);
      console.log('pokemon.sprites:', pokemon.sprites);
      console.log('pokemon.stats:', pokemon.stats);
  
      // Check if pokemon object is not undefined
      if (!pokemon) {
        return res.status(400).json({ message: 'Missing pokemon object' });
      }
  
      // Check if pokemon object has required properties
      if (!pokemon.name || !pokemon.types || !pokemon.sprites || !pokemon.stats) {
        return res.status(400).json({ message: 'Pokemon object missing required properties' });
      }
  
      const name = pokemon.name;
      const types = pokemon.types.map(typeObject => typeObject.type ? typeObject.type.name : null).filter(type => type !== null);
      const sprites = pokemon.sprites;
      const stats = pokemon.stats.map(statObject => {
        return {
          name: statObject.stat ? statObject.stat.name : null,
          base_stat: statObject.base_stat,
          effort: statObject.effort
        };
      }).filter(stat => stat.name !== null);
      

const formattedPokemon = {
  name: name,
  types: types,
  sprites: sprites,
  stats: stats
};
      
    const newPokemon = new Pokemon(formattedPokemon);
    newPokemon.save()
  .then(() => console.log('Pokemon added!'))
  .catch(err => console.log('Error adding Pokémon:', err));
  
      res.status(201).json({ message: 'Pokemon added successfully', data: newPokemon });
    } catch (error) {
      console.error('Error adding Pokémon:', error);
      res.status(500).json({ message: 'Failed to add Pokemon', error: error.message });
    }
  });
  
  router.put('/update-battle-history/:id', async (req, res) => {
    try {
      const pokemonId = req.params.id;
      const battleData = req.body;
      const updatedPokemon = await Pokemon.findByIdAndUpdate(pokemonId, {
        $push: { battleHistory: battleData },
      }, { new: true });
  
      if (!updatedPokemon) {
        return res.status(404).json({ message: 'Pokemon not found' });
      }
      res.status(200).json({ message: 'Battle history updated', data: updatedPokemon });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update battle history', error: error.message });
    }
  });
  
module.exports = router;