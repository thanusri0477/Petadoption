import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import { useAuthContext } from "../../hooks/UseAuthContext";

const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [petsData, setPetsData] = useState([]); // Ensures petsData starts as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !user.token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:4000/approvedPets", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pets data");
        }
        const data = await response.json();
        
        // Ensure the fetched data is an array
        setPetsData(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching pets data:", error);
        setError("An error occurred while fetching the data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // Safely filter petsData only if it's an array
  const filteredPets = (Array.isArray(petsData) ? petsData : []).filter((pet) =>
    filter === "all" ? true : pet.type === filter
  );

  return (
    <>
      <div className="filter-selection">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All Pets</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Rabbit">Rabbits</option>
          <option value="Bird">Birds</option>
          <option value="Fish">Fish</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="pet-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((petDetail, index) => (
            <PetsViewer pet={petDetail} key={petDetail.id || index} />
          ))
        ) : (
          <p className="oops-msg">Oops!... No pets available</p>
        )}
      </div>
    </>
  );
};

export default Pets;
