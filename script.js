// IPv6 Smart Campus Addressing System
// Frontend application for IPv6-based addressing in smart campus networking

// IPv6 Address Generator and Validator
class IPv6AddressManager {
  constructor() {
    this.campusPrefix = '2001:db8:cafe:';
    this.devices = this.loadDevices();
  }

  // Generate IPv6 address based on campus configuration
  generateIPv6Address(campusId, subnetPrefix, deviceType, deviceName) {
    // Convert inputs to hex
    const campusHex = this.padHex(parseInt(campusId) || 1, 2);
    const subnetHex = this.padHex(parseInt(subnetPrefix) || 1, 2);
    
    // Device type codes
    const deviceCodes = {
      'sensor': '0001',
      'camera': '0002',
      'gateway': '0003',
      'controller': '0004',
      'endpoint': '0005'
    };
    
    const deviceCode = deviceCodes[deviceType.toLowerCase()] || '0005';
    const deviceIdHex = this.padHex(Math.floor(Math.random() * 65535), 4);
    
    // Construct full IPv6 address
    const ipv6Address = `${this.campusPrefix}${campusHex}:${subnetHex}::${deviceCode}:${deviceIdHex}`;
    
    return ipv6Address;
  }

  // Validate IPv6 address format
  validateIPv6Address(address) {
    // IPv6 regex pattern
    const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    
    return ipv6Pattern.test(address);
  }

  // Pad hex values
  padHex(value, length) {
    return value.toString(16).toUpperCase().padStart(length, '0');
  }

  // Load devices from localStorage
  loadDevices() {
    const stored = localStorage.getItem('campusDevices');
    return stored ? JSON.parse(stored) : [];
  }

  // Save devices to localStorage
  saveDevices() {
    localStorage.setItem('campusDevices', JSON.stringify(this.devices));
  }

  // Add device
  addDevice(name, type, ipv6, status = 'online') {
    const device = {
      id: Date.now(),
      name: name,
      type: type,
      ipv6: ipv6,
      status: status,
      registered: new Date().toLocaleString()
    };
    this.devices.push(device);
    this.saveDevices();
    return device;
  }
}

// Initialize manager
const manager = new IPv6AddressManager();

// DOM Elements
const campusIdInput = document.getElementById('campusId');
const subnetPrefixInput = document.getElementById('subnetPrefix');
const deviceTypeSelect = document.getElementById('deviceType');
const deviceNameInput = document.getElementById('deviceName');
const generateBtn = document.getElementById('generateBtn');
const validateInput = document.getElementById('validateInput');
const validateBtn = document.getElementById('validateBtn');
const resultBox = document.getElementById('resultBox');
const validationResult = document.getElementById('validationResult');
const deviceTable = document.getElementById('deviceTable');

// Event Listeners
if (generateBtn) {
  generateBtn.addEventListener('click', handleGenerateAddress);
}

if (validateBtn) {
  validateBtn.addEventListener('click', handleValidateAddress);
}

// Handle address generation
function handleGenerateAddress() {
  const campusId = campusIdInput.value;
  const subnetPrefix = subnetPrefixInput.value;
  const deviceType = deviceTypeSelect.value;
  const deviceName = deviceNameInput.value;

  if (!campusId || !subnetPrefix || !deviceType || !deviceName) {
    resultBox.innerHTML = '<p style="color: #ff6b6b;">Please fill in all fields</p>';
    return;
  }

  const ipv6Address = manager.generateIPv6Address(campusId, subnetPrefix, deviceType, deviceName);
  
  // Add device to manager
  manager.addDevice(deviceName, deviceType, ipv6Address);
  
  // Display result
  resultBox.innerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white;">
      <h3 style="margin: 0 0 10px 0;">Generated IPv6 Address</h3>
      <p style="margin: 5px 0; font-family: monospace; font-size: 16px; word-break: break-all;">${ipv6Address}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">Device: ${deviceName} | Type: ${deviceType}</p>
    </div>
  `;

  // Update device table
  updateDeviceTable();
  
  // Clear inputs
  deviceNameInput.value = '';
}

// Handle address validation
function handleValidateAddress() {
  const address = validateInput.value.trim();
  
  if (!address) {
    validationResult.innerHTML = '<p style="color: #ff6b6b;">Please enter an IPv6 address</p>';
    return;
  }

  const isValid = manager.validateIPv6Address(address);
  
  validationResult.innerHTML = `
    <div style="background: ${isValid ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'}; padding: 15px; border-radius: 8px; color: white; text-align: center;">
      <h4 style="margin: 0;">${isValid ? '✓ Valid IPv6 Address' : '✗ Invalid IPv6 Address'}</h4>
      <p style="margin: 10px 0 0 0; font-family: monospace; font-size: 12px; word-break: break-all;">${address}</p>
    </div>
  `;
}

// Update device table display
function updateDeviceTable() {
  if (!deviceTable) return;
  
  const tbody = deviceTable.querySelector('tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  manager.devices.forEach((device, index) => {
    const row = document.createElement('tr');
    const statusColor = device.status === 'online' ? '#11998e' : '#ff6b6b';
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${device.name}</td>
      <td>${device.type}</td>
      <td style="font-family: monospace; font-size: 12px; word-break: break-all;">${device.ipv6}</td>
      <td><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${device.status}</span></td>
      <td>${device.registered}</td>
    `;
    
    tbody.appendChild(row);
  });
}

// Update network statistics
function updateNetworkStats() {
  const totalDevices = manager.devices.length;
  const onlineDevices = manager.devices.filter(d => d.status === 'online').length;
  const sensorDevices = manager.devices.filter(d => d.type === 'sensor').length;
  
  // Update stat cards if they exist
  const statElements = document.querySelectorAll('.stat-value');
  if (statElements.length >= 4) {
    statElements[0].textContent = totalDevices;
    statElements[1].textContent = onlineDevices;
    statElements[2].textContent = sensorDevices;
    statElements[3].textContent = manager.devices.filter(d => d.type !== 'sensor').length;
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  updateDeviceTable();
  updateNetworkStats();
});

// Sample data initialization (only on first load)
if (manager.devices.length === 0) {
  manager.addDevice('Main Gateway', 'gateway', '2001:db8:cafe:1:1::0003:0001');
  manager.addDevice('Temperature Sensor 1', 'sensor', '2001:db8:cafe:1:2::0001:0002');
  manager.addDevice('Security Camera A', 'camera', '2001:db8:cafe:1:3::0002:0003');
  updateDeviceTable();
  updateNetworkStats();
}
