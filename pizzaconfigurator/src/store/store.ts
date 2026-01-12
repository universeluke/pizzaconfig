import { configureStore } from "@reduxjs/toolkit";
import pizzaReducer from "./pizzaSlice"
import basketReducer from "./basketSlice"

const savedBasket = localStorage.getItem('basket')

const preloadedState = savedBasket ? { basket: JSON.parse(savedBasket) } : undefined

export const store = configureStore({
    reducer: {
        pizza: pizzaReducer,
        basket: basketReducer
    },
    preloadedState
})

store.subscribe(() => {
    const state = store.getState()
    localStorage.setItem('basket', JSON.stringify(state.basket))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch