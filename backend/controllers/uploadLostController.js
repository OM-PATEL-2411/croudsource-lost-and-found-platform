const cloudinary = require('../config/cloudinaryConfig');
const LostItem = require('../models/LostItem');  // LostItem model
const Item = require('../models/Item');  // Unified model
const bufferToStream = require('../utils/bufferToStream'); // Utility function

const uploadLostImage = (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Upload the image to Cloudinary
    const stream = cloudinary.uploader.upload_stream({
      folder: 'lost_found_items',  // Optional: Create a folder in Cloudinary
    },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error uploading image', error: error.message });
      }

      // Save the image URL to MongoDB with the other item details
      const newLostItem = new LostItem({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        imageUrl: result.secure_url,  // Store Cloudinary image URL
        status: 'Lost',  // Set the status as 'Lost' for this item
        email: req.body.email,
        mobile: req.body.mobile,
      });

      // Save the LostItem and then create the unified Item record
      newLostItem.save()
        .then(() => {
          // Prepare the same data for the new unified 'Item' model
          const newItem = {
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            imageUrl: result.secure_url,
            status: 'Lost',
            email: req.body.email,
            mobile: req.body.mobile,
            createdAt: new Date(),
          };

          // Save the new data to the unified 'Item' collection
          return Item.create(newItem);
        })
        .then(() => {
          // Send the success response after both operations are completed
          res.status(200).json({ message: 'Item added successfully' });
        })
        .catch(err => {
          console.error('Error in saving items:', err);
          res.status(500).json({ message: 'Error adding item', error: err.message });
        });
    });

    // Using the stream to upload the file buffer
    bufferToStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error('Error in uploadLostImage:', err);
    res.status(500).json({ message: 'Error uploading image', error: err.message });
  }
};

module.exports = { uploadLostImage };
