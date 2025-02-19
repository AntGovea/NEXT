
'use client'

import { useState } from "react";
import { useAppSelector } from "@/store";
import { PokemonsGrid } from "./PokemonsGrid";


export const FavoritePokemons = () => {
  const favoritePokemons=useAppSelector(state=>Object.values(state.pokemons));
  const [pokemonState, setPokemonState] = useState(favoritePokemons)
    // console.log(Object.values(favoritePokemons))
  return (
    <div><PokemonsGrid pokemons={pokemonState}/></div>
  )
}
