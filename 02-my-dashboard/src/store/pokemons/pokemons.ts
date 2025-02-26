// add importations from others 
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//next , we add our imports
import { SimplePokemon } from '@/pokemons';

// add a type of simple pokemon
interface PokemonsState {
    [key: string]: SimplePokemon
}

//set a bulbasur with out favorite pokemon
const initialState: PokemonsState = {
    '1': { id: '1', name: 'bulbasaur' },
}
// create slice
const pokemonsSlice = createSlice({
    name: 'pokemons',
    initialState,
    reducers: {

        // add reducer to set out favorite pokemon
        toggleFavorite: (state, action: PayloadAction<SimplePokemon>) => {
            const pokemon=action.payload;
            const {id}=pokemon;
        
        // verify if exist, we delete te pokemon
        if (!!state[id]) {
            // delete a pomeon from the object
            delete state[id];
            return
        }
        
        // en caso de que no exista lo agregamos
        state[id]=pokemon
        }

    }
});

export const {toggleFavorite } = pokemonsSlice.actions

export default pokemonsSlice.reducer