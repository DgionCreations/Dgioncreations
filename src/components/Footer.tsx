import { Link } from "react-router-dom";
import {
  Github,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useContent } from "@/lib/use-content";
import { FOOTER_CONTENT_KEY, defaultFooterContent, type FooterContent } from "@/content/footer";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";

export default function Footer() {
  const { data } = useContent<FooterContent>(FOOTER_CONTENT_KEY, defaultFooterContent);

  const titleCss = textStyleToCss(data.columnTitleStyle);
  const linkCss = textStyleToCss(data.linkStyle);
  const brandTitleCss = textStyleToCss(data.brandTitleStyle);
  const brandDescCss = textStyleToCss(data.brandDescriptionStyle);
  const contactItemCss = textStyleToCss(data.contactItemStyle);
  const copyrightCss = textStyleToCss(data.copyrightStyle);
  const bottomLinkCss = textStyleToCss(data.bottomLinkStyle);

  return (
    <footer
      className="relative w-full overflow-hidden border-t border-white/8"
      style={{
        background: "linear-gradient(160deg, #22175A 0%, #150E3F 50%, #22175A 100%)",
      }}
    >
      {/* glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-[#837FFB]/8 blur-[120px]" />
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-[#5B57F5]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-12 sm:pt-14 md:pt-16 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12">
          {/* brand */}
          <div>
            {data.brandHref.startsWith("http") ? (
              <a href={data.brandHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mb-5">
                <span className="tracking-tight" style={brandTitleCss}>
                  {data.brandName}
                </span>
              </a>
            ) : (
              <Link to={data.brandHref} className="inline-flex items-center mb-5">
                <span className="tracking-tight" style={brandTitleCss}>
                  {data.brandName}
                </span>
              </Link>
            )}

            <p className="leading-relaxed max-w-xs mb-8" style={brandDescCss}>
              {data.brandDescription}
            </p>

            <div className="flex gap-3">
              {data.socialLinks.map((s) => {
                const Icon = resolveIcon(s.iconKey);
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-white/50 hover:text-[#837FFB] transition-all duration-300 hover:bg-[#837FFB]/10 active:bg-[#837FFB]/20"
                    style={{ border: "1px solid rgba(131,127,251,0.12)" }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* link columns */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h4 className="uppercase mb-4 sm:mb-5" style={titleCss}>
                {data.servicesTitle}
              </h4>
              <ul className="space-y-3">
                {data.servicesLinks.map(({ text, href }) => {
                  const resolvedHref = (href === "#" || href === "#services") ? "/services" : (href.startsWith("/") || href.startsWith("http") || href.startsWith("#") ? href : `/${href}`);
                  return (
                    <li key={text}>
                      {resolvedHref.startsWith("/") ? (
                        <Link to={resolvedHref} className="hover:text-white transition-colors" style={linkCss}>
                          {text}
                        </Link>
                      ) : (
                        <a href={resolvedHref} className="hover:text-white transition-colors" style={linkCss}>
                          {text}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="uppercase mb-4 sm:mb-5" style={titleCss}>
                {data.companyTitle}
              </h4>
              <ul className="space-y-3">
                {(data.companyLinks.some(l => l.href === "/reviews") 
                  ? data.companyLinks 
                  : [...data.companyLinks, { text: "Reviews", href: "/reviews" }]
                )
                .filter(l => !l.text.toLowerCase().includes("careers"))
                .map(({ text, href }) => {
                  // FORCE correct paths for core pages to fix any admin panel errors
                  let resolvedHref = href;
                  const lowerText = text.toLowerCase();
                  
                  if (lowerText.includes("about")) resolvedHref = "/about";
                  else if (lowerText.includes("process")) resolvedHref = "/process";
                  else if (lowerText.includes("portfolio")) resolvedHref = "/portfolio";
                  else if (lowerText.includes("reviews")) resolvedHref = "/reviews";
                  else if (lowerText.includes("careers")) resolvedHref = "/careers";
                  else if (lowerText.includes("industries")) resolvedHref = "/industries";
                  else if (!resolvedHref.startsWith("/") && !resolvedHref.startsWith("http") && !resolvedHref.startsWith("#")) {
                    resolvedHref = `/${resolvedHref}`;
                  }

                  return (
                    <li key={text}>
                      {resolvedHref.startsWith("/") ? (
                        <Link to={resolvedHref} className="hover:text-white transition-colors" style={linkCss}>
                          {text}
                        </Link>
                      ) : (
                        <a href={resolvedHref} className="hover:text-white transition-colors" style={linkCss}>
                          {text}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="uppercase mb-4 sm:mb-5" style={titleCss}>
                {data.resourcesTitle}
              </h4>
              <ul className="space-y-3">
                {data.resourceLinks.map(({ text, href }) => {
                  let resolvedHref = href;
                  const lowerText = text.toLowerCase();
                  
                  if (lowerText.includes("blog")) resolvedHref = "/blog";
                  else if (lowerText.includes("case")) resolvedHref = "/case-studies";
                  else if (lowerText.includes("support")) resolvedHref = "/support";
                  else if (lowerText.includes("privacy")) resolvedHref = "/privacy";
                  else if (!resolvedHref.startsWith("/") && !resolvedHref.startsWith("http") && !resolvedHref.startsWith("#")) {
                    resolvedHref = `/${resolvedHref}`;
                  }

                  return (
                    <li key={text}>
                      {resolvedHref.startsWith("/") ? (
                        <Link to={resolvedHref} className="hover:text-white transition-colors" style={linkCss}>
                          {text}
                        </Link>
                      ) : (
                        <a href={resolvedHref} className="hover:text-white transition-colors" style={linkCss}>
                          {text}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="uppercase mb-4 sm:mb-5" style={titleCss}>
                {data.contactTitle}
              </h4>
              <ul className="space-y-3">
                {data.contactInfo.map((c) => {
                  const Icon = resolveIcon(c.iconKey);
                  return (
                    <li key={c.text}>
                      <a href="#contact" className="flex items-start gap-2 hover:text-white transition-colors" style={contactItemCss}>
                        <Icon className="h-3.5 w-3.5 text-[#837FFB] shrink-0 mt-0.5" />
                        <span>{c.text}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* divider + bottom */}
        <div className="mt-10 sm:mt-12 md:mt-14 pt-6 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p style={copyrightCss}>
            {data.copyrightText.replace("{year}", new Date().getFullYear().toString())}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {data.bottomLinks.map((l) => (
              <a key={l.text} href={l.href} className="hover:text-white/50 transition-colors" style={bottomLinkCss}>
                {l.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}