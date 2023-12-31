# Remarkably Organized Planner

A web app for generating customizable planners designed for e-ink tablets like the Remarkable 2.

![Remarkably Organized Planner](./static/remarkably-organized-cover-photo.jpg)

Use the "settings" modal to change the planner's content & design. The preview of the pdf should be generated live.

The current settings are saved in the URL so a particular planner can be shared easily. Just copy the URL and share with others!

## Exporting to PDF

To get the PDF of the generated planner, use the built in print-to-pdf functionality of Chrome. Make sure "Background Graphics" is enabled.

If the selected settings makes a very large PDF, you might have to use a powerful computer to generate the PDF. It can require a decent amount of memory in Chrome for large PDFs.

![Remarkably Organized Print Instructions](./static/remarkably-organized-print-instructions.jpg)

## Development

The web app is built using the Svelte framework.
Knowledge of web technologies is required to run this app.
If you don't know what npm is, you probably won't understand the code.

Install npm, and run the following:
```bash
npm i
npm run dev
```
NOTE - You might have to use `npm i --force` because of the conflicting peer dependencies (this is using a bleeding edge version of Svelte as of Jan 2024).

This will open up locahost:5173 where the actions can be viewed and tested.

It uses Svelte & Vite under the hood for automatic HMR.

To build the code run,

```bash
npm run build
```