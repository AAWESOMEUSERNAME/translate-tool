import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dao from "renderer/utils/dao";
import { useAppSelector } from "renderer/utils/hooks";

const modelSlice = createSlice({
  name: 'common',
  initialState: {
    repoInfoList: {
      loading: false,
      data: [] as DTO.RepositoryInfo[]
    },
    articleInfoList: {
      loading: false,
      data: [] as DTO.ArticleInfo[]
    }
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
      .addCase(loadArticles.pending,(state, action) => {
        state.articleInfoList.loading = true
      })
      .addCase(loadArticles.fulfilled,(state, action) => {
        state.articleInfoList.loading = false
        state.articleInfoList.data = action.payload
      })
      .addCase(loadArticles.rejected,(state, action) => {
        state.articleInfoList.loading = false
      })
  },
})


export const loadAllRepo = createAsyncThunk('model/repository/list', () => dao.repo.list())
export const loadArticles = createAsyncThunk('model/article/list', (repoId: number) => dao.article.list(repoId))

export const { } = modelSlice.actions

export const useRepoList = () => useAppSelector(state => state.model.repoInfoList)
export const useArticleList = () => useAppSelector(state => state.model.articleInfoList)

export default modelSlice.reducer
