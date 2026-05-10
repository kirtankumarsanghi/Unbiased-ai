// useModels hook
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { API } from "../constants";

export function useModels() {
  return useQuery({
    queryKey: ["models"],

    queryFn: async () => {
      const response = await axios.get(
        `${API.BASE_URL}${API.ENDPOINTS.MODELS.LIST}`
      );

      return response.data;
    },
  });
}