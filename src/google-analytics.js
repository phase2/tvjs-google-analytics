/**
 * Google Analytics Measurement Protocol support for Apple's TVMLKit JS
 */
export default class GoogleAnalytics {
  /**
   * Initialize the Google Anlytics tracker
   *
   * @param {string} trackingID         The tracking ID, of the form UA-XXXXXXXXX-X
   * @param {string} appName            Application Name (user defined)
   * @param {object} additionalParams   User parameters to add/override the defaults
   */
  constructor(trackingID, appName, additionalParams = {}) {
    this.trackingID = trackingID;
    this.appName = appName;
    this.clientID = localStorage.getItem(GoogleAnalytics.CLIENT_ID_KEY);
    this.hasCreatedSession = false;
    this.debug = false;
    this.useValidator = false;

    if (!this.clientID) {
      this.clientID = UUID();
      localStorage.setItem(GoogleAnalytics.CLIENT_ID_KEY, this.clientID);
    }

    const defaultParams = {
      // General: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#general
      v: 1, // protocol version. must be 1
      tid: this.trackingID,
      ds: 'app', // data source. mobile app SDKs use "app"

      // User: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#user
      cid: this.clientID,

      // System Info: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#system
      ul: Settings.language,

      // App Tracking: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#apptracking
      an: this.appName,
      aid: Device.appIdentifier,
      av: Device.appVersion,
    };

    this.commonParameters = { ...defaultParams, ...additionalParams };
  }

  static get CLIENT_ID_KEY() {
    return 'tvOS_GoogleAnalyticsClientID';
  }

  get debug() {
    return this.debugFlag;
  }

  set debug(flag) {
    this.debugFlag = flag;
  }

  get useValidator() {
    return this.validatorFlag;
  }

  set useValidator(flag) {
    this.validatorFlag = flag;
  }

  /**
   * Screenview is used to track when a user goes to a particular screen in your application.
   *
   * @param {string} screenName required
   */
  screenview(screenName) {
    const params = {
      t: 'screenview',
      cd: screenName,
    };

    this.postParams(params);
  }

  /**
   * Track an application defined event
   *
   * @param {string} category The event category. Required.
   * @param {string} action The event action. Required.
   * @param {string} label The event label. Optional.
   * @param {integer} value The event value. Optional.
   */
  event(category, action, label, value) {
    const params = {
      t: 'event',
      ec: category,
      ea: action,
    };

    if (label) {
      params.el = label;
    }

    if (value) {
      params.ev = value;
    }

    this.postParams(params);
  }

  /**
   * Process the post parameters into a post body, starting a new session if needed.
   *
   * @param {object} params An object of property/value arrays for GA parameters
   */
  postParams(params) {
    const sessionParams = {};
    if (!this.hasCreatedSession) {
      this.log('Starting new session');
      this.hasCreatedSession = true;
      sessionParams.sc = 'start';
    }

    const requestParams = { ...this.commonParameters, ...params, ...sessionParams };
    const payload = Object
      .entries(requestParams)
      .map(param => `${param[0]}=${encodeURIComponent(param[1])}`).join('&');

    this.post(payload);
  }

  /**
   * Post the payload to Google Analytics
   *
   * @param {string} payload The parameter body for the measurement request.
   */
  post(payload) {
    const request = new XMLHttpRequest();

    // Post is fire and forget, but log the response for developer info/discovery
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          this.log('ANALYTICS RESPONSE', request);
        } else {
          console.warn(`Google Analytics error response: ${request.status}`, request);
        }
      }
    };

    const url = this.useValidator
      ? 'https://www.google-analytics.com/debug/collect'
      : 'https://www.google-analytics.com/collect';

    this.log('ANALYTICS REQUEST PAYLOAD', payload);
    request.open('POST', url);
    request.send(payload);
  }

  /**
   * Centralized logging method.
   *
   * @param {*} message The message to send to the console log
   * @param {*} data Spread of additional values to log
   */
  log(message, ...data) {
    if (this.debug) {
      console.log(message, ...data);
    }
  }
}

