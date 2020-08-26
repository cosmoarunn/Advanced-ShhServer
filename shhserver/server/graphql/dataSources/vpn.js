const { RESTDataSource } = require('apollo-datasource-rest');

class ConnectionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  async getAllConnections() {
    const response = await this.get('connections'); 
    
    return Array.isArray(response)
        ? response.map(connection => this.connectionReducer(connection))
        : [];
    }

  connectionReducer(connection) {
    
    return {
      id: connection.clientId || 0,
      connected: (connection.event == "connect")?connection.timestamp:"",
      disConnected: (connection.event == "disconnect")?connection.timestamp:"",
      ipAddress: connection.pub,
      port: connection.port,
      vpnIp: connection.vpn,
      lastSeen: connection.seen,
      location:{ 
        countryCode: connection.countryCode,
        countryName: connection.countryName,
        latitude: connection.latitude,
        longitude: connection.longitude
      },
      dataTransfer: {
        sent: connection.sent,
        received: connection.received,
        lost: connection.lost
      },
      vpnSub: "SILVER",
      isAlive: true,
      timestamp: connection.timestamp
    };
  }  

  async getConnectionById({ connectionId }) {
    const response = await this.get('connections', { clientId: clientId });
    return this.connectionReducer(response[0]);
  }

  getConnectionsByIds({ connectionIds }) {
    return Promise.all(
      connectionIds.map(connectId => this.getConnectionById({ connectionId })),
    );
  }

}

module.exports = LaunchAPI;