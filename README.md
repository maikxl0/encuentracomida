# Cat Finder

A simple React + Vite web app that fetches adorable cat images by breed using [The Cat API](https://thecatapi.com/). Built for a front-end class project.

## Features

- 🐱 Search cat images by breed name
- 🎲 Fetch random cat images  
- ⏳ Loading spinner while fetching data

## Tech Stack

- **React** - UI library
- **Vite** - Build tool & dev server
- **The Cat API** - Cat image data source

## Requirements

- Node.js 18+ (recommended)
- npm
- A free API key from [The Cat API](https://thecatapi.com/)

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory and add your API key:

```env
VITE_CAT_API_KEY=your_thecatapi_key_here
```

**Note:** If `npm run dev` is already running, restart it after adding the `.env` file.

## Getting Started

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`) in your browser.

## Usage

- **Search by breed:** Type a breed name (e.g., `siamese`, `bengal`, `maine coon`) and click **Search** or press **Enter**
- **Random cat:** Click **Random** to fetch any random cat image

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## License

This project is open source. Feel free to use it for learning purposes.