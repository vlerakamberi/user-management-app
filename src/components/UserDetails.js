import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './UserDetails.css';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check redux store first for local users
    const localUser = users.find((u) => u.id === parseInt(id));
    
    if (localUser) {
      setUser(localUser);
      setLoading(false);
    } else {
      // fetch from api if not found locally
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [id, users]);

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (!user) {
    return (
      <div className="error-container">
        <p>User not found</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-details-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Users
      </button>

      <div className="user-details-card">
        <h2>{user.name}</h2>
        
        <div className="details-section">
          <h3>Contact Information</h3>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{user.phone || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Website:</span>
            <span className="detail-value">
              {user.website ? (
                <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                  {user.website}
                </a>
              ) : (
                'N/A'
              )}
            </span>
          </div>
        </div>

        {user.address && (
          <div className="details-section">
            <h3>Address</h3>
            <div className="detail-item">
              <span className="detail-label">Street:</span>
              <span className="detail-value">{user.address.street || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City:</span>
              <span className="detail-value">{user.address.city || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Zipcode:</span>
              <span className="detail-value">{user.address.zipcode || 'N/A'}</span>
            </div>
            {user.address.suite && (
              <div className="detail-item">
                <span className="detail-label">Suite:</span>
                <span className="detail-value">{user.address.suite}</span>
              </div>
            )}
          </div>
        )}

        {user.company && (
          <div className="details-section">
            <h3>Company</h3>
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user.company.name || 'N/A'}</span>
            </div>
            {user.company.catchPhrase && (
              <div className="detail-item">
                <span className="detail-label">Catchphrase:</span>
                <span className="detail-value">{user.company.catchPhrase}</span>
              </div>
            )}
            {user.company.bs && (
              <div className="detail-item">
                <span className="detail-label">Business:</span>
                <span className="detail-value">{user.company.bs}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
