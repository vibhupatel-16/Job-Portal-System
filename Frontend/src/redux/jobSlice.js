import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    homeJobs: [],
    allEmployerJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    filters: {
      location: "",
      title: "",
      salary: "",
      experience: ""
    },
  },

  reducers: {
    setAllJob: (state, action) => {
      state.allJobs = action.payload;
    },

    setHomeJobs: (state, action) => {
      state.homeJobs = action.payload;
    },

    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },

    setAllEmployerJob: (state, action) => {
      state.allEmployerJobs = action.payload;
    },

    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },

    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },

    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setAllJob,
  setHomeJobs,
  setSingleJob,
  setAllEmployerJob,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setFilter
} = jobSlice.actions;

export default jobSlice.reducer;
