import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './PetCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchRequests = useCallback(async () => {
    if (!user?.token) return; // ⛔ Prevent API call if user/token is missing

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/approvedPets', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch approved pets');

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching approved pet requests:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]); // ✅ Depend only on `user.token`

  // ✅ Only fetch when user is available
  useEffect(() => {
    if (user) fetchRequests();
  }, [user, fetchRequests]);

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((request) => (
          <PetCards 
            key={request._id} 
            pet={request} 
            updateCards={fetchRequests} 
            deleteBtnText={"Delete Post"} 
            approveBtn={false}
          />
        ))
      ) : (
        <p>No Approved Pets available</p>
      )}
    </div>
  );
};

export default ApprovedRequests;
