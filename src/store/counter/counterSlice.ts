//rxlice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  count: number,
  isReady:boolean,

}



const initialState: CounterState = {
  count: 20,
 isReady:false,
}

const counterSlice = createSlice({
  name: 'counter',

  initialState,

  reducers: {
    initCounter(state,action:PayloadAction<number>){
      if (state.isReady) {
        return
      }

      state.count=action.payload;
      state.isReady=true;
    }
    ,
    incrementOne: (state) => {
      state.count++;

    },

    decrementOne: (state) => {
      if (state.count === 0) return

      state.count--;

    },

    resetCount: (state, action: PayloadAction<number>) => {
      if (action.payload < 0) action.payload = 0

      state.count = action.payload;
    },

  }
});

export const { incrementOne,decrementOne,resetCount} = counterSlice.actions;

export default counterSlice.reducer;