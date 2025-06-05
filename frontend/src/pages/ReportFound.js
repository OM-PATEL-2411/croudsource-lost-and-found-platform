// ReportFound.js
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportFound.css'; // Make sure to create and import this

const ReportFound = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const status = 'Found';
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('status', status);
    formData.append('mobile', mobile);
    formData.append('email', email);
    formData.append('image', image);

    try {
      await axios.post('https://croudsource-lost-and-found-platform.onrender.com/api/Found/upload-item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Found item reported successfully');
      // Clear form
      setName('');
      setDescription('');
      setLocation('');
      setMobile('');
      setEmail('');
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error('Error reporting item:', error);
      alert('Failed to report item. Try again.');
    }
  };

  return (
    <div className="report-found-container">
      <button className="report-found-back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
      <div className="report-lost-flexbox">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="report-found-form"
      >
        <h2 className="report-found-heading">Report a Found Item</h2>

        <div className="report-found-flexbox">
          <div className="report-found-image-preview">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <div className="report-found-placeholder">Image Preview</div>
            )}
          </div>

          <div className="report-found-inputs">
            <input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="report-found-input"
              required
            />
            <textarea
              placeholder="Item Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="report-found-textarea"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="report-found-input"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="report-found-input"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="report-found-input"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="report-found-file"
              required
            />
            <button type="submit" className="report-found-submit">
              Submit
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ReportFound;
