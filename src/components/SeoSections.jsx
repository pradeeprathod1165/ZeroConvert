import { useState, useEffect } from 'react';
import { 
  ShieldCheck, UploadCloud, Sliders, Download, WifiOff, Lock, 
  Sparkles, CheckCircle2, XCircle, ArrowRight, Image, 
  Film, FileText, Table, EyeOff, HelpCircle, ChevronDown 
} from 'lucide-react';

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
        {/* Step 1 */}
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

        {/* Step 2 */}
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
              Pick the output format you want from the dropdown next to each file. Our smart menu automatically shows only compatible formats—or select <strong>PDF</strong> on multiple images to merge them into one document.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Smart format detection</span>
            <ArrowRight size={15} className="text-indigo-400" />
          </div>
        </div>

        {/* Step 3 */}
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

      {/* Supported File Types Cheat Sheet */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
          What Can You Convert With ZeroConvert?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Image size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">Photos & Graphics</div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Convert iPhone <strong>HEIC</strong> photos, <strong>SVG</strong> vectors, <strong>PNG</strong>, <strong>JPG</strong>, <strong>WebP</strong>, and next-gen <strong>AVIF</strong> images effortlessly.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Film size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">Video, Audio & GIFs</div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Extract <strong>MP3</strong> audio from <strong>MP4</strong> videos, turn video clips into looping <strong>GIFs</strong>, or compress large video files for Discord & email.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">PDF Documents</div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Combine multiple images into a single <strong>PDF document</strong>, or extract every page of a PDF into high-resolution <strong>PNG</strong> images.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Table size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">Spreadsheets & Data</div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Transform Excel spreadsheets (<strong>XLSX</strong>), <strong>CSV</strong> tables, and <strong>JSON</strong> data files back and forth in a single click.
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

      {/* Comparison Table: Cloud vs ZeroConvert */}
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
    question: "Are my files really never uploaded to a server?",
    answer: "Yes, 100%. Unlike traditional online file converters that upload your documents to remote cloud storage, ZeroConvert processes everything inside your own web browser using WebAssembly and HTML5 Canvas. Your files never leave your computer or phone."
  },
  {
    question: "Can I convert iPhone HEIC photos to JPG or PDF in bulk?",
    answer: "Absolutely. You can drag and drop dozens of Apple HEIC photos at once and convert them into standard JPG, PNG, or WebP files. If you select 'PDF' as the target format for multiple images, ZeroConvert will automatically merge all of them into a single PDF document."
  },
  {
    question: "How do I extract MP3 audio from an MP4 video locally?",
    answer: "Simply drop your MP4, MOV, or WebM video into the converter box, select 'MP3' from the format dropdown, and click Convert All. Our embedded FFmpeg engine extracts the high-bitrate audio track directly in your device's memory in seconds."
  },
  {
    question: "Is there a file size limit or daily conversion cap?",
    answer: "No! Because you aren't using our server bandwidth or cloud storage, we never charge paywalls, watermark your files, or restrict you to '3 free conversions per day'. The only limit is your own device's available RAM."
  },
  {
    question: "Can I convert Excel (XLSX) spreadsheets to CSV or JSON safely?",
    answer: "Yes. Financial spreadsheets and customer lists often contain sensitive data that shouldn't be uploaded to third-party websites. ZeroConvert transforms XLSX, CSV, and JSON files locally on your machine so your confidential data stays strictly private."
  },
  {
    question: "Does ZeroConvert work offline without an internet connection?",
    answer: "Yes! Once the webpage and conversion engine are loaded in your browser tab, you can disconnect from Wi-Fi or turn on Airplane Mode and continue converting images, PDFs, spreadsheets, and videos completely offline."
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

  // Generate Google SEO JSON-LD Schema for Rich Results
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
      {/* Structured Data for Google Search Rich Snippets */}
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