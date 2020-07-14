// import CookieManager from 'react-native-cookies';

// const useWebKit = true;

// // list cookies (IOS ONLY)
// CookieManager.getAll(useWebKit)
//   .then((res) => {
//     console.log('CookieManager.getAll from webkit-view =>', res);
//   });

// // clear cookies
// CookieManager.clearAll(useWebKit)
//   .then((res) => {
//     console.log('CookieManager.clearAll from webkit-view =>', res);
//   });

// // Get cookies as a request header string
// CookieManager.get('http://example.com', useWebKit)
//   .then((res) => {
//     console.log('CookieManager.get from webkit-view =>', res);
//     // => 'user_session=abcdefg; path=/;'
//   });

// set a cookie (IOS ONLY)

// CookieManager.clearAll().then(function (res) {
//   console.log('CookieManager.clearAll =>', res);
// })
// const newCookie = {
//   name: 'myCookie',
//   value: 'myValue',
//   domain: 'some domain',
//   origin: 'some origin',
//   path: '/',
//   version: '0',
//   expiration: new Date(),
// };

// CookieManager.set(newCookie, useWebKit)
//   .then((res) => {
//     console.log('CookieManager.set from webkit-view =>', res);
//   });