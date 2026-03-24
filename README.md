# 🏠 FloorPlan to 3D — Interactive Floor Plan Visualizer

Transform your 2D floor plans into stunning, interactive 3D visualizations. Built for architects, designers, and real estate professionals.

![Floor Plan to 3D](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.160-black)

## ✨ Features

### 🖼️ Smart Floor Plan Upload
- **Drag & drop** file upload with instant preview
- Supports **PNG, JPG, SVG, and PDF** formats (up to 10MB each)
- Multi-file upload with file management (add/remove)
- Real-time upload status and validation feedback

### 🏗️ Automatic 2D-to-3D Conversion
- **Edge detection** algorithm analyzes uploaded floor plan images
- Automatically detects **horizontal and vertical walls** from pixel data
- Groups detected walls into logical **room segments** (Living Room, Kitchen, Bedroom, etc.)
- Configurable scale (pixels-per-meter) for accurate dimensions

### 🎮 Interactive 3D Visualization
- **Real-time 3D rendering** powered by Three.js and React Three Fiber
- **Orbit controls** — rotate, zoom, and pan the 3D model freely
- Shadow mapping for realistic depth and lighting
- Responsive grid floor for spatial reference
- Smooth auto-scroll to the 3D viewer after model generation

### 🪑 Room-Specific Furniture & Details
- **Living Room** — Sofa, coffee table, TV stand, TV, side table
- **Bedroom** — Bed with frame, nightstands, dresser, wardrobe
- **Kitchen** — Counters, island, refrigerator, stove, upper cabinets, sink
- **Bathroom** — Bathtub/shower, toilet, vanity, mirror, sink
- Realistic material properties (roughness, metalness) per item

### 🎨 Professional UI/UX
- Hero section with animated feature highlights
- Architectural design system with custom color tokens (light & dark mode)
- Toast notifications for upload, processing, and error states
- Responsive layout for desktop and mobile
- Loading overlays and smooth transitions

### 🏠 Demo Mode
- Default 3D house model displayed before any upload
- Includes interior walls, roof, and sample furniture
- Gentle breathing animation for visual polish

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **3D Engine** | [Three.js 0.160](https://threejs.org/) |
| **3D React Bindings** | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **File Upload** | [react-dropzone](https://react-dropzone.js.org/) |
| **Routing** | [React Router 6](https://reactrouter.com/) |
| **State Management** | React Context API |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Animations** | Tailwind CSS Animate + CSS custom transitions |

## 🚀 Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── components/
│   ├── HeroSection.tsx          # Landing hero with CTAs
│   ├── FileUploadSection.tsx    # Drag & drop upload UI
│   ├── Viewer3D.tsx             # 3D canvas & controls
│   ├── Generated3DModel.tsx     # 3D room/furniture rendering
│   └── ui/                     # shadcn/ui components
├── contexts/
│   └── FloorPlanContext.tsx     # Floor plan state & image analysis
├── pages/
│   ├── Index.tsx                # Main page
│   └── NotFound.tsx             # 404 page
└── index.css                   # Design system tokens
```

## 🎯 How It Works

1. **Upload** — Drop a floor plan image onto the upload zone
2. **Analyze** — The app processes the image using canvas-based edge detection to find walls
3. **Generate** — Detected walls are grouped into rooms and converted to 3D geometry
4. **Explore** — Navigate the interactive 3D model with orbit controls

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
