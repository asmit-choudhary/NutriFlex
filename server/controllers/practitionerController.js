const PractitionerProfile = require('../models/PractitionerProfile');

// POST /api/practitioners/profile  (practitioner create/update their own profile)
const upsertMyProfile = async (req, res) => {
    try{
        const { specialty, bio, ratePerSession, yearsExperience, availability } = req.body;

        // "upsert" = update if it exist, insert (create) if it doesn't - one operation, no need
        // to separately check "does this practitioner already have a profile?"
        const profile = await PractitionerProfile.findOneAndUpdate(
            { user: req.user._id},  // find by the logged-in user's _id
            { specialty, bio, ratePerSession, yearsExperience, availability },
            { new: true, upsert: true, runValidators: true}
            // new: true  -> return the updated document, not the old one
            // upsert: true -> create it if no matching doc id found
            // runValidatio: true -> still enforce scheme rules (enum, required, etc.) on update 
        );

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/practitioner (profile - anyone can browse, with optional ? specialty = filter)
const getPractitioners = async (req, res) => {
    try{
        const filter = { isApproved: true }; // for now this will retuen nothing until you flip isApproved

        if(req.query.specialty){
            filter.specialty = req.query.specialty;
        }

        const practitioners = await PractitionerProfile.find(filter).populate('user', 'name email'); // pulls in name + email from the linked User doc
        
        res.json(practitioners);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

// GET /api/practitioners/:id (public - one practitioner's full profile)
const getPractitionersById = async (req, res) => {
    try{
        const practitioners = await PractitionerProfile.findById(req.params.id).populate('user', 'name email');

        if(!practitioners){
            return res.status(404).json({ message: 'Practitioner not found '});
        }

        res.json(practitioners);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { upsertMyProfile, getPractitioners, getPractitionersById };
