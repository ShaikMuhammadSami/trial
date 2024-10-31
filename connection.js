const ffi = require('ffi-napi');
const ref = require('ref-napi');
const struct = require('ref-struct-napi');

// Load the FK623Attend.dll and define the necessary functions
const fkAttendDLL = ffi.Library('FK623Attend.dll', {
    'FK_ConnectNet': ['int', ['int', 'string', 'int', 'int', 'int', 'int', 'int']],
    'FK_LoadGeneralLogData': ['int', ['int', 'int']],
    'FK_GetGeneralLogData': ['int', ['int', ref.refType(ref.types.uint32), ref.refType(ref.types.int), ref.refType(ref.types.int), ref.refType(ref.types.longlong)]],
    'FK_GetLastError': ['int', ['int']],
    'FK_DisConnect': ['void', ['int']],
});

// Define structure for holding attendance log data
const AttendanceLog = struct({
    enrollNumber: 'uint32',
    verifyMode: 'int',
    inOutMode: 'int',
    dateTime: 'longlong' // Use appropriate type for DateTime
});

// Function to connect to the device
const connectToDevice = (machineNo, ip, port) => {
    const timeout = 5000;
    const protocolType = 0; // Adjust based on your requirements
    const netPassword = 0; // Adjust if required
    const license = 0; // Adjust if required

    const handle = fkAttendDLL.FK_ConnectNet(machineNo, ip, port, timeout, protocolType, netPassword, license);
    if (handle < 0) {
        const errorCode = fkAttendDLL.FK_GetLastError(handle);
        console.error(`Connection error: ${errorCode}`);
        return null; // Handle the error as necessary
    }
    return handle; // Return the connection handle for further use
};

// Function to get attendance logs
const getAttendanceLogs = async (machineNo, ip, port) => {
    const handle = connectToDevice(machineNo, ip, port);
    if (!handle) {
        throw new Error('Failed to connect to device');
    }

    const logs = [];
    let readMark = 0;

    while (true) {
        const loadResult = fkAttendDLL.FK_LoadGeneralLogData(handle, readMark);
        if (loadResult < 0) break; // Handle no more logs or error

        const logData = new AttendanceLog();
        const result = fkAttendDLL.FK_GetGeneralLogData(handle, logData.ref(), logData.verifyMode.ref(), logData.inOutMode.ref(), logData.dateTime.ref());
        if (result < 0) break; // Handle no more logs

        logs.push({
            userId: logData.enrollNumber,
            verifyMode: logData.verifyMode,
            inOutMode: logData.inOutMode,
            dateTime: logData.dateTime,
        });

        readMark++;
    }

    // Disconnect from the device
    fkAttendDLL.FK_DisConnect(handle);
    return logs; // Return the logs array
};

module.exports = {
    getAttendanceLogs
};
