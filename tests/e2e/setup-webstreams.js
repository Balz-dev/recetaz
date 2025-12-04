// tests/e2e/setup-webstreams.js
// Use the package main entry which exports the ponyfill implementation.
// The package's `exports` maps `.` to the ponyfill build, so requiring the
// package root is the most compatible approach.
const poly = require('web-streams-polyfill');

// Asegurar globals si no existen
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = poly.TransformStream;
  global.ReadableStream = poly.ReadableStream;
  global.WritableStream = poly.WritableStream;
}