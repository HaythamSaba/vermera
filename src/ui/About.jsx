import { useState } from "react";
import { Briefcase, Check, Copy, Github, Globe, Linkedin, Mail } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import Reveal from "./Reveal";
import useStaggerReveal from "../hooks/useStaggerReveal";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useToast } from "../hooks/useToast";
import { STAGGER_MS } from "../utils/motion";

const CONTACT_EMAIL = "haythamsaba@gmail.com";

const CONTACT_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    value: "HaythamSaba",
    href: "https://github.com/HaythamSaba",
    ariaLabel: "GitHub — HaythamSaba",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "haytham-saba",
    href: "https://www.linkedin.com/in/haytham-saba-401148278/",
    ariaLabel: "LinkedIn — haytham-saba",
  },
  {
    icon: Globe,
    label: "Website",
    value: "haytham-saba.vercel.app",
    href: "https://haytham-saba.vercel.app/",
    ariaLabel: "Personal website — haytham-saba.vercel.app",
  },
];

// This is the developer's own personal/portfolio page living inside the
// Vermera shell (same Header/Footer chrome as every other route) — content
// is about Haytham, not the fictional Vermera brand.
const About = () => {
  useDocumentTitle("About");
  const showToast = useToast();
  const [copied, setCopied] = useState(false);

  // Contact channel cards get their own coordinated reveal, same pattern as
  // ServiceValues' .service-card grid on the homepage.
  const { containerRef } = useStaggerReveal(".contact-channel", [], {
    durationMs: 500,
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      showToast("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable or permission denied — the mailto link
      // right next to this button still works as a fallback, so this can
      // fail silently rather than surface an error for a non-critical nicety.
    }
  };

  return (
    <div>
      {/* Intro / hero — deliberately plain and text-forward (a single
          column, no image grid, no card layout) so this reads as the
          developer's own page, not another product/category banner. */}
      <div className="container-foundation section">
        <Breadcrumb path={["Home", "About"]} />

        <div className="max-w-2xl mt-10">
          <Reveal
            as="p"
            delay={0}
            className="font-semibold text-sm uppercase tracking-[3px] text-brass mb-4"
          >
            Frontend Developer · Ljubljana, Slovenia
          </Reveal>
          <Reveal
            as="h1"
            delay={STAGGER_MS}
            className="font-serif text-espresso font-semibold text-5xl sm:text-6xl leading-tight mb-6"
          >
            Haytham
          </Reveal>
          <Reveal
            as="p"
            delay={STAGGER_MS * 2}
            className="font-serif text-2xl sm:text-3xl text-charcoal leading-snug mb-6"
          >
            Turning company values into websites users trust.
          </Reveal>
          <Reveal
            as="p"
            delay={STAGGER_MS * 3}
            className="text-taupe text-lg leading-relaxed"
          >
            Software Engineering graduate targeting frontend and full-stack
            roles in Ljubljana and the broader European market. Long-term
            goal: becoming a Product Engineer.
          </Reveal>
        </div>
      </div>

      {/* Background / experience */}
      <section className="container-foundation section">
        <div className="max-w-2xl">
          <Reveal
            as="h2"
            className="font-serif font-medium text-3xl text-espresso mb-6"
          >
            Background
          </Reveal>
          <Reveal delay={STAGGER_MS} className="flex items-start gap-4">
            <Briefcase
              className="w-5 h-5 text-brass mt-1 shrink-0"
              aria-hidden="true"
            />
            <p className="text-taupe text-lg leading-relaxed">
              Interned remotely with{" "}
              <span className="text-charcoal font-medium">Siciliamia</span>,
              an Italian company, working on{" "}
              <span className="text-charcoal font-medium">
                BlueHouse_New
              </span>{" "}
              inside a structured pull-request and code-review workflow
              alongside senior developers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* This project */}
      <section className="bg-cream border-y border-stone">
        <div className="container-foundation section">
          <div className="max-w-2xl">
            <Reveal
              as="h2"
              className="font-serif font-medium text-3xl text-espresso mb-6"
            >
              About This Project
            </Reveal>
            <Reveal
              as="p"
              delay={STAGGER_MS}
              className="text-taupe text-lg leading-relaxed mb-4"
            >
              Vermera is a portfolio project, not a real store — a
              &quot;quiet luxury&quot; fashion catalog built to demonstrate
              frontend and product-engineering skills. There&apos;s no
              backend: the catalog is sourced live from DummyJSON, and the
              cart, wishlist, and order records all persist to
              localStorage.
            </Reveal>
            <Reveal
              as="p"
              delay={STAGGER_MS * 2}
              className="text-taupe text-lg leading-relaxed"
            >
              A few decisions I&apos;m glad I made along the way: filter,
              sort, and category state all live in the URL, so results are
              shareable and back/forward just works; every interactive
              element is a real, keyboard-reachable control with correct
              ARIA rather than a styled div; and scroll animation is
              deliberately split — GSAP and ScrollTrigger for scroll-position
              effects, Framer Motion for open/close state — instead of
              mixing the two on one element.
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container-foundation section">
        <div className="max-w-2xl mb-10">
          <Reveal
            as="h2"
            className="font-serif font-medium text-3xl text-espresso mb-4"
          >
            Get in Touch
          </Reveal>
          <Reveal
            as="p"
            delay={STAGGER_MS}
            className="text-taupe text-lg leading-relaxed"
          >
            Open to frontend and full-stack roles — reach out through any of
            these.
          </Reveal>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {CONTACT_LINKS.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                aria-label={channel.ariaLabel}
                className="contact-channel flex items-center gap-4 p-5 border border-stone bg-cream hover:border-brass transition-colors duration-300"
              >
                <Icon
                  className="w-5 h-5 text-brass shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-charcoal">
                    {channel.label}
                  </p>
                  <p className="text-taupe text-sm">{channel.value}</p>
                </div>
              </a>
            );
          })}

          <div className="contact-channel flex items-center gap-4 p-5 border border-stone bg-cream">
            <Mail
              className="w-5 h-5 text-brass shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-taupe text-sm hover:text-brass transition-colors duration-300 break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={copied ? "Email copied" : "Copy email address"}
              className="shrink-0 text-taupe hover:text-brass transition-colors duration-300 cursor-pointer"
            >
              {copied ? (
                <Check className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Copy className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
