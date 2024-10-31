const ffi = require('ffi-napi');
const FK623Attend = require('./biomax/Execute&Dll/FK623Attend.dll');
const fkAttendDLL = ffi.Library(FK623Attend, {
    'FK_ConnectNet': ['int', ['int', 'string', 'int', 'int', 'int', 'int', 'int']],
    'FK_LoadGeneralLogData': ['int', ['int', 'int']],
    'FK_GetGeneralLogData': ['int', ['int', 'pointer', 'pointer', 'pointer', 'pointer']],
    'FK_GetLastError': ['int', ['int']],
    // Add other necessary functions here
});

const connectToDevice = () => {
    const machineNo = AMDB20032100546; // Replace with your machine number
    const ipAddress = '192.168.62.50'; // Your BioMax device IP
    const port = 5005; // Port number
    const timeout = 5000; // Timeout in milliseconds
    const protocolType = 0; // Protocol type (adjust as necessary)
    const netPassword = 0; // Password if required
    const license = 0; // License number if required

    const handle = fkAttendDLL.FK_ConnectNet(machineNo, ipAddress, port, timeout, protocolType, netPassword, license);
    if (handle < 0) {
        const errorCode = fkAttendDLL.FK_GetLastError(handle);
        console.error(`Connection error: ${errorCode}`);
        return null; // Handle the error as necessary
    }
    return handle; // Return the connection handle for further use
};
