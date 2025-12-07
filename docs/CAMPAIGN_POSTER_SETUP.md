# Campaign Poster Setup Guide

## Contentful Content Type Setup

Create a new content type in Contentful called `campaignPoster` with the following fields:

### Fields:

1. **image** (Media - Asset)
   - Type: Media
   - Required: Yes
   - Help text: "Poster image to display"

2. **link** (Short text)
   - Type: Short text
   - Required: No
   - Help text: "Optional URL to link to. If both link and linkText are provided, a button will appear at the bottom of the poster. If only link is provided, the entire image will be clickable."

3. **linkText** (Short text)
   - Type: Short text
   - Required: No
   - Help text: "Button text to display when link is provided. If both link and linkText are present, a button will appear at the bottom of the poster with this text."

4. **active** (Boolean)
   - Type: Boolean
   - Required: Yes
   - Default: false
   - Help text: "Whether this poster is currently active"

5. **order** (Number - Integer)
   - Type: Number (Integer)
   - Required: No
   - Help text: "Display order (lower numbers = higher priority). If multiple active posters exist, the one with the lowest order will be shown."

## Usage

1. Create a new `campaignPoster` entry in Contentful
2. Upload the poster image
3. Set `active` to `true` to enable the poster
4. Optionally add a `link` URL if the poster should be clickable
5. Optionally add `linkText` to display a button at the bottom of the poster (requires `link` to be set)
6. Set `order` if you have multiple posters (lower = higher priority)

### Link Behavior

- **Both `link` and `linkText` provided**: A button with the `linkText` will appear at the bottom of the poster image. The image itself is not clickable.
- **Only `link` provided (no `linkText`)**: The entire poster image becomes clickable and links to the URL.
- **Neither provided**: The poster is displayed as a static image with no clickable elements.

## Behavior

- The poster displays only on the first visit in a session (uses `sessionStorage`)
- Users can close the poster with the X button
- Once closed, the poster won't show again in the same browser session
- Only one active poster will be displayed (the one with the lowest `order` value, or most recently created if no order is set)

## Testing

To test the campaign poster:
1. Create an active poster in Contentful
2. Open the site in a new incognito/private window
3. The poster should appear after a 500ms delay
4. Close the poster and refresh - it should not appear again (session-based)
5. Open a new incognito window - the poster should appear again

