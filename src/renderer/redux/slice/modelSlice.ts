import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const modelSlice = createSlice({
  name: 'common',
  initialState: {
    repoInfoList: [] as DTO.RepositoryInfo[]
  },
  reducers: {
  },
})

export const { } = modelSlice.actions

export default modelSlice.reducer
