import React, { useState, useEffect, useCallback } from 'react';
import PetCards from './PetCards';
import { useAuthContext } from '../../hooks/UseAuthContext';

const PostingPets = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchRequests = useCallback(async () => {
    if (!user?.token) return; // ⛔ Prevent fetch if no user token

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/request', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch pet requests');

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pet requests:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]); // ✅ Depend only on `user.token`

  // ✅ Only call fetchRequests if user exists
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
            deleteBtnText={"Reject"} 
            approveBtn={true}
          />
        ))
      ) : (
        <p>No requests available</p>
      )}
    </div>
  );
};

export default PostingPets;
