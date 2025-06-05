import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/LostFoundItemDetails.css';

const LostFoundItemDetails = () => {
  const { itemId, itemType } = useParams();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const apiUrl = itemType === 'lost'
          ? `http://localhost:5000/lostitems/itemDetails/${itemId}`
          : `http://localhost:5000/founditems/itemDetails/${itemId}`;

        const response = await axios.get(apiUrl);
        setItemDetails(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [itemId, itemType]);

  if (!itemDetails) return <p>Loading item details...</p>;

  return (
    <div className="itemDetailsContainer">
      <button onClick={() => navigate(-1)} className="backButton">← Back</button>

      <div className="detailsWrapper">
        {itemDetails.imageUrl && (
          <div className="imageWrapper">
            <img
              src={itemDetails.imageUrl}
              alt={itemDetails.name || 'Item'}
              className="itemImage"
            />
          </div>
        )}

        <div className="itemInfo">
          <h2 className="heading">Item Details</h2>
          <div className="itemFields">
            {Object.entries(itemDetails).map(([key, value]) => {
              if (key === '_id' || key === '__v' || key === 'imageUrl') return null;

              if (key === 'createdAt') {
                const dateObj = new Date(value);
                const uploadDate = dateObj.toLocaleDateString();
                const reportedTime = dateObj.toLocaleTimeString();

                return (
                  <React.Fragment key={key}>
                    <p><strong>Upload Date:</strong> {uploadDate}</p>
                    <p><strong>Reported Time:</strong> {reportedTime}</p>
                  </React.Fragment>
                );
              }

              return (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFoundItemDetails;
