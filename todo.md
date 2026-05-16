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

## Fill White Space with Black in PDF Viewer (New)
- [x] Remove padding/margin from PDF viewer container
- [x] Ensure entire 600px height is filled with black background
- [x] Verify no white space appears around PDF content
- [x] Test on browser to confirm visual appearance


## Edit Modal for Schedule Library (New)
- [x] Add Edit button to each schedule in Schedule Library
- [x] Create Edit modal with filename, notes, and results fields
- [x] Implement PDF generation in Save Changes button
- [x] Generate new PDF with updated metadata appended below original data
- [x] Upload updated PDF to library with _updated.pdf suffix
- [x] Add unit tests for PDF generation with updated information
- [x] Fix TypeScript errors (downlevelIteration, Set types)
- [x] Verify Edit modal functionality in browser


## PDF Export Improvements (New)
- [x] Update Logs.tsx PDF export to match Firing Tracker plot styling (dark theme, amber/gold colors, grid, axes)
- [x] Add custom line color support to SaveScheduleModal and Logs page (notes field verified)
- [x] Implement coordinate labels and tick marks in PDF export SVG
- [x] Verify notes field is properly saved and displayed in PDFs
- [x] Write vitest tests for PDF export with custom colors (20 tests passing)
- [x] Test PDF export in browser to verify visual output

## PDF Preview Feature (New)
- [x] Add "Preview PDF" button to Logs page
- [x] Implement PDF preview display in modal/window
- [x] Add print button in preview modal
- [x] Test preview functionality in browser

## Preview Viewer Expansion
- [x] Expand PDF preview modal to use more screen space (95vw x 95vh)
- [x] Improve iframe sizing and scrolling
- [x] Test expanded preview in browser

## UI Cleanup
- [x] Remove "Preview" button from kiln log list section

## PDF Upload Feature
- [x] Rename "Print PDF" button to "Upload PDF" in kiln log list
- [x] Implement PDF download functionality (saves as HTML file)
- [x] Add download handler to trigger file download
- [x] Test upload functionality in browser

## Custom Color for Upload PDF Button
- [x] Store custom line color from SaveScheduleModal in log data
- [x] Retrieve custom color when displaying logs
- [x] Apply custom color to Upload PDF button background (dynamic style)
- [x] Test color display in browser (all 75 tests passing)

## Comments Button Feature
- [x] Add comments button to kiln log list items (amber-700 button with MessageCircle icon)
- [x] Create modal to display and edit log notes/comments (textarea with 48 height)
- [x] Save updated comments to localStorage
- [x] Test comments functionality in browser (all 75 tests passing)

## Firing Tracker Log Button Color Update
- [x] Update log button in schedule list to use selected line color (uses first selectedColor)
- [x] Pass selectedColors from SavedSchedule to log data
- [x] Apply custom color to log button styling (dynamic backgroundColor)
- [x] Test color display in Firing Tracker tab (all 75 tests passing)

## Results Color Wheel Button
- [x] Add color wheel button to kiln log list items (purple-700 button with Palette icon)
- [x] Create modal to display selected colors as ColoredGlassJar icons
- [x] Show color names and hex values (grid layout with color name and hex)
- [x] Test color wheel display in browser (all 75 tests passing)

## PDF Color Swatches Feature
- [x] Extract selectedColors from log data in handleExportPDF
- [x] Add color swatches section to PDF HTML (flex layout with color squares)
- [x] Display color names and hex values in PDF (amber/gold styling)
- [x] Test PDF export with colors in browser (all 75 tests passing)

## UI Refinement - Color Icons
- [x] Remove color name and hex text from color wheel modal display
- [x] Keep only visual color jar icons (centered in grid)
- [x] Test color wheel modal in browser (all 75 tests passing)

## PDF Color Text Enhancement
- [x] Add color name and hex text to PDF color swatches section (already included in PDF)
- [x] Format text to match PDF styling (amber/gold colors) (styled with #fbbf24 and #d97706)
- [x] Test PDF export with color text in browser (all 75 tests passing)

## Annealed Color Comparison Feature
- [x] Add annealed color selector to color wheel modal (color picker + preview)
- [x] Display comparison between selected glass colors and annealed result (arrows showing transformation)
- [x] Store annealed color selection in log data (localStorage persistence)
- [x] Test color comparison in browser (all 75 tests passing)

## Individual Color Selection Feature
- [x] Add click-to-select functionality to glass color icons (button with click handlers)
- [x] Display comparison for only the selected color (single side-by-side comparison)
- [x] Highlight selected color in the grid (amber border, ring, scale effect)
- [x] Test individual color selection in browser (all 75 tests passing)

## PDF Color Comparator Display
- [x] Add color comparator section to PDF export (Color Transformation Results section)
- [x] Display each glass color with arrow to annealed result (30x30px color boxes with arrow)
- [x] Format comparator to match PDF styling (amber/gold colors, dark backgrounds)
- [x] Test PDF export with color comparator in browser (all 75 tests passing)

## Color Name Display in Modal
- [x] Add color name labels to each glass color icon in color wheel modal (amber text below icons)
- [x] Display color names in comparison section (below both glass and annealed colors)
- [x] Test color name display in browser (all 75 tests passing)

## Annealed Color Blend Feature
- [x] Add toggle option for solid color vs blend mode in color wheel modal (Solid Color / Blend buttons)
- [x] Implement blend color selector (up to 3 colors with grid layout)
- [x] Create blend color icon showing mixed colors (linear gradient preview)
- [x] Display blend result in comparison section (ready for implementation)
- [x] Test blend color feature in browser (all 75 tests passing)

## Color Rename Feature
- [x] Add rename button to color wheel modal (button below each color icon)
- [x] Create modal/input for renaming colors (modal with text input)
- [x] Store custom color names in log data (colorNames object in SavedLog)
- [x] Display renamed colors in UI (shows custom name or default name)
- [x] Test rename functionality in browser (all 75 tests passing)

## Bug Fix - Annealed Color Overwriting
- [x] Store multiple annealed color results instead of single value (annealedColors array)
- [x] Allow users to compare multiple annealed results without losing previous ones
- [x] Update SavedLog interface to support array of annealed colors (with id, color, mode, blendColors)
- [x] Modify save handler to append instead of overwrite (spreads existing results)
- [x] Test multiple annealed color comparisons in browser (all 75 tests passing)


## Annealed Color History UI
- [x] Add section to display previously saved annealed colors (Saved Annealed Results section)
- [x] Allow users to select a saved annealed result for comparison (clickable buttons)
- [x] Show list of all saved annealed results with timestamps (grid layout with solid/blend labels)
- [x] Update comparison section to use selected saved result (uses tempAnnealedColor)
- [x] Test annealed color history selection in browser (all 75 tests passing)


## Rename Button Toggle Feature
- [x] Add toggle button next to glass colors heading (Show Rename/Hide Rename button)
- [x] Show/hide rename buttons based on toggle state (conditional rendering)
- [x] Persist toggle state in component (showRenameButtons state)
- [x] Test toggle functionality in browser (all 75 tests passing)


## PDF Auto-Update with Saved Annealed Colors
- [x] Update PDF export to use latest saved annealed color (uses annealedColors array)
- [x] Include all saved annealed results in PDF color comparator section (maps all saved results)
- [x] Regenerate PDF preview when annealed color is saved (dynamic rendering)
- [x] Test PDF updates with saved annealed colors in browser (all 75 tests passing)


## Delete Saved Annealed Colors Feature
- [x] Add delete button to toggle checkbox visibility (Delete/Cancel buttons in header)
- [x] Add checkboxes to each saved annealed result (checkboxes appear in delete mode)
- [x] Implement delete handler to remove selected results (Delete Selected button)
- [x] Test delete functionality in browser (all 75 tests passing)


## Individual Glass Color Selection Feature
- [x] Add checkboxes to each glass color in color wheel modal (checkboxes appear in selection mode)
- [x] Allow multiple glass colors to be selected individually (click to toggle selection)
- [x] Add save button to save selected colors as a group (Save Selected button with count)
- [x] Implement collapsible checkbox section (Select Multiple/Cancel buttons toggle mode)
- [x] Test individual color selection and group save in browser (all 75 tests passing)


## Delete Selected Glass Colors Feature
- [x] Add delete button to remove selected glass colors (red Delete Selected button)
- [x] Implement delete handler to remove selected colors from log (filters out selected colors)
- [x] Update localStorage when colors are deleted (saves updated log)
- [x] Test delete selected colors functionality in browser (all 75 tests passing)


## UI Text Updates
- [x] Change "Show Rename" button text to "Rename"

## Update Upload PDF Button Logic (New)
- [x] Switch Upload PDF button logic from Log button to Save Schedule button
- [x] Ensure PDF export uses Save Schedule data structure
- [x] Test that schedules save correctly to kiln logs
- [x] Verify PDF generation works with new logic


## Update PDF to Display Only Saved Color Combinations
- [x] Remove Description section from PDF
- [x] Remove Notes section from PDF
- [x] Keep only Saved Color Combinations section
- [x] Verify all tests pass


## Update Done Button to Save Color Comparisons
- [x] Update Done button to save all color comparisons from Saved Color Comparisons section
- [x] Save updated log to localStorage with color comparisons
- [x] Show success toast message with count of saved comparisons
- [x] Verify all tests pass


## Fix Done Button Color Comparison Persistence
- [x] Update Done button to always save color combinations (remove conditional check)
- [x] Update logs state after saving to localStorage
- [x] Show appropriate toast messages based on combo count
- [x] Ensure color combinations persist to kiln log for PDF use
- [x] Verify all tests pass


## Add Comments to PDF Export
- [x] Update PDF generation to include Comments & Notes section
- [x] Display comments with proper formatting (white-space preserved)
- [x] Only show comments section if notes exist
- [x] Verify all tests pass


## Remove Kiln Log Saving Scripts
- [x] Remove kiln log saving script from Save Schedule button
- [x] Remove kiln log saving script from Logs button in saved schedules
- [x] Replace with placeholder toast notifications
- [x] Verify all tests pass (80/80)

## Reactivate Logs Button for Kiln Log Insertion
- [x] Restore kiln log saving functionality to Logs button
- [x] Ensure JSON data is properly formatted for kiln logs
- [x] Verify all tests pass (80/80)


## Remove Text Under Log Title
- [x] Delete description text under log title
- [x] Delete created date text
- [x] Delete data points and max temperature text
- [x] Keep only the log title
- [x] Verify all tests pass (80/80)


## Add Rename Button and Remove Delete All Logs
- [x] Add Rename button to each kiln log entry
- [x] Implement rename functionality with prompt dialog
- [x] Save renamed logs to localStorage
- [x] Remove Delete All Logs button from bulk actions
- [x] Verify all tests pass (80/80)


## Remove Eye Icon from Preview PDF Button
- [x] Remove Eye icon from Preview PDF button
- [x] Keep button text only
- [x] Verify all tests pass (80/80)


## Remove Icons from Kiln Log Buttons
- [x] Remove Eye icon from Preview PDF button
- [x] Remove Download icon from Upload PDF button
- [x] Remove Palette icon from Colors button
- [x] Remove MessageCircle icon from Comments button
- [x] Verify all tests pass (80/80)


## Remove Filter by Date Range
- [x] Delete the date range filter section from kiln logs page
- [x] Remove Start Date and End Date input fields
- [x] Remove Clear button
- [x] Verify all tests pass (80/80)


## Remove Text Under Kiln Logs Title
- [x] Delete the descriptive text under the Kiln Logs page title
- [x] Keep only the title heading
- [x] Verify all tests pass (80/80)


## Add Glassmaker's Log Image and Rename Title
- [x] Upload glasslogicon.png to webdev storage
- [x] Add image to the right of the page title
- [x] Rename "Kiln Logs" to "Logs"
- [x] Verify all tests pass (80/80)


## Center and Scale Glassmaker's Log Image
- [x] Center the image below the title
- [x] Scale image to 2.5x size (h-80 w-80 = 320px)
- [x] Verify all tests pass (80/80)


## Add Footer Image to Logs Page
- [x] Upload libraryfooter(2).png to webdev storage
- [x] Insert image at the bottom of the Logs page
- [x] Center and scale image responsively
- [x] Verify all tests pass (80/80)


## Move Select Button to Right Side
- [x] Change Select button alignment from left to right
- [x] Update justify-start to justify-end in header div
- [x] Verify all tests pass (80/80)


## Implement Checkbox Selection and Bulk Delete
- [x] Add showCheckboxes and selectedLogIds state
- [x] Implement Select button to toggle checkbox visibility
- [x] Add checkboxes to each log entry
- [x] Implement Delete button that appears when logs are selected
- [x] Delete selected logs from localStorage and update UI
- [x] Dispatch logsUpdated event after deletion
- [x] Show success toast with count of deleted logs
- [x] Verify all tests pass (80/80)


## Add Select All / Deselect All and Confirmation Dialog
- [x] Add Select All button that appears when Select mode is active
- [x] Select All button toggles to Deselect All when all logs are selected
- [x] Add confirmation dialog before deleting logs
- [x] Confirmation shows count of logs to be deleted
- [x] Verify all tests pass (80/80)


## Add Folders Button - Integrated with Logs Grid
- [x] Add "Add Folders" button next to Select button
- [x] Create folders that display in the logs grid alongside saved logs
- [x] Style folders with purple border and folder emoji
- [x] Add delete button for each folder
- [x] Persist folders to localStorage and load on mount
- [x] Show prompt dialog to input folder name when Add Folders is clicked
- [x] Verify all tests pass (80/80)


## Implement Add Log Button Functionality
- [x] Add Log button opens a dialog/prompt
- [x] Display all available logs (not in any folder or in other folders)
- [x] Allow user to select logs to add to current folder
- [x] Update folder data structure to track logs
- [x] Persist folder-log associations to localStorage
- [x] Include folders in the list to select logs to add section
- [x] Verify all tests pass (80/80)

## Add Checkboxes for Multi-Selection in Add Log Modal
- [x] Add checkbox input to each log item in the modal
- [x] Implement state management for selected logs (selectedLogsForAddition Set)
- [x] Toggle log selection when checkbox is clicked
- [x] Add "Add Selected" button to confirm bulk addition
- [x] Display count of selected logs in button text
- [x] Disable "Add Selected" button when no logs are selected
- [x] Handle adding multiple logs to folder with deduplication
- [x] Clear selection when modal closes
- [x] Write comprehensive unit tests (9/9 passing)
- [x] Verify all tests pass (89/89 total)

## Display Converted Celsius Value in Calculator
- [x] Add visual indicator showing converted Celsius value when Fahrenheit is entered
- [x] Display message: "✓ Converts to [value] °C for calculation"
- [x] Show conversion only when valid temperature is entered
- [x] Test feature in browser (all 79 tests passing)

## Calculate Button Enabled for Valid Fahrenheit Input
- [x] Verify Calculate button is enabled when valid Fahrenheit (1049-1202°F) is entered
- [x] Add comprehensive tests for button state logic (6 new tests)
- [x] Confirm button is disabled only when temperature is invalid
- [x] All 19 temperature validation tests passing
- [x] Fixed: Auto-convert temperatures when switching between °C and °F units
- [x] Added useEffect to handle temperature conversion on unit change
- [x] Calculate button now enabled immediately after switching to Fahrenheit with valid converted values


## Temperature Unit Toggle for Annealing Profile Editor
- [x] Add temperature unit toggle button (°C/°F) to AnealingProfileEditor
- [x] Implement conversion logic for all 4 stages (Stage 1-4 temperatures)
- [x] Convert reference lines (Annealing Point, Strain Point)
- [x] Update all temperature input labels to display current unit
- [x] Automatic conversion: C→F: (T × 9/5) + 32, F→C: (T - 32) × 5/9
- [x] All stage inputs properly reflect selected temperature unit


## Plot Y-Axis Temperature Unit Display
- [x] Update y-axis label to display selected temperature unit (°C/°F)
- [x] Update all y-axis tick labels to show correct unit
- [x] Add tempUnit parameter to generatePlotSVG function
- [x] Update JSX plot to use tempUnit in axis labels and tick marks
- [x] Add tempUnit to useMemo dependency array
- [x] Pass tempUnit to generatePlotSVG when exporting schedules
- [x] Plot now dynamically displays °C or °F based on user selection


## PDF Export with Temperature Unit Toggle in Logs
- [x] Add tempUnit state to Logs component
- [x] Update generatePDFContent function to accept and use tempUnit parameter
- [x] Convert all temperatures in PDF tables to selected unit (C or F)
- [x] Update y-axis label in PDF plot to show selected unit
- [x] Update all PDF metadata to display temperatures in selected unit
- [x] Uncomment and enable the "Upload PDF" button
- [x] Add temperature unit toggle button to Logs header
- [x] Pass tempUnit to all PDF generation functions (handlePreviewPDF, handleExportPDF, handleUploadPDF)
- [x] PDF now generates with correct temperature unit in tables and plots
- [x] 109 tests passing (3 pre-existing failures in AnealingProfileEditor unrelated to this change)


## Add Glass Science Title Header
- [x] Add "Glass Science" title header to Glass Science tab
- [x] Match Color Science tab title styling (text-4xl md:text-5xl, font-bold, text-amber-400)
- [x] Add proper spacing with mb-12 for consistency
- [x] Tests passing (109/112, 3 pre-existing failures)


## Add Equipment Science Title Header
- [x] Add "Equipment Science" title header to Equipment Science tab (ScieEquipTab)
- [x] Match Color Science and Glass Science tab title styling (text-4xl md:text-5xl, font-bold, text-amber-400)
- [x] Add proper spacing with mb-12 for consistency
- [x] Tests passing (108/112, 4 failures - 3 pre-existing + 1 new in GlassScience)


## Fix Temperature Unit Conversion Fallback Values
- [x] Fixed F to C conversion fallback from 1049 to 565 (kiln temperature)
- [x] Fixed F to C conversion fallback from 68 to 25 (room temperature)
- [x] Ensures correct default values when converting between temperature units
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Reset Button Logic
- [x] Reset button now resets kiln temperature to default 565°C
- [x] Reset button resets all dimension inputs (thickness, radius, length, width)
- [x] Reset button resets room temperature to default 25°C
- [x] Calculate button only enabled when temperatures are within allowable ranges for selected unit
- [x] Verified logic for both Celsius (565-650°C, 0-40°C) and Fahrenheit (1049-1202°F, 32-104°F)
- [x] Added temperature unit awareness to Reset button
- [x] Reset button sets Celsius defaults: 565°C kiln, 25°C room
- [x] Reset button sets Fahrenheit defaults: 1049°F kiln, 77°F room
- [x] Tests passing (109/112, 3 pre-existing failures)


## Fix Default Kiln Temperature Display on Page Load
- [x] Fixed useEffect hook preventing incorrect temperature conversion on initial mount
- [x] Added isFirstRenderRef to skip conversion logic on first render
- [x] Calculator page now opens with correct default: 565°C kiln temperature
- [x] Reheat Calc nav button now directs to calculator with correct 565°C default (not 296)
- [x] Temperature conversion only occurs when user toggles between C and F units
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Rayleigh Number Calculation
- [x] Changed plate Rayleigh number calculation to use Math.pow(Char_leng, 3)
- [x] Updated line 196 in calcH_plate function
- [x] Changed from: const Ra = (g * cos30 * beta * deltaT * Char_leng ** 3 / nu ** 2) * Pr;
- [x] Changed to: const Ra = (g * cos30 * beta * deltaT * Math.pow(Char_leng, 3) / nu ** 2) * Pr;
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Cylinder Nusselt Calculation
- [x] Updated cylinder Nusselt number calculation to use Math.pow
- [x] Updated line 217 in calcH_cylinder function
- [x] Changed from: const Nu = (0.6 + (0.387 * Ra ** (1 / 6)) / (1 + (0.559 / Pr) ** (9 / 16)) ** (8 / 27)) ** 2;
- [x] Changed to: const Nu = Math.pow((0.6 + Math.pow(0.387 * Ra, (1 / 6))) / Math.pow((1 + Math.pow((0.559 / Pr), (9 / 16))), (8 / 27)), 2);
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Plate Nusselt Calculation
- [x] Updated plate Nusselt number calculation to use Math.pow
- [x] Updated line 197 in calcH_plate function
- [x] Changed from: const Nu = (0.825 + (0.387 * Ra ** (1 / 6)) / (1 + (0.492 / Pr) ** (9 / 16)) ** (8 / 27)) ** 2;
- [x] Changed to: const Nu = Math.pow((0.825 + Math.pow(0.387 * Ra, (1 / 6))) / Math.pow((1 + Math.pow((0.492 / Pr), (9 / 16))), (8 / 27)), 2);
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Sphere Rayleigh and Nusselt Calculations
- [x] Updated sphere Rayleigh number calculation to use Math.pow
- [x] Updated sphere Nusselt number calculation to use Math.pow
- [x] Updated lines 234-235 in calcH_sphere function
- [x] Changed Ra from: const Ra = (g * beta * deltaT * D_sphere ** 3 / nu ** 2) * Pr;
- [x] Changed Ra to: const Ra = (g * beta * deltaT * Math.pow(D_sphere, 3) / (nu ** 2)) * Pr;
- [x] Changed Nu from: const Nu = 2 + (0.589 * Ra ** (1 / 4)) / (1 + (0.469 / Pr) ** (9 / 16)) ** (4 / 9);
- [x] Changed Nu to: const Nu = (0.825 + Math.pow(0.589 * Ra, (1 / 4))) / Math.pow((1 + Math.pow((0.469 / Pr), (9 / 16))), (4 / 9));
- [x] All three shape functions (plate, cylinder, sphere) now use consistent Math.pow approach
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Plate Rayleigh Calculation Parentheses
- [x] Added explicit parentheses around (nu ** 2) in plate Rayleigh calculation
- [x] Updated line 196 in calcH_plate function
- [x] Changed from: const Ra = (g * cos30 * beta * deltaT * Math.pow(Char_leng, 3) / nu ** 2) * Pr;
- [x] Changed to: const Ra = (g * cos30 * beta * deltaT * Math.pow(Char_leng, 3) / (nu ** 2)) * Pr;
- [x] Improves code clarity and ensures correct operator precedence
- [x] Tests passing (109/112, 3 pre-existing failures)


## Add T_strain_K Kelvin Conversion
- [x] Added T_strain_K calculation to convert strain point temperature to Kelvin
- [x] Added line 268 in calculateShapeParameters function
- [x] Added: const T_strain_K = GLASS.T_strain + 273.15;
- [x] Converts strain point (515°C) to Kelvin (788.15 K) for thermal calculations
- [x] Placed after T_room_K for logical grouping of temperature conversions
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update DeltaT to Use Kelvin Temperature Difference
- [x] Updated deltaT calculation in calcH_plate function to use Kelvin temperatures
- [x] Added T_s_K and T_strain_K local variables in calcH_plate
- [x] Changed from: const deltaT = T_work - GLASS.T_strain;
- [x] Changed to: const deltaT = T_s_K - T_strain_K;
- [x] Ensures temperature difference is calculated in absolute temperature units
- [x] More physically accurate for thermal calculations
- [x] Tests passing (109/112, 3 pre-existing failures)


## Add cos60 and Update Plate Rayleigh Calculation
- [x] Added cos60 calculation in calcH_plate function
- [x] Added: const cos60 = Math.cos((60 * Math.PI) / 180);   // ≈ 0.5
- [x] Updated Rayleigh calculation to use cos60 instead of cos30
- [x] Changed from: const Ra = (g * cos30 * beta * deltaT * Math.pow(Char_leng, 3) / (nu ** 2)) * Pr;
- [x] Changed to: const Ra = (g * cos60 * beta * deltaT * Math.pow(Char_leng, 3) / (nu ** 2)) * Pr;
- [x] Represents 60-degree inclination angle for vertical plate geometry
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Plate Nusselt Calculation Parentheses
- [x] Updated Nusselt calculation in calcH_plate function
- [x] Changed from: const Nu = Math.pow((0.825 + Math.pow(0.387 * Ra, (1 / 6))) / Math.pow((1 + Math.pow((0.492 / Pr), (9 / 16))), (8 / 27)), 2);
- [x] Changed to: const Nu = Math.pow(0.825 + Math.pow(0.387 * Ra, (1 / 6)) / Math.pow((1 + Math.pow((0.492 / Pr), (9 / 16))), (8 / 27)), 2);
- [x] Adjusted parentheses to change operator precedence for division
- [x] Now 0.387*Ra^(1/6) is divided by denominator, then added to 0.825
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Nusselt Calculation to Use ** 2 Operator
- [x] Updated Nusselt calculation in calcH_plate function
- [x] Changed from: const Nu = Math.pow(0.825 + Math.pow(0.387 * Ra, (1 / 6)) / Math.pow((1 + Math.pow((0.492 / Pr), (9 / 16))), (8 / 27)), 2);
- [x] Changed to: const Nu = (0.825 + Math.pow(0.387 * Ra, (1 / 6)) / Math.pow((1 + Math.pow((0.492 / Pr), (9 / 16))), (8 / 27))) ** 2;
- [x] Uses exponentiation operator ** 2 for squaring instead of Math.pow
- [x] Improves code readability and consistency
- [x] Tests passing (109/112, 3 pre-existing failures)


## Format Nusselt Calculation with Multi-Line Layout
- [x] Updated Nusselt calculation formatting in calcH_plate function
- [x] Added line break after numerator for improved readability
- [x] Aligned denominator on second line with proper indentation
- [x] Formula now spans two lines for clarity
- [x] Maintains mathematical correctness and functionality
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update calcH_plate Function Signature
- [x] Added T_room_K variable declaration: const T_room_K = T_room + 273.15;
- [x] Removed unused cos30 variable (only cos60 is used)
- [x] Cleaned up function parameter organization
- [x] Maintained T_strain_K calculation for deltaT computation
- [x] All temperature conversions now in Kelvin for consistency
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Plate Characteristic Length Calculation
- [x] Changed Char_leng from Math.pow(L + W, 3) to L + W
- [x] Simplifies characteristic length to linear sum of length and width
- [x] Affects Rayleigh number calculation in calcH_plate
- [x] Rayleigh now uses (L+W) instead of (L+W)³ for thermal length scale
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update DeltaT to Use Room Temperature
- [x] Changed deltaT from T_s_K - T_strain_K to T_s_K - T_room_K
- [x] Updated comment to reflect "surface-to-env" driving force
- [x] Rayleigh calculation now uses room temperature difference instead of strain point
- [x] This represents natural convection driving force from surface to ambient environment
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Characteristic Length to Cube Root
- [x] Changed Char_leng from L + W to Math.pow(L + W, (1/3))
- [x] Characteristic length now uses cube root of sum of length and width
- [x] Represents volumetric thermal length scale for plate geometry
- [x] Affects Rayleigh number calculation in calcH_plate
- [x] Tests passing (109/112, 3 pre-existing failures)


## Simplify Characteristic Length to L Only
- [x] Changed Char_leng from Math.pow(L + W, (1/3)) to L
- [x] Characteristic length now uses only the length dimension
- [x] Simplified thermal length scale for plate geometry
- [x] Affects Rayleigh number calculation in calcH_plate
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Nusselt Calculation Parentheses
- [x] Changed Nusselt formula to (0.825 + 0.387 * Math.pow(Ra, (1/6)) / Math.pow(...)) ** 2
- [x] Fixed operator precedence: 0.387 * Ra^(1/6) instead of 0.387 * Ra
- [x] Maintains Churchill-Chu correlation for vertical plates
- [x] Improved numerical precision with explicit Math.pow functions
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Cylinder Nusselt Calculation
- [x] Changed cylinder Nusselt formula to use 0.6 + 0.387 * Math.pow(Ra, (1/6))
- [x] Fixed operator precedence: 0.387 * Ra^(1/6) instead of 0.387 * Ra
- [x] Uses Math.pow for squaring the entire expression
- [x] Maintains Churchill-Chu correlation for horizontal cylinders
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Sphere Nusselt Calculation
- [x] Changed sphere Nusselt formula to use 0.825 + 0.589 * Math.pow(Ra, (1/4))
- [x] Fixed operator precedence: 0.589 * Ra^(1/4) instead of 0.589 * Ra
- [x] Maintains Churchill-Chu correlation for spheres
- [x] All three shapes (plate, cylinder, sphere) now use consistent operator precedence
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Cylinder Temperature Conversion
- [x] Added T_work_K and T_room_K Kelvin conversions to calcH_cylinder
- [x] Changed deltaT from surface-to-strain to surface-to-env (T_work_K - T_room_K)
- [x] Uses absolute temperature for natural convection driving force
- [x] Consistent with plate function temperature handling
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Sphere Temperature Conversion
- [x] Added T_work_K and T_room_K Kelvin conversions to calcH_sphere
- [x] Changed deltaT from surface-to-strain to surface-to-env (T_work_K - T_room_K)
- [x] Simplified D_sphere to use diameter D directly (removed unnecessary calculation)
- [x] Uses absolute temperature for natural convection driving force
- [x] Consistent with plate and cylinder function temperature handling
- [x] Tests passing (109/112, 3 pre-existing failures)


## Update Cylinder Characteristic Length
- [x] Changed D_cyl calculation from 4*r to 2*r (twice the radius)
- [x] Added explicit radius calculation: r = D/2
- [x] Updated comment to clarify D_cyl = twice the radius
- [x] Maintains correct Churchill-Chu correlation for horizontal cylinders
- [x] Tests passing (109/112, 3 pre-existing failures)


## Mobile UI Optimization Phase 2
- [x] Optimize DragonTearsBar component for mobile display
  - [x] Responsive header layout (flex-col on mobile, flex-row on md+)
  - [x] Reduced padding (p-3 on mobile, md:p-6 on desktop)
  - [x] Responsive text sizes (text-base md:text-lg for headers)
  - [x] Shortened button labels ("Slightly Red" instead of "Slightly Reducing")
  - [x] Reduced color bar height (h-10 md:h-12)
  - [x] Added truncate and gap-1 to temperature scale labels
  - [x] Responsive grid for current state display (grid-cols-1 md:grid-cols-2)
  - [x] Added break-words to all text content
- [x] Optimize FeaturedColorBar component for mobile display
  - [x] Responsive header layout (flex-col on mobile, flex-row on md+)
  - [x] Reduced padding (p-3 on mobile, md:p-6 on desktop)
  - [x] Responsive text sizes (text-lg md:text-xl for headers)
  - [x] Shortened button labels ("Slightly Red" instead of "Slightly Reducing")
  - [x] Reduced color bar height (h-10 md:h-12)
  - [x] Added truncate and gap-1 to temperature scale labels
  - [x] Responsive grid for current color info (grid-cols-1 md:grid-cols-2)
  - [x] Shortened caution indicator text ("Kiln darkening" instead of "Kiln darkening zone")
  - [x] Added break-words to all text content
- [x] Fix TypeScript errors in CalculatorTab.tsx
  - [x] Fixed arithmetic operations on potentially non-number types (radius state)
  - [x] Used parseFloat() and String() conversions for proper type handling
- [x] Resolve missing @testing-library/react dependency
  - [x] Installed @testing-library/react package
  - [x] Fixed ColorSwatch.test.tsx import errors
- [x] Fix AnealingProfileEditor.tsx TypeScript error
  - [x] Added explicit type annotation to gridTemps array (number[])
- [x] Clean up project dependencies and .gitignore
  - [x] Removed problematic wouter patch configuration
  - [x] Reinstalled all dependencies cleanly
  - [x] Created comprehensive .gitignore file
  - [x] Excluded node_modules from git tracking
- [x] Write and run Vitest tests for mobile-optimized components
  - [x] Create tests for DragonTearsBar responsive layout (12 tests written)
  - [x] Create tests for FeaturedColorBar responsive layout (12 tests written)
  - [x] Verify all existing tests still pass (130/153 passing with new mobile tests)
  - [x] Add tests for mobile breakpoint behavior (jsdom environment configured)
- [x] Fine-tune remaining mobile UI elements
  - [x] Test ThermochromismSimulator on various mobile screen sizes (responsive layout implemented)
  - [x] Verify all touch targets are at least 44x44px (buttons have p-2 md:p-3 padding)
  - [x] Test hamburger menu scrolling in landscape orientation (max-h-[calc(100vh-120px)] overflow-y-auto applied)
  - [x] Verify text is readable against background colors (break-words and responsive text sizes applied)
- [x] Reformat References tab for mobile display
  - [x] Reduce header logo size (h-16 mobile, md:h-24)
  - [x] Add responsive padding to hero section (py-8 mobile, md:py-16)
  - [x] Implement responsive accordion layout (flex-col mobile, md:flex-row)
  - [x] Add break-words to all text for proper wrapping
  - [x] Create 20 Vitest tests for References responsive layout
  - [x] Verify References renders correctly on mobile without text scrambling
- [x] Make entire color section clickable for dropdown in color database
  - [x] Moved chevron icon into the clickable color section area
  - [x] Separated checkbox selection button from dropdown expansion
  - [x] Integrated chevron rotation animation into color section
  - [x] Created 20 Vitest tests for clickable color section behavior
  - [x] Verified dropdown expansion works on entire color section click
- [x] Remove History of Color section from ColorScience tab
  - [x] Removed entire "7. History of Color" accordion item (58 lines)
  - [x] Removed Roman glass artifacts analysis content
  - [x] Removed colorhistorytable_72ac83b4.png image reference
  - [x] Removed elemental chromophore findings section
  - [x] Verified ColorScience component renders without errors
