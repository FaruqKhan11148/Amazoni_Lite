const addressService = require('../services/addressService');

// ============================
// PAGE: SELECT ADDRESS
// ============================
const checkoutAddressPage = (req, res) => {
  addressService.getUserAddresses(req.user.id, (err, addresses) => {
    if (err) return res.status(500).send("DB Error");

    res.render("pages/selectAddress", { addresses });
  });
};

// ============================
// PAGE: ADD ADDRESS FORM
// ============================
const addAddressPage = (req, res) => {
  res.render("pages/addAddress");
};

// ============================
// PAGE: EDIT ADDRESS FORM
// ============================
const editAddressPage = (req, res) => {
  addressService.getUserAddressById(
    req.user.id,
    req.params.id,
    (err, address) => {
      if (err || !address.length) return res.redirect('/api/addresses');

      res.render('pages/editAddress', {
        address: address[0]
      });
    }
  );
};


// ============================
// ACTION: CREATE ADDRESS
// ============================
const createAddress = (req, res) => {
  addressService.addNewAddress(req.user.id, req.body, (err) => {
    if (err) return res.status(500).send("DB Error");
    res.redirect('/api/addresses');
  });
};

// ============================
// ACTION: UPDATE ADDRESS
// ============================
const updateAddress = (req, res) => {
  addressService.updateUserAddress(
    req.user.id,
    req.params.id,
    req.body,
    (err) => {
      if (err) return res.status(500).send("DB Error");
      res.redirect('/api/addresses');
    }
  );
};

// ============================
// ACTION: DELETE ADDRESS
// ============================
const deleteAddress = (req, res) => {
  addressService.deleteUserAddress(
    req.user.id,
    req.params.id,
    (err) => {
      if (err) return res.status(500).send("DB Error");
      res.redirect('/api/addresses');
    }
  );
};

module.exports = {
  checkoutAddressPage,
  addAddressPage,
  editAddressPage,
  createAddress,
  updateAddress,
  deleteAddress
};
