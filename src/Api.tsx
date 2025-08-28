import axios from "axios";

export const getTest = async () => {
  await axios
    .get("http://localhost:3000/api/")
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      if (err) return err;
    });
};

export const getAllCards = async () => {
  await axios.get("http://localhost:3000/api/cards").then((res) => {
    if (res) {
      return res.data;
    } else {
      return [];
    }
  });
};

export const createCard = async (formData: any) => {
  try {
    const res = await axios.post("http://localhost:3000/api/cards", {
      ...formData,
    });
    return res.data; // <-- return the data
  } catch (err: any) {
    return { error: err };
  }
};
