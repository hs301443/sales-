import asyncHandler from 'express-async-handler';
import PopupOffer from '../../models/modelschema/popupOffer.js'; 
import { saveBase64Image } from '../../utils/handleImages.js';


export const createPopupOffer = asyncHandler(async (req, res) => {
const userId = req.currentUser.id;
  const { title, link } = req.body;

      const base64 = req.body.image;
      const folder = 'popup-offers';
      const imageUrl = await saveBase64Image(base64, userId, req, folder);

  // Create popup offer
  const popupOffer = await PopupOffer.create({
    title,
    image: imageUrl,
    link,
    status: req.body.status !== undefined ? req.body.status : true,
  });

  res.status(201).json({
    success: true,
    message: 'Popup offer created successfully',
    data: popupOffer,
  });
});


export const getPopupOffers = asyncHandler(async (req, res) => {
  const popupOffers = await PopupOffer.find({ isDeleted: false })
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    count: popupOffers.length,
    data: popupOffers,
  });
});


export const getPopupOfferById = asyncHandler(async (req, res) => {
  const popupOffer = await PopupOffer.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!popupOffer) {
    res.status(404);
    throw new Error('Popup offer not found');
  }

  res.status(200).json({
    success: true,
    data: popupOffer,
  });
});


export const updatePopupOffer = asyncHandler(async (req, res) => {
  const { title, link, status } = req.body;

  let popupOffer = await PopupOffer.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!popupOffer) {
    res.status(404);
    throw new Error('Popup offer not found');
  }

  
  const updateData = {
    title: title || popupOffer.title,
    link: link || popupOffer.link,
    status: status !== undefined ? status : popupOffer.status,
  };

  // Handle image update if provided
  if (req.body.image) {
    const base64 = req.body.image;
    const folder = 'popup-offers';
    const imageUrl = await saveBase64Image(base64, req.user._id, req, folder);
    updateData.image = imageUrl;
    

    // await deleteImageFromStorage(popupOffer.image);
  }

  // Update the popup offer
  const updatedPopupOffer = await PopupOffer.findByIdAndUpdate(
    req.params.id,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  );

  res.status(200).json({
    success: true,
    message: 'Popup offer updated successfully',
    data: updatedPopupOffer,
  });
});

export const deletePopupOffer = asyncHandler(async (req, res) => {
  const popupOffer = await PopupOffer.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!popupOffer) {
    res.status(404);
    throw new Error('Popup offer not found');
  }

  // Soft delete
  popupOffer.isDeleted = true;
  await popupOffer.save();

  res.status(200).json({
    success: true,
    message: 'Popup offer deleted successfully',
  });
});

