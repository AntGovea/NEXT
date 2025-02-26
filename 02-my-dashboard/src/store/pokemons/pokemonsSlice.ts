import { SimplePokemon } from '@/pokemons';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface PokemonsState {
    favorites: { [key: string]: SimplePokemon }
}

// const getInitialState = () => {

//     // if (typeof localStorage === "undefined") return {}

//     const pokemons = JSON.parse(localStorage.getItem('favorite-pokemons') ?? '{}')
//     return pokemons


// }


const initialState: PokemonsState = {
    // ...getInitialState()
    favorites: {}
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
            if (!!state.favorites[id]) {
                delete state.favorites[id];
                return;
            } else {
                state.favorites[id] = pokemon;

            }
            // console.log('state.favorites despues', state.favorites)

            //TODO mala praxis
            localStorage.setItem('favorite-pokemons', JSON.stringify(state.favorites))
        },
        setFavoritesPokemons(state, action: PayloadAction<{ [key: string]: SimplePokemon }>) {
            state.favorites = action.payload;
        }


    }
});

export const { toggleFavorite, setFavoritesPokemons } = pokemonsSlice.actions

export default pokemonsSlice.reducer