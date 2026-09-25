import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, UploadCloud, Sliders, Download, WifiOff, Lock, 
  Sparkles, CheckCircle2, XCircle, ArrowRight, Image, 
  Film, FileText, Table, EyeOff, HelpCircle, ChevronDown 
} from 'lucide-react';

export const SEO_LANDING_PAGES = {
  '/': {
    title: 'Free Online File Converter — PDF File Converter, Image to JPG, MP4 & MP3 | ZeroConvert',
    h1: 'Free Online File Converter',
    subtitle: 'The 100% private PDF file converter, image file converter to JPG/PNG/SVG, and video to audio file converter (MP4 & MP3). Convert files free in your browser with zero uploads.'
  },
  '/pdf-file-converter': {
    title: 'PDF File Converter & File Converter to PDF (100% Free & Private) | ZeroConvert',
    h1: 'Free PDF File Converter',
    subtitle: 'Use our fast file converter to PDF to merge JPG, PNG, and HEIC images into one Adobe-compatible PDF—or convert PDF pages into crisp PNG images locally.'
  },
  '/file-converter-to-jpg': {
    title: 'File Converter to JPG — Convert HEIC, PNG, WEBP & SVG to JPG Free | ZeroConvert',
    h1: 'File Converter to JPG',
    subtitle: 'Batch convert iPhone HEIC, PNG, WebP, AVIF, and SVG graphics to standard JPG format in seconds. 100% client-side image file converter with zero server uploads.'
  },
  '/file-converter-to-mp4': {
    title: 'File Converter to MP4 — Free Online Video File Converter | ZeroConvert',
    h1: 'Video File Converter to MP4',
    subtitle: 'Convert MOV, WebM, AVI, and MKV videos to MP4 or compress large MP4 files directly in your browser using hardware-accelerated WebAssembly.'
  },
  '/file-converter-to-mp3': {
    title: 'File Converter to MP3 — Audio File Converter & Video to Audio | ZeroConvert',
    h1: 'Audio File Converter to MP3',
    subtitle: 'Extract high-bitrate MP3 audio from MP4 videos or convert WAV, AAC, and OGG tracks with our free video to audio file converter.'
  },
  '/video-to-audio-file-converter': {
    title: 'Video to Audio File Converter — Extract MP3 from MP4 Free | ZeroConvert',
    h1: 'Video to Audio File Converter',
    subtitle: 'Turn any MP4, MOV, or WebM video into a clean MP3 audio file locally on your device. No upload queues and no file size restrictions.'
  },
  '/png-file-converter': {
    title: 'PNG File Converter — Convert JPG, HEIC, SVG & PDF to PNG Free | ZeroConvert',
    h1: 'Free PNG File Converter',
    subtitle: 'Convert images, vector SVGs, and multi-page PDF documents into lossless, transparent-ready PNG files directly inside your browser.'
  },
  '/svg-file-converter': {
    title: 'SVG File Converter & Vector File Converter to PNG, JPG & PDF | ZeroConvert',
    h1: 'SVG & Vector File Converter',
    subtitle: 'Rasterize SVG vector graphics into high-resolution PNG, JPG, WebP, or PDF documents instantly without installing heavy design software.'
  },
  '/zip-file-converter': {
    title: 'Batch ZIP File Converter — Convert & Bundle Files into ZIP Free | ZeroConvert',
    h1: 'Batch ZIP File Converter',
    subtitle: 'Convert dozens of images, PDFs, audio tracks, or spreadsheets at once and package your entire batch into a single one-click ZIP download.'
  }
};

export function HowItWorksSection({ isStandalonePage = false }) {
  useEffect(() => {
    if (isStandalonePage) {
      document.title = 'How It Works — Convert Files in 3 Simple Steps | ZeroConvert';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isStandalonePage]);

  return (
    <section id="how-it-works" className="w-full max-w-5xl mx-auto py-16 md:py-24 px-6 border-t border-zinc-900 scroll-mt-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Sparkles size={12} />
          Fast, Simple & No Sign-Up Required
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          Convert Any File in 3 Simple Steps
        </h2>
        <p className="text-base text-zinc-400 mt-3 leading-relaxed">
          No waiting in upload queues, no file size paywalls, and no complicated settings. Everything happens right on your screen in seconds.
        </p>
      </div>

      {/* 3-Step User Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Step 1
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <UploadCloud size={22} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Drop Your Files
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Drag and drop one or multiple files into the converter box above, or click to browse from your computer or phone. You can mix and match different file types at once.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Supports batch uploads</span>
            <ArrowRight size={15} className="text-indigo-400" />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Step 2
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Sliders size={22} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Choose Target Format
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Pick the output format you want from the dropdown next to each file—or use <strong>Convert all to</strong> to set the entire batch at once. Select <strong>PDF</strong> on multiple images to merge them into one document.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Smart format detection</span>
            <ArrowRight size={15} className="text-indigo-400" />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Step 3
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Download size={22} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Convert & Save Instantly
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Click <strong>Convert All</strong> and watch the progress bar finish in seconds. Save individual files with a single click, or hit <strong>Download ZIP</strong> to grab your entire batch in one neat folder.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-emerald-400">
            <span>Ready to use immediately</span>
            <CheckCircle2 size={15} />
          </div>
        </div>
      </div>

      {/* SEO-Targeted Supported File Converters Matrix */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-bold text-zinc-100 mb-2">
          All-in-One Free File Converter Tools
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 mb-6">
          Every converter below runs 100% locally in your browser with unlimited batch processing and instant ZIP exports.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                PDF File Converter & File Converter to PDF
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Use our fast <strong>file converter to PDF</strong> to merge JPG, PNG, and HEIC images into a single Adobe-compatible PDF document, or convert PDF pages into high-res PNGs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Image size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Image & Vector File Converter to JPG, PNG & SVG
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                A complete <strong>image file converter</strong> and <strong>vector file converter</strong>. Use our <strong>file converter to JPG</strong>, <strong>PNG file converter</strong>, or <strong>SVG file converter</strong> for HEIC, WebP, and AVIF graphics.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Film size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Video to Audio File Converter (MP4, MP3 & WAV)
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                High-speed <strong>video file converter</strong> and <strong>audio file converter</strong>. Use it as a <strong>file converter to MP4</strong>, <strong>file converter to MP3</strong>, or <strong>WAV file converter</strong> to extract audio or create GIFs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Table size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Batch ZIP File Converter & Spreadsheet Tools
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Convert Excel (<strong>XLSX</strong>), <strong>CSV</strong>, and <strong>JSON</strong> tables instantly, and use our built-in <strong>ZIP file converter</strong> to bundle dozens of converted files into a single one-click download.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PrivacyGuaranteeSection({ isStandalonePage = false }) {
  useEffect(() => {
    if (isStandalonePage) {
      document.title = 'Privacy Guarantee — ZeroConvert 100% Private File Converter';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isStandalonePage]);

  return (
    <section id="privacy-guarantee" className="w-full max-w-5xl mx-auto py-16 md:py-24 px-6 border-t border-zinc-900 scroll-mt-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
          <Lock size={12} />
          100% On-Device Privacy
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          We Cannot See Your Files—Ever
        </h2>
        <p className="text-base text-zinc-400 mt-3 leading-relaxed">
          Most "free" online converters upload your confidential documents, tax forms, and personal photos to unknown cloud servers. ZeroConvert converts everything directly on your own device.
        </p>
      </div>

      {/* Bento Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <WifiOff size={22} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Works Even Without Internet</h3>
            <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
              Once this page is open, you can turn off your Wi-Fi or switch to Airplane Mode and keep converting files. That is the ultimate proof that your files never leave your computer.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
            <EyeOff size={22} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Safe for Sensitive Documents</h3>
            <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
              Because there is no upload server or cloud storage database, your personal photos, client contracts, bank statements, and spreadsheets remain 100% in your possession.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table: Cloud vs ZeroConvert (Responsive Horizontal Scroll on Small Phones) */}
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30 mb-10">
        <div className="overflow-x-auto">
          <div className="min-w-[540px]">
            <div className="grid grid-cols-3 bg-zinc-900/90 border-b border-zinc-800 px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <div>What Matters</div>
              <div className="text-rose-400 flex items-center gap-1.5">
                <XCircle size={15} className="shrink-0" /> Other Converters
              </div>
              <div className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="shrink-0" /> ZeroConvert
              </div>
            </div>

            <div className="divide-y divide-zinc-800/70 text-xs sm:text-sm">
              <div className="grid grid-cols-3 px-4 sm:px-6 py-4 items-center gap-2">
                <span className="font-medium text-zinc-200">Where files are converted</span>
                <span className="text-zinc-500">Uploaded to a remote cloud server</span>
                <span className="text-emerald-400 font-medium">Directly inside your web browser</span>
              </div>
              <div className="grid grid-cols-3 px-4 sm:px-6 py-4 items-center gap-2">
                <span className="font-medium text-zinc-200">Waiting for uploads</span>
                <span className="text-zinc-500">Slow—depends on internet speed</span>
                <span className="text-emerald-400 font-medium">Zero upload wait—starts immediately</span>
              </div>
              <div className="grid grid-cols-3 px-4 sm:px-6 py-4 items-center gap-2">
                <span className="font-medium text-zinc-200">Daily limits & paywalls</span>
                <span className="text-zinc-500">Strict MB limits & daily caps</span>
                <span className="text-emerald-400 font-medium">Unlimited files & batch ZIP exports</span>
              </div>
              <div className="grid grid-cols-3 px-4 sm:px-6 py-4 items-center gap-2">
                <span className="font-medium text-zinc-200">Risk of data leaks</span>
                <span className="text-zinc-500">Stored on cloud disks for 24h+</span>
                <span className="text-emerald-400 font-medium">Zero—cleared when you close the tab</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Callout */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="text-base font-semibold text-emerald-400 flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck size={18} />
            Test our privacy promise yourself:
          </div>
          <p className="text-xs md:text-sm text-zinc-400">
            Drop a file into the converter, turn off your Wi-Fi, and click <strong>Convert All</strong>. Your file will still convert and download without a hitch because nothing ever leaves your device.
          </p>
        </div>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    question: "Are online file converters safe to use?",
    answer: "Most traditional online converters upload your files to remote cloud servers and store them for up to 24 hours, making them risky for sensitive personal or financial documents. ZeroConvert is completely different: it processes your files 100% locally inside your browser memory. Because your files never touch an external server, it is completely safe for tax forms, bank statements, contracts, and private photos."
  },
  {
    question: "Do I need to install software to convert files privately?",
    answer: "No. Historically, you had to install heavy desktop software to get offline processing and true privacy. ZeroConvert uses modern WebAssembly (WASM) and HTML5 Canvas technology to give you desktop-grade offline privacy and speed directly inside your web browser—with zero software or plugins to install."
  },
  {
    question: "Are free file converters really free?",
    answer: "Many 'free' online tools bait you with a free trial and then restrict file sizes (e.g., 50MB–100MB caps) or lock you out after 3 daily conversions unless you buy a subscription. Because ZeroConvert uses your own device's processor instead of expensive cloud servers, it is 100% free with no daily conversion caps, no watermarks, and no subscriptions."
  },
  {
    question: "Can I convert iPhone HEIC photos to JPG or PDF in bulk?",
    answer: "Yes! You can drag and drop dozens of Apple HEIC photos at once and convert them into standard JPG, PNG, or WebP files. If you select 'PDF' as the target format for multiple images, ZeroConvert will automatically merge all of them into a single PDF document."
  },
  {
    question: "How do I extract MP3 audio from an MP4 video locally?",
    answer: "Simply drop your MP4, MOV, or WebM video into the converter box, select 'MP3' from the format dropdown, and click Convert All. Our embedded FFmpeg WebAssembly engine extracts the high-bitrate audio track directly in your device's RAM in seconds."
  },
  {
    question: "Can I convert Excel (XLSX) spreadsheets to CSV or JSON safely?",
    answer: "Yes. Financial spreadsheets and customer lists contain sensitive data that should never be uploaded to third-party web tools. ZeroConvert transforms XLSX, CSV, and JSON files locally on your machine so your confidential rows and columns stay strictly private."
  },
  {
    question: "Does ZeroConvert work offline without an internet connection?",
    answer: "Yes! Once the webpage is open in your browser tab, you can turn off your Wi-Fi or switch to Airplane Mode and continue converting images, PDFs, spreadsheets, and videos completely offline."
  }
];

export function FaqSection({ isStandalonePage = false }) {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    if (isStandalonePage) {
      document.title = 'Frequently Asked Questions — ZeroConvert Private File Converter';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isStandalonePage]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto py-16 md:py-24 px-6 border-t border-zinc-900 scroll-mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <HelpCircle size={12} />
          Got Questions?
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-zinc-400 mt-3 leading-relaxed">
          Everything you need to know about local browser conversions, supported formats, and how we protect your privacy.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-zinc-900/70 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm md:text-base font-semibold text-zinc-100">
                  {item.question}
                </span>
                <div
                  className={`p-1.5 rounded-lg transition-transform duration-200 shrink-0 ${
                    isOpen ? 'bg-indigo-500/20 text-indigo-400 rotate-180' : 'bg-zinc-800/70 text-zinc-400'
                  }`}
                >
                  <ChevronDown size={18} />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function PopularConvertersSection() {
  const links = [
    { path: '/pdf-file-converter', label: 'PDF File Converter' },
    { path: '/file-converter-to-jpg', label: 'File Converter to JPG' },
    { path: '/file-converter-to-mp4', label: 'File Converter to MP4' },
    { path: '/file-converter-to-mp3', label: 'File Converter to MP3' },
    { path: '/video-to-audio-file-converter', label: 'Video to Audio Converter' },
    { path: '/png-file-converter', label: 'PNG File Converter' },
    { path: '/svg-file-converter', label: 'SVG Vector File Converter' },
    { path: '/zip-file-converter', label: 'Batch ZIP File Converter' },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-6 border-t border-zinc-900">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-center mb-6">
        Popular Free File Converter Tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-indigo-300 text-center transition-all"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}