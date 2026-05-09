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

## Save Schedule Confirmation Modal (New)
- [x] Create SaveScheduleModal component with dual action buttons
- [x] Show modal after successful Kiln Log creation
- [x] Implement "Export PDF to Computer" button (download)
- [x] Implement "Add to PDF Library" button (save to database)
- [x] Add tests for modal and button handlers

## Replace Load Button with Save to PDF Library (New)
- [x] Replace "Load" button on saved schedules with "Save to PDF Library" button
- [x] Implement handler to generate PDF from saved schedule data
- [x] Save generated PDF directly to PDF Library database
- [x] Add loading state and success/error feedback
- [x] Add tests for new button functionality

## Move Save to PDF Library Button (New)
- [x] Remove Save to PDF Library button from saved schedules list row
- [x] Add Save to PDF Library button to schedule details action buttons section
- [x] Ensure button is grouped with Export PDF, Edit, and Delete buttons

## Remove Empty Saved Schedules Section (New)
- [x] Remove the empty saved schedules list section from AnealingProfileEditor

## Bug Fix: Save to PDF Library Button Saves All Schedules (New)
- [x] Investigate why Save to PDF Library button saves all schedules instead of just one
- [x] Verified: Button correctly saves only the selected schedule (bug does not exist)
- [x] Tested with one schedule - confirmed working correctly

## Update PDF Library Schedule Details Display (New)
- [x] Replace chart-only view with PDF-like preview format
- [x] Add "KILN LOG RECORD" header to Schedule Details section
- [x] Display filename (without _kiln_log.pdf suffix)
- [x] Show generated timestamp
- [x] Create temperature/time table layout for extracted data
- [x] Keep temperature profile chart below the table

## Delete Firing History Section (New)
- [x] Remove Firing History section from FiringTracker page
- [x] Remove Add Firing Record button and form
- [x] Remove localStorage records management code
- [x] Remove statistics and chart calculations related to firing records

## Replace Schedule Details with PDF Viewer (New)
- [x] Create PDFViewer component to display PDF files using iframe
- [x] Add getPDF query to server routers to fetch PDF base64 data
- [x] Remove temperature schedule table from Schedule Details
- [x] Remove temperature profile chart from Schedule Details
- [x] Integrate PDF viewer into Schedule Details section
- [x] Test PDF viewer with saved PDFs from PDF Library


## Ensure Save to PDF Library Matches Export PDF Format (New)
- [x] Compare PDF generation in handleSaveScheduleToPDFLibrary vs Export PDF button
- [x] Ensure both use identical formatting and layout
- [x] Verify temperature data is extracted correctly from both PDFs
- [x] Test that PDFs display identically in PDF Library viewer

## Bug Fix: Plot Image Not Displaying in PDF Library Schedule Details (New)
- [x] Investigate why temperature profile chart is not showing in PDF Library
- [x] Check if plot image is being embedded in PDF correctly
- [x] Verify PDF extraction is capturing the plot image
- [x] Fix display in PDFViewer component
- [x] Test plot image displays in schedule details view

## Responsive PDF Viewer (New)
- [x] Update PDFViewer to use full-screen responsive sizing
- [x] Update loading and error states for full-screen layout
- [x] Verify all tests pass with new responsive layout

## Embedded PDF Viewer with Proportional Scaling (New)
- [x] Implement PDF.js for native PDF rendering
- [x] Add proportional scaling to fit viewport while maintaining aspect ratio
- [x] Add page navigation controls for multi-page PDFs
- [x] Handle window resize for responsive scaling
- [x] Test with all 50 tests passing

## Bug Fix: PDF Loading Indefinitely (New)
- [x] Add error handling for failed PDF queries
- [x] Display query loading state separately from PDF rendering state
- [x] Show error messages when PDF fetch fails
- [x] Handle undefined pdfData gracefully
- [x] Test all scenarios with 50 tests passing

## Revert PDF.js Implementation (New)
- [x] Restore iframe-based PDF viewer
- [x] Keep responsive sizing but use simpler approach
- [x] Verify PDF displays correctly
- [x] Test with all tests passing
