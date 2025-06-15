# Vasilis Papageorgiou - Academic Website

A modern, responsive academic personal website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern Design**: Clean, professional layout optimized for academic presentation
- 📱 **Fully Responsive**: Works perfectly on all devices and screen sizes
- 🚀 **SEO Optimized**: Structured data, meta tags, and sitemap for better search visibility
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed
- 🎯 **Academic Focus**: Designed specifically for PhD students and researchers
- 📝 **Easy to Customize**: Simple to update with your own content

## Sections

- **About**: Personal bio and current position
- **Publications**: List of research papers with abstracts and links
- **News**: Recent updates and achievements
- **Contact**: Social media and academic profile links
- **CV**: Downloadable curriculum vitae

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vibe-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Update Personal Information

1. **Profile Information**: Edit the personal details in `src/app/page.tsx`
2. **Publications**: Update the `publications` array with your research papers
3. **News**: Modify the `news` array with your recent updates
4. **Social Links**: Update the `socialLinks` array with your profiles
5. **CV**: Replace `public/cv.txt` with your actual CV file (PDF recommended)

### Add Your Photo

Replace the placeholder in the profile section with your actual photo:

1. Add your photo to the `public/` directory
2. Update the image section in `src/app/page.tsx`

### SEO Optimization

Update the following files with your information:
- `src/app/layout.tsx` - Meta tags and site metadata
- `src/lib/schema.ts` - Structured data for search engines
- `src/app/sitemap.ts` - Site URL for sitemap

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `out` folder to Netlify

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js.

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Schema.org](https://schema.org/) - Structured data

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Vasilis Papageorgiou - [vpapageorgio@wisc.edu](mailto:vpapageorgio@wisc.edu)

Project Link: [https://github.com/yourusername/academic-website](https://github.com/yourusername/academic-website)
