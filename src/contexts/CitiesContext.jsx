import { createContext, useContext, useReducer, useCallback } from "react";
import { useEffect } from "react";

const BASE_URL = "http://localhost:8000";

async function fetchData(dispatch, actionType, url) {
  try {
    dispatch({ type: "loading" });
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch!");
    const data = await res.json();
    dispatch({ type: actionType, payload: data });
  } catch (err) {
    dispatch({ type: "rejected", payload: err.message });
  } finally {
    dispatch({ type: "loaded" });
  }
}

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loaded":
      return { ...state, isLoading: false };
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
      };
    case "city/loaded":
      return { ...state, currentCity: action.payload };
    case "city/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [{ isLoading, cities, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    fetchData(dispatch, "cities/loaded", `${BASE_URL}/cities`);
  }, []);

  const getCityData = useCallback(
    async function getCityData(id) {
      if (Number(id) === currentCity.id) return;
      fetchData(dispatch, "city/loaded", `${BASE_URL}/cities/${id}`);
    },
    [currentCity.id]
  );

  async function addCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      if (!res.ok) throw new Error("Failed to add a city!");
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    } finally {
      dispatch({ type: "loaded" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("An error occurred!");
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    } finally {
      dispatch({ type: "loaded" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCityData,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context)
    throw new Error("Accessing CitiesContext outside of it's provider!");
  return context;
}

export { CitiesProvider, useCities };
