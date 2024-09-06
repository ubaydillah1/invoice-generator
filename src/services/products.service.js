// export const getProducts = (callback) => {
//   fetch("https://fakestoreapi.com/products")
//     .then((res) => res.json())
//     .then((json) => callback(json))
//     .catch((error) => {
//       console.error("Error fetching products:", error);
//     });
// };

import axios from "axios";
const URL = import.meta.env.VITE_APP_URL;

export const getCards = async (callback) => {
  try {
    const response = await axios.get(`${URL}/cards`);
    callback(response.data);
  } catch (err) {
    console.log(err.message);
  }
};

export const addCards = async (newProduct, callback) => {
  try {
    const response = await axios.post(`${URL}/cards`, newProduct);
    callback(response.data);
  } catch (err) {
    console.log(err);
  }
};

export const editCards = async (id, updatedCards, callback) => {
  try {
    const response = await axios.put(`${URL}/cards/${id}`, updatedCards);
    callback(response.data);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCards = async (id) => {
  try {
    await axios.delete(`${URL}/${id}`);
    return id;
  } catch (error) {
    console.log(error);
  }
};
