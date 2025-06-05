import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/ItemDetails.module.css'; // Import the CSS module

const ItemDetails = () => {
  const { itemId } = useParams(); // Get itemId from the URL params
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState(null); // State for item details

  // Fetch item details when component mounts
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`https://croudsource-lost-and-found-platform.onrender.com/routes/itemDetails/${itemId}`);
        setItemDetails(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  // Show a loading state until the item is fetched
  if (!itemDetails) return <p>Loading item details...</p>;

  return (
    <div className={styles.itemDetailsContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>← Back</button>

      <div className={styles.detailsWrapper}>
        {/* Product Image */}
        {itemDetails.imageUrl && (
          <div className={styles.imageWrapper}>
            <img src={itemDetails.imageUrl} alt={itemDetails.name || 'Item'} className={styles.itemImage} />
          </div>
        )}

        {/* Product Information */}
        <div className={styles.itemInfo}>
          <h2 className={styles.heading}>{itemDetails.name}</h2>
          <div className={styles.itemFields}>
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

export default ItemDetails;
