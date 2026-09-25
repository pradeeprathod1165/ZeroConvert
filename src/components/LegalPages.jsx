import { useEffect, useState } from 'react';
import { ShieldCheck, Mail, Globe, Users, Scale, CheckCircle2, Send, Copy, Check } from 'lucide-react';

export function AboutPage() {
  useEffect(() => {
    document.title = 'About Us — ZeroConvert | 100% Client-Side File Converter';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-20 px-6">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Users size={12} />
          About ZeroConvert
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          Built for Privacy-First File Conversion
        </h1>
        <p className="text-base text-zinc-400 mt-3 leading-relaxed">
          ZeroConvert was created with a single mission: to give everyday users, developers, and businesses a fast, completely free way to convert files without surrendering their private data to remote cloud servers.
        </p>
      </div>

      <div className="space-y-6 text-sm md:text-base text-zinc-300 leading-relaxed bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-zinc-100">Why We Built ZeroConvert</h2>
        <p className="text-zinc-400">
          For years, converting a simple HEIC photo, PDF document, or Excel spreadsheet online meant uploading your personal files to an unknown third-party server, waiting in a slow queue, and hitting frustrating "Max 3 files per day" paywalls. Worse, sensitive financial records and personal photos sat on remote cloud disks for up to 24 hours.
        </p>
        <p className="text-zinc-400">
          With modern browser breakthroughs like <strong>WebAssembly (WASM)</strong>, <strong>HTML5 Canvas</strong>, and <strong>SharedArrayBuffer</strong> hardware acceleration, uploading files to a server is no longer necessary. ZeroConvert brings desktop-grade media and document engines directly into your browser tab.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <ShieldCheck size={20} className="text-emerald-400 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-100">Zero Cloud Storage</h3>
            <p className="text-xs text-zinc-500 mt-1">Your files are processed inside your local RAM and never touch our servers.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <Globe size={20} className="text-indigo-400 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-100">Free & Accessible</h3>
            <p className="text-xs text-zinc-500 mt-1">No subscriptions, no watermarks, no sign-ups, and no artificial daily caps.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <CheckCircle2 size={20} className="text-indigo-400 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-100">Open Web Standards</h3>
            <p className="text-xs text-zinc-500 mt-1">Powered by trusted open-source standards including FFmpeg, PDF-Lib, and SheetJS.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactPage() {
  const [copied, setCopied] = useState(false);
  const supportEmail = "support@zeroconvert.app"; // Replace with your actual domain/email

  useEffect(() => {
    document.title = 'Contact Us — ZeroConvert Support & Feedback';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = encodeURIComponent(formData.get('subject') || 'ZeroConvert Inquiry');
    const body = encodeURIComponent(
      `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\nMessage:\n${formData.get('message')}`
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-20 px-6">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Mail size={12} />
          Get in Touch
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          Contact Us
        </h1>
        <p className="text-base text-zinc-400 mt-3 leading-relaxed">
          Have a question, format request, bug report, or business inquiry? Reach out to us directly below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Direct Contact Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-zinc-100 mb-2">Direct Email</h2>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              We typically respond to all support inquiries and feedback within 24–48 business hours.
            </p>
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5">
              <span className="text-xs font-mono text-indigo-400 truncate">{supportEmail}</span>
              <button
                onClick={handleCopyEmail}
                className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                title="Copy Email"
              >
                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-zinc-100 mb-2">Technical Support Note</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Because ZeroConvert never uploads or stores your files, we cannot recover or view any files you have converted. If a conversion fails, please let us know the input format, target format, and browser version.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleFormSubmit}
          className="md:col-span-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Jane Doe"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="jane@example.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Subject</label>
            <input
              type="text"
              name="subject"
              required
              placeholder="Feature Request / Bug Report"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Message</label>
            <textarea
              name="message"
              rows={4}
              required
              placeholder="How can we help you?"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            <Send size={16} />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export function TermsPage() {
  useEffect(() => {
    document.title = 'Terms of Service — ZeroConvert';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-20 px-6">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Scale size={12} />
          Legal Terms
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-500 mt-2">Last Updated: September 2026</p>
      </div>

      <div className="space-y-6 text-sm text-zinc-400 leading-relaxed bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using ZeroConvert, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our web application.</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-100 mb-2">2. Description of Local Service</h2>
          <p>ZeroConvert provides client-side file conversion utilities that execute directly within the user's web browser via WebAssembly and HTML5 APIs. We do not upload, host, store, or back up user files on any external server.</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-100 mb-2">3. User Responsibility & Copyright</h2>
          <p>You retain full ownership and responsibility for the files you process using ZeroConvert. You agree not to use this tool to process illegal material or infringe upon the intellectual property rights of others.</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-100 mb-2">4. Disclaimer of Warranties</h2>
          <p>ZeroConvert is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Always keep a backup of your original files prior to batch conversion. We are not liable for any data loss, browser memory crashes, or damages resulting from the use of this tool.</p>
        </div>
      </div>
    </section>
  );
}

// Mandatory Google AdSense Cookie & Third-Party Disclosure (Rendered on /privacy)
export function AdSensePrivacyDisclosure() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-20">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-5 text-xs md:text-sm text-zinc-400 leading-relaxed">
        <h3 className="text-lg font-semibold text-zinc-100">
          Formal Privacy Policy, Cookies & Google AdSense Disclosure
        </h3>
        <p>
          <strong>1. File Data Handling:</strong> ZeroConvert does not collect, transmit, store, or analyze any files you select or convert. All file processing occurs strictly within your local device memory (`RAM`) and is immediately cleared when you close your browser tab.
        </p>
        <p>
          <strong>2. Cookies & Third-Party Advertising (Google AdSense):</strong> To keep ZeroConvert 100% free and unlimited, we may display non-intrusive advertisements provided by Google AdSense and third-party vendors. Third-party vendors, including Google, use cookies (such as the DoubleClick DART cookie) to serve ads based on a user's prior visits to this website or other websites on the internet.
        </p>
        <p>
          <strong>3. Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising at any time by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Google Ads Settings
          </a>{' '}
          or by visiting{' '}
          <a
            href="https://www.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            www.aboutads.info
          </a>.
        </p>
        <p>
          <strong>4. Log Files & Analytics:</strong> Like all standard web hosts, our static hosting provider may log basic anonymous network requests (such as browser type, referring page, and timestamp) strictly for security and DDoS prevention. These logs never contain any information about the files you convert.
        </p>
      </div>
    </div>
  );
}