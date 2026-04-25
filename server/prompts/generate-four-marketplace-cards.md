You are generating a single composite image for a marketplace product listing.

The user uploaded an existing product card or product image. Analyze the uploaded image carefully:
- identify the product
- preserve the same product identity
- preserve the key visual style if it is good
- preserve the main colors and materials
- preserve the product shape, proportions, branding elements, packaging, and important visual details
- do not invent a different product
- do not change the product category

Now create ONE vertical composite image for a final 3:4 marketplace layout. The backend will upscale and normalize the generated image to exactly 2400x3200 pixels before slicing.

The final normalized composite must behave as a precise 2x2 pixel grid:
- Card 1 top-left: x=0, y=0, width=600, height=800
- Card 2 top-right: x=600, y=0, width=600, height=800
- Card 3 bottom-left: x=0, y=800, width=600, height=800
- Card 4 bottom-right: x=600, y=800, width=600, height=800

After backend upscale, the exact pixel crop zones become:
- Card 1 top-left: x=0, y=0, width=1200, height=1600
- Card 2 top-right: x=1200, y=0, width=1200, height=1600
- Card 3 bottom-left: x=0, y=1600, width=1200, height=1600
- Card 4 bottom-right: x=1200, y=1600, width=1200, height=1600

Every internal card must be a portrait marketplace card with a 3:4 composition.

Important slicing safety:
- The backend will resize the complete generated image to 2400x3200 without cropping before slicing.
- Do not rely on any content outside the visible canvas; nothing should be designed to be cropped away.
- Keep titles, product, icons, labels, and important content at least 24px inside each quadrant edge.

The composite image must contain exactly 4 separate marketplace listing cards arranged in a perfect 2x2 grid.

Critical layout requirements:
- no outer white margins
- no external border around the whole image
- no white lines, white strokes, white outlines, white gutters, separator lines, frame strokes, card borders, printable crop marks, artboard edges, or contour lines anywhere on the outer edges of any quadrant
- no empty canvas around the 2x2 grid
- the full image must be filled edge-to-edge by the 4 cards
- each card must occupy exactly one quarter of the image
- each card must be vertical portrait format
- each internal card must have a 3:4 card composition
- all important content must stay inside its own quadrant
- no text, product, icon, object, shadow, or background should cross from one card into another
- make the image easy to split into 4 equal parts by pixel coordinates
- the four quadrants must touch each other directly with continuous backgrounds up to the pixel edge
- do not draw visible dividers between the 4 cards; do not use white or light separator lines
- do not put a border around any individual card; every quadrant must bleed its own background fully to all four edges

Each of the 4 cards should be a different internal marketplace card, not a duplicate.

Card 1: Benefits card
Create a premium internal marketplace card that explains the main benefits of the product. Use the uploaded product as the main hero object. Add 3-5 short benefit points with simple icons. Make it clean, readable, commercial, and conversion-focused.

Card 2: Features / specifications card
Create a card that explains the key product specifications, materials, size, usage details, or technical features. Use neat infographic blocks, icons, labels, and close-up details if useful.

Card 3: Lifestyle / usage scenarios card
Create a card that shows the product in realistic usage scenarios. The background and composition should help the buyer understand where and how the product is used. Keep it premium and marketplace-friendly.

Card 4: Details / close-up / quality card
Create a card focused on product details, close-ups, texture, materials, packaging, construction, or quality. Add small callouts with arrows or labels. Make it feel trustworthy and detailed.

Text requirements:
- Use the same language as the original uploaded card
- If the language is Russian, use clean short Russian text
- Keep text minimal and readable
- Avoid long sentences
- Do not create fake certifications or unsupported claims
- Avoid tiny unreadable text
- Avoid random broken words
- Prefer short phrases, labels, and benefit blocks

Design requirements:
- marketplace-ready
- clean commercial composition
- premium but not overdesigned
- clear hierarchy
- high contrast
- product must remain the main focus
- avoid clutter
- avoid excessive decorations
- avoid distorted product shapes
- avoid unrealistic proportions
- avoid fake logos unless they exist in the uploaded image
- avoid changing package text unless needed for readability
- absolutely avoid white frames, white borders, thin light outlines, page margins, poster borders, or UI-like card contours at the edges

Final output:
A single vertical image containing 4 separate internal marketplace cards in a perfect 2x2 grid, edge-to-edge, with no visible border or separator lines, ready to be upscaled to 2400x3200 and sliced into 4 equal 1200x1600 images.
