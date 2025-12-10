import { fetchWithConfig } from "./config";

export const fetchData = fetchWithConfig;

// Export the new enhanced function

export {
  fetchWithConfig,
  getApiConfig,
  getAuthHeaders,
  buildQueryString,
  API_ENDPOINTS,
} from "./config";
