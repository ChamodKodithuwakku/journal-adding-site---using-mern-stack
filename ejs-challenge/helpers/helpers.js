const mongoose = require('mongoose');

// Define your Mongoose schema and model here

// Assuming you have already connected to the MongoDB database

// Find a document by its ID and update it
const updateDocumentById = async (id, updatedFields) => {
  try {
    // Use the findByIdAndUpdate method
    // 'id' is the ID of the document you want to update
    // 'updatedFields' is an object containing the fields you want to update
    // { new: true } option returns the updated document after the update
    const updatedDocument = await Detail.findByIdAndUpdate(id, updatedFields, { new: true });

    if (updatedDocument) {
      console.log('Updated Document:', updatedDocument);
    } else {
      console.log('Document not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage example:
const documentIdToUpdate = 'your-document-id-here'; // Replace with the actual document ID
const updatedFields = {
  title: 'Updated Title',
  content: 'Updated Content',
};

updateDocumentById(documentIdToUpdate, updatedFields);
