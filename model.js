const { getAttendanceLogs } = require('./connection');

const fetchAttendanceLogs = async (machineNo, ip, port) => {
    return await getAttendanceLogs(machineNo, ip, port);
};

module.exports = {
    fetchAttendanceLogs
};
