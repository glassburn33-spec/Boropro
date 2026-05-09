# Project TODO

## PDF Library Features
- [x] Full-stack upgrade with backend storage
- [x] PDF upload with drag-and-drop support
- [x] Automatic temperature/time extraction from PDFs
- [x] Fix PDF upload serialization (base64 encoding)
- [x] Add CSV export functionality for extracted data
- [x] Add PDF preview modal with extracted data visualization
- [x] Implement bulk schedule comparison feature

## Testing
- [x] Backend API tests (7 tests passing)
- [x] Frontend integration tests for CSV export

## Kiln Log (New Feature)
- [x] Create Kiln Log database schema
- [x] Build Kiln Log entry form UI
- [x] Implement Kiln Log history view with filtering
- [x] Add CSV export for kiln logs
- [x] Write tests for Kiln Log API and UI

## Kiln Log to PDF Library Integration (New)
- [x] Add "Save to PDF Library" button to Kiln Log detail view
- [x] Implement PDF generation from Kiln Log data (temperature profile + metadata)
- [x] Create backend endpoint to save generated PDF to S3 and PDF Library
- [x] Add tests for PDF generation and library save functionality
