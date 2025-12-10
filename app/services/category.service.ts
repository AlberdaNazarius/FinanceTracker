import axios from "axios";

const getCategories = async () => {
  const response = await axios.get("/api/category");
  return response.data;
}

export const CategoryService = {
  getCategories
}