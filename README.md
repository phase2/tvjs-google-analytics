# ES6 Google Analytics for Apple's tvOS TVMLKit JS Runtime
This library provides [Google Analytics](https://www.google.com/analytics/) support for Apple's
[tvOS TVMLKit JavaScript runtime](https://developer.apple.com/documentation/tvmljs).
It uses the Google Analytics
[Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/)
to provide a mobile SDK like API to track analytics events and screenviews within the tvOS Client/Server application.


# Example

First, initialize the library.

```javascript
let ga = new GoogleAnalytics("YOUR_TRACKING_ID", "YOUR_APP_NAME");
```

Then, in your TVML documents `onload` handler:

```xml
<document onload="ga.screenview('YOUR_SCREEN_NAME');">
    ...
</document>
```

And, in your event handlers:

```javascript
function mySelectHandler(event) {
    ga.event("YOUR_CATEGORY", "YOUR_ACTION"); 
}
```

# Contributions
Contributions to support testing and additional event types are welcome.
