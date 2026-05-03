# Preview inspection notes

The completed research webpage rendered in the browser at the project preview URL. The hero section uses the generated dark borosilicate kiln image with high-contrast light typography, a top navigation, research-answer label, and visible call-to-action buttons. Browser-extracted content confirmed the main report sections are present: research synthesis, app landscape, selected-tool detail, interactive schedule explorer, color/metals guidance, product opportunity, and sources.

One issue was observed in the extracted text: literal Markdown bold markers appeared in JSX copy. This was corrected by replacing those markers with semantic `<strong>` elements in `Home.tsx`.
