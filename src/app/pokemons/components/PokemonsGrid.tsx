import { SimplePokemon } from '../interfaces/simple-pokemon';
import { PokemonCard } from './PokemonCard';

interface Props {
    pokemons: SimplePokemon[],
}



export const PokemonsGrid = ({ pokemons }: Props) => {

    return (
        <div className='flex flex-wrap gap-10 items-center justify-center'>
            {
                pokemons.map((pokemon, idx) =>
                  
                    // <span key={pokemon.id}>{pokemon.name} </span>

                    <PokemonCard key={pokemon.id + idx}pokemon={pokemon} />
                )


            }</div>
    )
}
