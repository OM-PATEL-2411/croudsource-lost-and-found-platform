const cloudinary = require('../config/cloudinaryConfig');
const FoundItem = require('../models/FoundItem');  // FoundItem model
const Item = require('../models/Item');  // Unified model
const bufferToStream = require('../utils/bufferToStream'); // Utility function

const uploadFoundImage = (req, res) => {
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
      const newFoundItem = new FoundItem({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        imageUrl: result.secure_url,  // Store Cloudinary image URL
        status: 'Found',  // Set the status as 'Found' for this item
        email: req.body.email,
        mobile: req.body.mobile,
      });

      // Save the FoundItem and then create the unified Item record
      newFoundItem.save()
        .then(() => {
          // Prepare the same data for the new unified 'Item' model
          const newItem = {
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            imageUrl: result.secure_url,
            status: 'Found',
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
    console.error('Error in uploadFoundImage:', err);
    res.status(500).json({ message: 'Error uploading image', error: err.message });
  }
};

module.exports = { uploadFoundImage };
