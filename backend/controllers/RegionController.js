const Region = require('../model/RegionModel'); 

exports.createRegion = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newRegion = new Region({
      name,
      description,
    });

    const savedRegion = await newRegion.save();
    res.status(201).json(savedRegion);
  } catch (error) {
    console.error('Error creating region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.json({ regions });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to get a region by ID
exports.getRegionById = async (req, res) => {
  const { id } = req.params;

  try {
    const region = await Region.findById(id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to update a region by ID
exports.updateRegionById = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedRegion = await Region.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (updatedRegion) {
      res.json(updatedRegion);
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error updating region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to delete a region by ID
exports.deleteRegionById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRegion = await Region.findByIdAndDelete(id);

    if (deletedRegion) {
      res.json({ message: 'Region deleted successfully' });
    } else {
      res.status(404).json({ message: 'Region not found' });
    }
  } catch (error) {
    console.error('Error deleting region:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.addVoterToRegion = async (regionId, voterId) => {
  try {
    const region = await Region.findById(regionId);
    region.voters.push(voterId);
    await region.save();
  } catch (error) {
    console.error('Error adding voter to region:', error);
  }
};

exports.addPartyToRegion = async (regionId, partyId) => {
  try {
    const region = await Region.findById(regionId);
    region.parties.push(partyId);
    await region.save();
  } catch (error) {
    console.error('Error adding party to region:', error);
  }
};