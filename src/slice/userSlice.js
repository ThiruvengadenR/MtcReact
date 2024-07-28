import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import CONFIG from '../Config';

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${CONFIG.URL}/user/profile`, {
                headers: {
                    'barrer ': `${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUser(state) {
            state.userInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
