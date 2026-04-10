const clientHost = window.location.hostname;

const defaultServerHost = clientHost === "localhost" ? "localhost" : clientHost;
export const baseURL =
  import.meta.env.VITE_SERVER_URL || `http://${defaultServerHost}:8000`;
export const baseAPIURL =
  import.meta.env.VITE_SERVER_BASE_URL ||
  `http://${defaultServerHost}:8000/api/v1`;
