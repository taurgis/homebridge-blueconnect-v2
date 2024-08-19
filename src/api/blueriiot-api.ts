import { BlueToken, BlueCredentials } from './BlueToken';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const apiClientFactory = require('aws-api-gateway-client').default;
const AWS_REGION = 'eu-west-1';

const BASE_HEADERS = {
  'User-Agent': 'BlueConnect/3.2.1',
  'Accept-Language': 'en-DK;q=1.0, da-DK;q=0.9',
  'Accept': '**',
};
const BASE_URL = 'https://api.riiotlabs.com/prod/';

export class BlueriiotAPI {
  token : BlueToken | null;
  email : string = '';
  password : string = '';

  constructor() {
    this.token = null;
  }

  async init(email : string, password : string) {
    this.email = email;
    this.password = password;

    await this.getToken();
  }

  getToken = async () => {
    const config = { invokeUrl: BASE_URL };
    const apiClient = apiClientFactory.newClient(config);
    const pathParams = {};
    const pathTemplate = 'user/login';
    const method = 'POST';
    const additionalParams = {
      headers: BASE_HEADERS,
    };
    const body = {
      email: this.email,
      password: this.password,
    };

    try {
      const resultLogin = await apiClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body);
      const data = resultLogin.data;
      const cred = data.credentials;

      const blueCred = new BlueCredentials(cred.access_key, cred.secret_key, cred.session_token, cred.expiration);
      this.token = new BlueToken(data.identity_id, data.token, blueCred);
    } catch (resultLogin) {
      this.token = null;
    }
  };

  getData = async(
    pathParams : unknown,
    pathTemplate : string,
    queryParams : unknown,
  ) => {
    if(this.token === null) {
      throw new Error('You need to init api first!');
    }

    const cred = this.token.credentials;
    // Check if expired and refresh if needed
    const now = new Date().getTime();
    const expire = Date.parse(this.token.credentials.expiration);

    if (expire > now) {
      await this.getToken();
    }

    const apiClient = apiClientFactory.newClient({
      invokeUrl: BASE_URL,
      region: AWS_REGION,
      accessKey: cred.access_key,
      secretKey: cred.secret_key,
      sessionToken: cred.session_token,
    });

    const method = 'GET';
    const additionalParams = {
      headers: BASE_HEADERS,
      queryParams: queryParams,
    };
    const body = {
    };

    const response = await apiClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body);
    const data = response.data;

    return JSON.stringify(data);
  };

  isAuthenticated = () => {
    return this.token !== null;
  };

  getUser = async () => {
    if (this.isAuthenticated()) {
      const pathParams = {};
      const pathTemplate = 'user/';

      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getBlueDevice = async (blue_device_serial : string) => {
    if (this.isAuthenticated()) {

      const pathParams = {
        blue_device_serial: blue_device_serial,
      };

      const pathTemplate = 'blue/{blue_device_serial}/';

      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getSwimmingPools = async () => {
    if (this.isAuthenticated()) {
      const pathParams = {};
      const pathTemplate = 'swimming_pool/';

      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getSwimmingPool = async (swimming_pool_id : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/';

      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getSwimmingPoolStatus = async (swimming_pool_id : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/status/';


      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getSwimmingPoolBlueDevices = async (swimming_pool_id : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/blue/';

      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getSwimmingPoolFeed = async (swimming_pool_id : string, language : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const queryParams = {
        language: language,
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/feed';

      return await this.getData(pathParams, pathTemplate, queryParams);
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getLastMeasurements = async (swimming_pool_id : string, blue_device_serial : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
        blue_device_serial: blue_device_serial,
      };
      const queryParams = {
        mode: 'blue_and_strip',
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/blue/{blue_device_serial}/lastMeasurements';

      return await this.getData(pathParams, pathTemplate, queryParams);
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getGuidance = async (swimming_pool_id : string, language : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const queryParams = {
        language: language,
        mode: 'interactive_v03',
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/guidance';

      return await this.getData(pathParams, pathTemplate, queryParams);
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getGuidanceHistory = async (swimming_pool_id : string, language : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const queryParams = {
        language: language,
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/guidance/history';

      return await this.getData(pathParams, pathTemplate, queryParams);
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getChemistry = async (swimming_pool_id : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const queryParams = {};
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/chemistry';

      return await this.getData(pathParams, pathTemplate, queryParams);
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getWeather = async (swimming_pool_id : string, language : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        swimming_pool_id: swimming_pool_id,
      };
      const queryParams = {
        language: language,
      };
      const pathTemplate = 'swimming_pool/{swimming_pool_id}/weather';

      return await this.getData(pathParams, pathTemplate, queryParams);
    } else {
      throw new Error('You need to init api first!');
    }
  };

  getBlueDeviceCompatibility = async (blue_device_serial : string) => {
    if (this.isAuthenticated()) {
      const pathParams = {
        blue_device_serial: blue_device_serial,
      };
      const pathTemplate = 'blue/{blue_device_serial}/compatibility';

      return await this.getData(pathParams, pathTemplate, '');
    } else {
      throw new Error('You need to init api first!');
    }
  };

}
