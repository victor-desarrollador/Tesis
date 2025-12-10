import { fetchWithConfig } from "./config";
import { Category } from "@/types/type";

export const fetchData = fetchWithConfig;

interface CategoriesResponse {
    categories: Category[];
}

const CategoriesResponse = async () => {
  let categories: Category [] = [];
  let error: string | null = null;

  try {
    const data = await fetchData<CategoriesResponse>("/categories");
    categories = data?.categories;
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
    console.log("error", error);
  }
}



export {
  fetchWithConfig,
  getApiConfig,
  getAuthHeaders,
  buildQueryString,
  API_ENDPOINTS,
} from "./config";
