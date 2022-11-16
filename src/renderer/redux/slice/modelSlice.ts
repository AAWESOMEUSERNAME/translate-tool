import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import _dao from "renderer/utils/dao";
import { useAppSelector } from "renderer/utils/hooks";

const modelSlice = createSlice({
  name: 'common',
  initialState: {
    repoInfoList: {
      loading: false,
      data: [] as DTO.RepositoryInfo[]
    },
  },
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(loadAllRepo.pending, (state, action) => {
        state.repoInfoList.loading = true
      })
      .addCase(loadAllRepo.fulfilled, (state, action) => {
        state.repoInfoList.data = action.payload
        state.repoInfoList.loading = false
      })
      .addCase(loadAllRepo.rejected, (state, action) => {
        state.repoInfoList.data = []
        state.repoInfoList.loading = false
      })
  },
})


export const loadAllRepo = createAsyncThunk('model/repository/list', () => _dao.repo.list())

export const { } = modelSlice.actions

export const useRepoList = () => useAppSelector(state => state.model.repoInfoList)

export default modelSlice.reducer
