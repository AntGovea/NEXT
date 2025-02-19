import { SimplePokemon } from '@/pokemons';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface PokemonsState {
    [key: string]: SimplePokemon
}

const getPokemons = () => {
    const pokemons = JSON.parse(localStorage.getItem('favorite-pokemons') ?? '{}')
    return pokemons


}
const initialState: PokemonsState = {
    ...getPokemons()
    
    //   "1":{id:"1",name:"charmander"}
    
    
}

const pokemonsSlice = createSlice({
    name: 'pokemons',
    initialState,
    reducers: {


        toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
            const pokemon = action.payload;
            // console.log('state antes', state)
            const { id } = pokemon;
            if (!!state[id]) {
                delete state[id];
                return;
            }else{
                state[id] = pokemon;

            }
            // console.log('state despues', state)

            //TODO mala praxis
            localStorage.setItem('favorite-pokemons', JSON.stringify(state))
        },
        getAllFavoritesPokemons(state) {
            // return Object.values(state);
        }


    }
});

export const { toggleFavorite, getAllFavoritesPokemons } = pokemonsSlice.actions

export default pokemonsSlice.reducer