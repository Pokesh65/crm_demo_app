import { createSlice } from "@reduxjs/toolkit";
import { getStoredData } from "../../utils/utilityFunction";


const setAuthToken = () => {
    const accessToken = localStorage.getItem("accessToken")
    console.log("current accessToken :", accessToken)
    return accessToken ? accessToken : false
}

const initialState = {
    list: {
        isLoading: false,
        isAuthenticated: setAuthToken(),
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setIsLoading: (state, action) => {
            state.list.isLoading = action.payload
        },

        setIsAuthenticated: (state, action) => {
            state.list.isAuthenticated = action.payload
        }
    }
})

export const { setIsAuthenticated, setIsLoading } = authSlice.actions;
export default authSlice.reducer;