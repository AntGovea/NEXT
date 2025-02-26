
'use client'

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { PokemonsGrid } from "./PokemonsGrid";
import { NoFavorites } from "./NoFavorites";


export const FavoritePokemons = () => {
  const favoritePokemons = useAppSelector(state => Object.values(state.pokemons.favorites));
  const [pokemons, setPokemonState] = useState(favoritePokemons)
  // console.log(Object.values(favoritePokemons))


  // useEffect(() => {
  //   let favorites = JSON.parse(localStorage.getItem('favorite-pokemons') ?? '{}');

  //   if (favorites.length !== favoritePokemons.length) {
  //     setPokemonState(favorites)
  //   }
  // }, [])


  return (
    <div> {favoritePokemons.length !== 0 ? <PokemonsGrid pokemons={favoritePokemons} /> : <NoFavorites />}</div>
  )
}
