import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportLost.css';

const ReportLost = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const status = 'lost';
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!name || !description || !location || !mobile || !email || !image) {
      return 'All fields are required.';
    }

    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!mobileRegex.test(mobile)) {
      return 'Please enter a valid 10-digit mobile number.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formError = validateForm();
    if (formError) {
      setErrorMessage(formError);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('status', status);
    formData.append('mobile', mobile);
    formData.append('email', email);
    formData.append('image', image);

    try {
      setLoading(true);
      await axios.post('https://croudsource-lost-and-found-platform.onrender.com/api/Lost/upload-item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Lost item reported successfully');

      // Clear form
      setName('');
      setDescription('');
      setLocation('');
      setMobile('');
      setEmail('');
      setImage(null);
      setPreview(null);
      setLoading(false);
    } catch (error) {
      console.error('Error reporting item:', error);
      setErrorMessage('Failed to report item. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="report-lost-container">
      <button className="report-lost-back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <h2 className="report-lost-heading">Report a Lost Item</h2>

      <div className="report-lost-flexbox">
        {/* Left: Image Preview */}
        <div className="report-lost-image-preview">
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <div className="report-lost-placeholder">Image Preview</div>
          )}
        </div>

        {/* Right: Form Fields */}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="report-lost-form">
          <div className="report-lost-inputs">
            {errorMessage && <div className="report-lost-error">{errorMessage}</div>}

            <input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="report-lost-input"
              required
            />
            <textarea
              placeholder="Item Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="report-lost-textarea"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="report-lost-input"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="report-lost-input"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="report-lost-input"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="report-lost-file"
              required
            />

            <button type="submit" disabled={loading} className="report-lost-submit">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;
