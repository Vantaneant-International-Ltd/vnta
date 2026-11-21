// The app is drawn in the browser: it shows a signed-in person's data, which a
// static page cannot know. The empty shell is still prerendered so every app URL
// loads with a normal 200 response.
export const prerender = true;
export const ssr = false;
