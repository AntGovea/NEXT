import { FavoritePokemons, PokemonsGrid } from "@/pokemons";
// import { getAllFavoritesPokemons } from "@/store/pokemons/pokemonsSlice";
import {  useAppSelector } from "@/store";

function page() {

  // const statePokemons=useAppSelector(state=>state.pokemons);
  // const dispatch = useAppDispatch();

  // console.log(Object.values(statePokemons))
 


  // const pokemons = dispatch(getAllFavoritesPokemons())

  return (
    <div className="flex flex-col ">
      <span className='text-5xl my-2'>Listado de Pokémons <small>Favoritos</small></span>

      <FavoritePokemons />
    </div>
  )
}

export default page;
