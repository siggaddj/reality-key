// https here is necesary for some features to work, even if this is going to be behind an SSL-providing reverse proxy.
const https = require('https');
const fs = require('fs');
const path = require('path');
const Corrosion = require('corrosion');

// you are free to use self-signed certificates here, if you plan to route through an SSL-providing reverse proxy.
const ssl = {MIIDlDCCAnwCCQCcBCJT39JFxjANBgkqhkiG9w0BAQsFADCBizELMAkGA1UEBhMC
VVMxDTALBgNVBAgMBE9ISU8xDTALBgNVBAcMBFNUT1cxEDAOBgNVBAoMB0tORUVD
QVAxDjAMBgNVBAsMBU93bmVyMRMwEQYDVQQDDApLbmVlYXBMb3JkMScwJQYJKoZI
hvcNAQkBFhhtYWdudXNhamFja3NvbkBnbWFpbC5jb20wHhcNMjExMDA3MTYxNDM1
WhcNMjExMTA2MTYxNDM1WjCBizELMAkGA1UEBhMCVVMxDTALBgNVBAgMBE9ISU8x
DTALBgNVBAcMBFNUT1cxEDAOBgNVBAoMB0tORUVDQVAxDjAMBgNVBAsMBU93bmVy
MRMwEQYDVQQDDApLbmVlYXBMb3JkMScwJQYJKoZIhvcNAQkBFhhtYWdudXNhamFj
a3NvbkBnbWFpbC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCZ
qiEEznhM3DMOZZEpitUfQFhFK6Vr7hJ/j6GFvHRsANmWEOz4nY7rvGk/tCJZMs2V
ARAhVmAEO9CfRMuBZuZ3bY4MqrcRoPzD1ul5vHyMnGDOGZYHk7fdHeQ0x2DMPH2N
hQTvLGvaLL3n8n/UCvD+rW0S97/qAuwqzlOcROwzBoDHmlnQq5BdVlZu5vrFVk2h
kvOIGuaUSPHPR2ECDJ8qjTtqlUHR+gAAbSSa8feXWf7hgpqzO2qg15EZdmrj2LKt
6ZoOUxvyVjV7uW91t2B36YDJQW+LX8ZWI3kLRaicw3V+VV92/j+/cTUPMyFBuAsG
1s1krAde9hd/glB/AcjzAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAESJi8SI8d8K
jgmWUIGGrGgkKhOikrAs6C/Qedr0wRDlc9ivbjTo03MQIz9srq7HkU3mS/+pnX6R
4eWU9k6BxGjdLsv42DoESljJ3QKyGY6tZGTI81yKsRjWEaGT1kJc/hRWUsxgHs91
pb0tEB3IbWis0stHcKzJH1q/OoeWVmqAP4p9/k4RrlhNDBiqqBbEHB6DVjyICshG
41xeBpWvJrFG1PF2uLLKm85/G8sVqJqelM5TBfwBUkbxeQphHrVh9KNOmLDcpWCm
/+MfvtXJaOLRRaNMAWvQKTX2tciwbaGOMb045W0AIB5j5Fr9zQDUL+OnX6uth8pW
AqX3EpcxA3I=
    key: fs.readFileSync(path.join(__dirname, '/ssl.key')),
    cert: fs.readFileSync(path.join(__dirname, '/ssl.cert')),
};
const server = https.createServer(ssl);
const proxy = new Corrosion({
    codec: 'xor', // apply basic xor encryption to url parameters in an effort to evade filters. Optional.
    prefix: '/get/' // specify the endpoint (prefix). Optional.
});

proxy.bundleScripts();

server.on('request', (request, response) => {
    if (request.url.startsWith(proxy.prefix)) return proxy.request(request, response);
    response.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead)).listen(8443); // port other than 443 if it is needed by other software.
