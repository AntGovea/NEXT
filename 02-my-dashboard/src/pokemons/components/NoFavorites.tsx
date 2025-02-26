import React from 'react'
import { IoHeartOutline } from 'react-icons/io5'

export const NoFavorites = () => {
    return (
        <div className='flex justify-center'>
            <span>
                No hay favoritos
                <IoHeartOutline size={200} color='red' />
            </span>

        </div>
    )
}
