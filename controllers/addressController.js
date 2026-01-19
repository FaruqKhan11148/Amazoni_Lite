const addressService = require('../services/addressService');

/**
 * GET /api/addresses
 */
const getAddresses = (req, res) => {
  addressService.getUserAddresses(req.user.id, (err, data) => {
    if (err) return res.status(500).json({ message: 'DB error', err });
    res.json(data);
  });
};

/**
 * POST /api/addresses
 */


/**
 * PUT /api/addresses/:id
 */
const updateAddress = (req, res) => {
  addressService.updateUserAddress(
    req.user.id,
    req.params.id,
    req.body,
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Address not found' });

      res.json({ message: 'Address updated successfully' });
    }
  );
};

/**
 * PATCH /api/addresses/:id/default
 */
const setDefaultAddress = (req, res) => {
  addressService.setUserDefaultAddress(req.user.id, req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'DB error', err });
    res.json({ message: 'Default address set successfully' });
  });
};

/**
 * DELETE /api/addresses/:id
 */
const deleteAddress = (req, res) => {
  addressService.deleteUserAddress(
    req.user.id,
    req.params.id,
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Address not found' });

      res.json({ message: 'Address deleted successfully' });
    }
  );
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};
