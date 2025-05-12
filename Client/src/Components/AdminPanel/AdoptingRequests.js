import React, { useState, useEffect, useCallback } from 'react';
import FormCard from './FormCard';
import { useAuthContext } from '../../hooks/UseAuthContext';

const AdoptingRequests = () => {
  const [forms, setForms] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetailsPopup, setPetDetailsPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState('');
  const { user } = useAuthContext();

  const fetchForms = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      const response = await fetch('http://localhost:4000/form/getForms', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Error fetching adoption requests');
      const data = await response.json();
      setForms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching adoption forms:", error);
    }
  }, [user]);

  const fetchPets = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      const response = await fetch('http://localhost:4000/approvedPets', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Error fetching approved pets');
      const data = await response.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchForms(), fetchPets()]).then(() => setLoading(false));
  }, [fetchForms, fetchPets]);

  const petsWithRequests = pets.filter(pet => forms.some(form => form.petId === pet._id));
  const filteredPets = selectedPetId ? petsWithRequests.filter(pet => pet._id === selectedPetId) : petsWithRequests;

  return (
    <div>
      <div className="dropdown-container" style={{ textAlign: 'right', marginBottom: '20px' }}>
        <select className='req-filter-selection' onChange={(e) => setSelectedPetId(e.target.value)} value={selectedPetId}>
          <option value="">All Requests</option>
          {petsWithRequests.map(pet => (
            <option key={pet._id} value={pet._id}>{pet.name}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading...</p> : filteredPets.length > 0 ? (
        filteredPets.map(pet => (
          <div key={pet._id} className='form-container'>
            <h2 className='clickable-pet-name' onClick={() => { setSelectedPet(pet); setPetDetailsPopup(true); }}>{pet.name}</h2>
            <div className='form-child-container'>
              {forms.filter(form => form.petId === pet._id).map(form => (
                <FormCard
                  key={form._id}
                  form={form}
                  pet={pet}
                  updateCards={fetchForms}
                  deleteBtnText={'Reject'}
                  approveBtn={true}
                />
              ))}
            </div>
          </div>
        ))
      ) : <p>No adoption requests available for any pet.</p>}

      {petDetailsPopup && selectedPet && (
        <div className='popup'>
          <div className='popup-content'>
            <div className='pet-view-card'>
              <div className='pet-card-pic'>
                <img src={`http://localhost:4000/images/${selectedPet.filename}`} alt={selectedPet.name} />
              </div>
              <div className='pet-card-details'>
                <h2>{selectedPet.name}</h2>
                <p><b>Type:</b> {selectedPet.type}</p>
                <p><b>Age:</b> {selectedPet.age}</p>
                <p><b>Location:</b> {selectedPet.area}</p>
                <p><b>Owner Email:</b> {selectedPet.email}</p>
                <p><b>Owner Phone:</b> {selectedPet.phone}</p>
                <p><b>Justification:</b> {selectedPet.justification}</p>
              </div>
            </div>
            <button onClick={() => { setPetDetailsPopup(false); setSelectedPet(null); }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptingRequests;
