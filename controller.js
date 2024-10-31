const biomaxModel = require('./model');

const fetchAttendanceLogs = async (req, res) => {
    try {
        const { machineNo, ip, port } = req.body;
        const logs = await biomaxModel.fetchAttendanceLogs(machineNo, ip, port);
        res.status(200).json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    fetchAttendanceLogs
};
