import '@testing-library/jest-dom'

if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = jest.fn();
  window.URL.revokeObjectURL = jest.fn();
}
