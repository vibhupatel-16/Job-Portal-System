import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1/interview",
  withCredentials: true
});

export const createInterview = (data) =>
  API.post("/create", data);

export const addRound = (id, data) =>
  API.post(`/${id}/round`, data);

export const submitFeedback = (id, data) =>
  API.put(`/${id}/feedback`, data);

export const finalizeInterview = (id, data) =>
  API.put(`/${id}/finalize`, data);

export const getMyInterviews = () =>
  API.get("/my");
