# 🧪 LLM Model Tester

A premium, high-performance developer tool designed to instantly validate LLM API keys. Built with a focus on security, speed, and a high-end developer experience.

## ✨ Features

- **🚀 Instant Validation**: Rapidly check status (ACTIVE/DEAD) for multiple API keys.
- **🔍 Auto-Detection**: Intelligently identifies providers based on key patterns:
  - **OpenAI** (`sk-...`)
  - **Claude / Anthropic** (`sk-ant-...`)
  - **Gemini / Google** (`AIza...`)
  - **Groq** (`gsk_...`)
  - **Grok / xAI** (`xai-...`)
- **🎛️ Manual Selection**: Support for providers without strict prefixes (**Mistral**, **DeepSeek**) via a dropdown menu.
- **📦 Bulk Testing**: Paste a list of keys or drag & drop `.txt`/`.csv` files for batch processing.
- **🛡️ Security First**: All keys are processed in-memory and never stored on any server or database. Data is discarded immediately after the session.
- **🎨 Premium UI**: Sophisticated Dark Mode interface with glassmorphism effects, monospaced key masking, and high-quality provider logos.
- **📱 Responsive Design**: Fully optimized for desktop and mobile workflows.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVG Provider Logos
- **Utilities**: `clsx`, `tailwind-merge`
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FL3XXRICHIE/LLM-TESTER.git
   cd LLM-TESTER
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) to start testing.

## 📝 Usage

1. **Paste Keys**: Input your API keys directly into the main textarea (one per line).
2. **File Upload**: Drag and drop your `.txt` or `.csv` files containing keys.
3. **Test**: Click **"Detect & Test"**. The tool will automatically identify known providers.
4. **Manual Override**: If a provider isn't detected (e.g., Mistral or DeepSeek), select it from the dropdown in the results table and click the **Retry** button.
5. **Results**: Review the status (ACTIVE/DEAD) and any error details.
6. **Export**: Download a `.txt` file of all active keys with one click.

## 🔒 Security Disclaimer

This tool is designed for convenience and privacy. **API keys are sensitive credentials.**
- We do **not** log, store, or transmit your keys to any third party other than the official provider APIs (OpenAI, Anthropic, Google, Groq, Mistral, DeepSeek).
- For maximum security, always run this tool locally.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---
Built with ❤️ by [FL3XXRICHIE](https://github.com/FL3XXRICHIE)
