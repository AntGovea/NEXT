import { PokemonsGrid } from '@/app/pokemons';
import { PokemonsResponse } from '@/app/pokemons/interfaces/pokemons-response';
import { SimplePokemon } from '@/app/pokemons/interfaces/simple-pokemon';
import axios from 'axios';




const getPokemns = async (limit = 20, offset = 0): Promise<SimplePokemon[]> => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`);
        let newData: PokemonsResponse = response.data;
        const pokemons = newData.results.map((pokemon) => ({
            id: pokemon.url.split('/').at(-2)!,
            name: pokemon.name,
        })
        )


        throw new  Error('Error del servidor :D');
        return pokemons;
    }
    catch (error) {
        console.log(error)
        return []
    }
}






async function pokemonsPage() {
    let pokemons = await getPokemns(151);

    return (
        <div className="flex flex-col ">
            <span className='text-5xl my-2'>Listado de Pokémons <small>estatico</small></span>
        
            <PokemonsGrid pokemons={pokemons} />
        </div>
    )

}

export default pokemonsPage
