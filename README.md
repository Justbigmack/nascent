# Cryptocurrency Trading Interface

This application allows traders to view orderbook data for Bitcoin (BTC) and Ethereum (ETH) and place limit and market orders.

### Libraries and tools I chose

This application could use SSR, but given the fact that the given template was a CRA template, I thought I will use CSR in this particular case. However, I thought about the possibility to use SSR and frameworks like Next.js or Tanstack start for SSR, so the choices below should make it easier to switch to SSR, if it were necessary.

- **Vite** - I had some issues with installing the packages I wanted given the CRA limitations. It had a lock on certain tailwind versions. When I started using shadcn, because of some version locks the styles were not taking in correctly, errors appeared and other libraries threw unexpected errors. Because of that, I decided to move to vite for better DX and performance.
- **React 19** - Latest React version with improved performance.
- **TypeScript** - Type safety and better developer experience.
- **Tailwind CSS** - My favorite CSS framework I would use in every project for simplicity and faster development.
- **shadcn** - An extremely popular ui component library that is accessible, customizable and popular these days.
- **TanStack Router** - Type-safe, file-based routing with automatic code splitting. Supports SSR for possible future transition to SSR. Popular option these days and offers great DX.
- **TanStack Query (React Query)** - Another library from tanstack that is also extremely popular. Offers great DX when working with it as well as many features such as caching, and automatic refetching.
- **React Hook Form** - Performant form state management with minimal re-renders.
- **Zod** - Runtime type validation and schema definition.
- **react-i18n** - Quite popular internationalization library and also a tool of my choice.
- **Vitest** and **@testing-library/react** - Performant and quite popular testing libraries to enable faster test writing.

Some of tools above may seem like an overkill for this project, but I also think that I need to think about how to scale this app, so I went for the tools I would make use of to build up more and more features. I also thought about AI driven development when working on the project and tools from the list above have become quite popular on the web, so there is a lot of training data on those, which allows AI tools to more effectively troubleshoot issues.

## How I approached this task

The assignment didn't allow for a lot of time, so I thought on how I could save some time. I first checked the requirements and specifically the coinbase article to understand how the component is supposed to work. After I had an idea on how it works, I figured out the tech stack I would use. I didn't have much time to design a solution by hand, so I reached out to Figma AI to generate an interface for me using the ui libraries I went for. I wanted to supply you with a Figma file, but turns out that Figma does not actually do that in their AI mode, so I took a couple screenshots and placed them in the UX folder. I didn't exactly follow this design, but wanted to have something as a point of reference. After that I started developing the application, ran into a few issues with CRA, switched to vite because of that. After I switched, I had to change the syntax in the server folder a little bit, but no functionality has been changed in there: it was just to replace commonJS syntax like require, etc. After finishing the requirements I added some tests and checked what is necessary to deploy to Vercel. Vercel wouldn't be able to start the server folder, so in order to deploy it and make use of serverless functions, api folder has been created. It has no effect on the application itself, but is necessary for the app to work on Vercel.

I wanted to point out that the given time frame of 3 hours was not enough for me to have a fully polished solution. When looking at the code and UI there are a few things that could be improved.

### Future Improvements

- Increased test coverage
- E2E tests using cypress or playwright
- A11y testing using axe-core
- Ui adjustments for overlapping display values, tall containers, etc
- Value calulation and formatting logic - I was not sure how to round up certain values, so a lot more thought has to be put into it as crypto can be traded at very small units
- Proper data retrieval from backend or certain public API's - currently homepage data is hardcoded, because there is no BE endpoint to use
- Real data updates
- Better error handling
- Performance optimizations
- Many more

## Features

All the features from the assignment are supported, including bonus ones.

## Accessibility

Semantic elements have been used instead of divs, which should take care of most of the things. The UI libraries of choice are accessible out of the box. Since it is a power tool for traders, I think that keyboard navigation is important to think about and it is supported in this application. All the actions can be carried out via keyboard and mouse. Color contrast ratios meet the standards.

## Testing

Run tests:

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/Justbigmack/nascent.git
cd nascent-frontend-test-vite
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

This command runs both the Vite dev server (port 5173) and the mock API server (port 3001) concurrently.

4. Open your browser

```
http://localhost:5173
```
