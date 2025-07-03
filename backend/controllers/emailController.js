const { getPaginatedEmail } = require("../services/email.services.js");
exports.getEmailList = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'name',
        order = 'asc',
    } = req.query;

    try {
        const { events, total } = await getPaginatedEmail({
            page,
            limit,
            search,
            sortBy,
            order,
        });
        res.status(200).json({ data: events, total });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
