import GoogleAnalytics from '../google-analytics';

// cleaning up the mess left behind by any tests
afterEach(() => {
  localStorage.clear();
});

const trackingID = 'TRACKING ID';
const appName = 'Google Anlaytics App Test';

test('Test defaultParams', () => {
  const ga = new GoogleAnalytics(trackingID, appName);
  expect(ga.commonParameters).toHaveProperty('v', 1);
  expect(ga.commonParameters).toHaveProperty('tid', trackingID);
  expect(ga.commonParameters).toHaveProperty('ds', 'app');
  expect(ga.commonParameters).toHaveProperty('cid');
  expect(ga.commonParameters).toHaveProperty('ul', Settings.language);
  expect(ga.commonParameters).toHaveProperty('an', appName);
  expect(ga.commonParameters).toHaveProperty('aid', Device.appIdentifier);
  expect(ga.commonParameters).toHaveProperty('av', Device.appVersion);
});

test('Test additionalParams', () => {
  const sr = '3840×2160';
  const additionalParams = {
    sr,
  };
  const ga = new GoogleAnalytics(trackingID, appName, additionalParams);

  expect(ga.commonParameters).toHaveProperty('v', 1);
  expect(ga.commonParameters).toHaveProperty('sr', sr);
});

test('Test additionalParams override defaultParams', () => {
  const sr = '3840×2160';
  const av = 'SOME-OTHER-APP-VERSION';
  const additionalParams = {
    sr,
    av,
  };
  const ga = new GoogleAnalytics(trackingID, appName, additionalParams);

  expect(ga.commonParameters).toHaveProperty('v', 1);
  expect(ga.commonParameters).toHaveProperty('sr', sr);
  expect(ga.commonParameters).toHaveProperty('av', av);
});

test('Test payload', () => {
  const ga = new GoogleAnalytics(trackingID, appName);

  ga.post = (payload) => {
    expect(payload).toMatch(/v=1/);
    expect(payload).toMatch(/tid=TRACKING%20ID/);
    expect(payload).toMatch(/sc=start/);
    expect(payload).toMatch(/t=screenview/);
    expect(payload).toMatch(/cd=jest-screen/);
  };

  ga.screenview('jest-screen');
});
