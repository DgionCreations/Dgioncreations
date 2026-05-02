import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Send } from "lucide-react";
import { AnimatedForm } from "@/components/ui/modern-animated-sign-in";

type FormData = { name: string; email: string; message: string };

const SI = "https://cdn.simpleicons.org";
import { useContent } from "@/lib/use-content";
import { 
  CONTACT_CONTENT_KEY, 
  defaultContactContent, 
  type ContactContent 
} from "@/content/contact";
import { textStyleToCss } from "@/content/typography";


/* ── 3D floating contact-info panel (mouse tilt) ── */
function ContactInfo3D({ orbText }: { orbText: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 70, damping: 16 });
  const sRy = useSpring(ry, { stiffness: 70, damping: 16 });

  const shineX = useTransform(sRy, [-15, 15], ["0%", "100%"]);
  const shineY = useTransform(sRx, [15, -15], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const cy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    ry.set(cx * 14);
    rx.set(-cy * 14);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };


  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1400 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* center stage */}
      <motion.div
        style={{
          rotateX: sRx,
          rotateY: sRy,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[460px] h-[460px]"
      >
        {/* ── breathing back glow ── */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(131,127,251,0.5) 0%, transparent 70%)",
            transform: "translate(-50%, -50%) translateZ(-150px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── 3D concentric rings + central orb ── */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* concentric purple rings with slow individual rotation */}
          {[340, 280, 220, 170, 125, 90].map((size, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full will-change-transform"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                border: `${i < 2 ? 1.5 : 1}px solid`,
                borderColor: `rgba(131,127,251,${0.15 + i * 0.06})`,
                boxShadow: `0 0 ${8 + i * 3}px rgba(131,127,251,${0.05 + i * 0.03}), inset 0 0 ${6 + i * 2}px rgba(131,127,251,${0.03 + i * 0.02})`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 50 + i * 12, repeat: Infinity, ease: "linear" }}
            />
          ))}

        </div>

        {/* ── central DGION orb — fixed dead center, NO animation ── */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: 80,
            height: 80,
            marginLeft: -40,
            marginTop: -40,
          }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden relative"
            style={{
              background: "conic-gradient(from 180deg, #837FFB, #1B1A4E, #837FFB)",
              boxShadow: "0 12px 50px rgba(131,127,251,0.65), 0 0 40px rgba(131,127,251,0.45), inset 0 -4px 12px rgba(0,0,0,0.3), inset 0 3px 10px rgba(255,255,255,0.35)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)" }}
            />
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <span className="text-white text-[9px] font-bold tracking-[0.25em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                {orbText}
              </span>
            </div>
          </div>

        </div>

        {/* ── orbiting logo badges ── */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 0, height: 0 }}
        >
          {[
            { radius: 170, dur: 24, delay: 0,   reverse: false, src: "https://cdn.simpleicons.org/gmail/EA4335",      bg: "#EA4335" },
            { radius: 140, dur: 20, delay: -5,  reverse: true,  src: "https://cdn.simpleicons.org/whatsapp/25D366",   bg: "#25D366" },
            { radius: 110, dur: 22, delay: -3,  reverse: false, src: "https://cdn.simpleicons.org/googlemaps/4285F4",  bg: "#4285F4" },
            { radius: 80,  dur: 18, delay: -9,  reverse: true,  src: "https://cdn.simpleicons.org/clockify/03A9F4",   bg: "#03A9F4" },
          ].map((item, i) => (
            <div
              key={`orbit-${i}`}
              className={`absolute left-0 top-0 flex items-center justify-center animate-orbit ${item.reverse ? "[animation-direction:reverse]" : ""}`}
              style={{
                "--duration": item.dur,
                "--radius": item.radius,
                "--delay": item.delay,
                width: 52,
                height: 52,
                marginLeft: -26,
                marginTop: -26,
              } as React.CSSProperties}
            >
              <motion.div
                className="w-full h-full rounded-[16px] flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${item.bg}22 0%, rgba(15,12,40,0.95) 100%)`,
                  border: `1px solid ${item.bg}55`,
                  boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 0 20px ${item.bg}30, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
                whileHover={{ scale: 1.2, boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 30px ${item.bg}55` }}
              >
                <img src={item.src} alt="" className="w-6 h-6 object-contain relative z-10" />
                <div
                  className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }}
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* ── floating 3D particles around rings ── */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-[#837FFB]"
            style={{
              marginLeft: -0.5,
              marginTop: -0.5,
              boxShadow: "0 0 6px #837FFB, 0 0 12px rgba(131,127,251,0.5)",
              transform: `translateZ(${20 + i * 8}px)`,
            }}
            animate={{
              x: [Math.cos(i * 0.52) * (60 + i * 12), Math.cos(i * 0.52 + Math.PI) * (60 + i * 12)],
              y: [Math.sin(i * 0.52) * (60 + i * 12), Math.sin(i * 0.52 + Math.PI) * (60 + i * 12)],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 6 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* ── mouse-driven shine sweep ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
          style={{
            background: useTransform(
              [shineX, shineY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.18), transparent 55%)`
            ) as unknown as string,
            transform: "translateZ(100px)",
          }}
        />

      </motion.div>
    </div>
  );
}

/* ── single info card ── */
function InfoCard({ c, delay }: { c: { logo: string; label: string; value: string; color: string; bg: string }; delay: number }) {
  return (
    <motion.div
      className="p-3.5 rounded-2xl"
      style={{
        background: "rgba(15,12,40,0.9)",
        backdropFilter: "blur(14px)",
        border: `1px solid ${c.color}44`,
        boxShadow: `0 14px 35px rgba(0,0,0,0.5), 0 0 20px ${c.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.04, y: -3 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${c.bg}22 0%, rgba(15,12,40,0.95) 100%)`,
            border: `1px solid ${c.bg}55`,
            boxShadow: `0 6px 16px rgba(0,0,0,0.4), 0 0 14px ${c.bg}30, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          <img src={c.logo} alt={c.label} className="w-5 h-5 object-contain relative z-10" />
          <div
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)" }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/50">{c.label}</p>
          <p className="text-white font-semibold text-[13px] truncate mt-0.5">{c.value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContactSection() {
  const { data } = useContent<ContactContent>(CONTACT_CONTENT_KEY, defaultContactContent);
  const cards = data.cards;
  const OFFICE_ADDRESS = data.officeAddress;
  const OFFICE_QUERY = data.officeQuery;

  const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
    OFFICE_QUERY
  )}&output=embed&z=17`;

  const MAP_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    OFFICE_QUERY
  )}`;

  const [, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: keyof FormData
  ) => {
    setFormData((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  const goToSchedule = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formFields = {
    header: submitted ? "Message Sent" : data.formHeader,
    subHeader: submitted
      ? "Thanks — we'll reply within 24 hours."
      : data.formSubHeader,
    fields: [
      {
        label: "Name",
        required: true,
        type: "text" as const,
        placeholder: "Your full name",
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          handleInputChange(e, "name"),
      },
      {
        label: "Email",
        required: true,
        type: "email" as const,
        placeholder: "you@email.com",
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          handleInputChange(e, "email"),
      },
      {
        label: "Message",
        required: true,
        type: "textarea" as const,
        placeholder: "Tell us about your project...",
        rows: 4,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          handleInputChange(e, "message"),
      },
    ],
    submitButton: submitted ? "Sent ✓" : data.formSubmitLabel,
    textVariantButton: data.formScheduleLabel,
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)",
        minHeight: "100vh",
      }}
    >
      {/* ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#837FFB]/15 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#5B57F5]/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(131,127,251,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 flex max-lg:justify-center min-h-screen">
        {/* Left — heading + orbit + cards */}
        <span className="flex flex-col justify-center items-center w-1/2 max-lg:hidden relative py-10">
          {/* heading */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="text-5xl font-bold bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent leading-[1.2] pb-2">
              Let&apos;s build something great.
            </h3>
          </motion.div>

          {/* top row — Email + Call */}
          <div className="flex gap-4 mb-6 w-full max-w-md justify-between">
            <InfoCard c={cards[0]} delay={0} />
            <InfoCard c={cards[1]} delay={0.15} />
          </div>

          {/* orbit area */}
          <ContactInfo3D orbText={data.orbText} />

          {/* bottom row — Visit + Reply */}
          <div className="flex gap-4 mt-6 w-full max-w-md justify-between">
            <InfoCard c={cards[2]} delay={0.3} />
            <InfoCard c={cards[3]} delay={0.45} />
          </div>
        </span>

        {/* Right — animated form */}
        <span className="w-1/2 min-h-screen flex flex-col justify-center items-center max-lg:w-full max-lg:px-5 sm:max-lg:px-8 md:max-lg:px-12 max-lg:pt-28 max-lg:pb-20 py-16">
          <AnimatedForm
            {...formFields}
            onSubmit={handleSubmit}
            goTo={goToSchedule}
          />
        </span>
      </div>

      {/* decorative send icon floating bottom right */}
      <div className="hidden md:block absolute bottom-10 right-10 z-10 opacity-10 pointer-events-none">
        <Send className="w-40 h-40 text-[#837FFB]" />
      </div>

      {/* ── Google Maps — embedded office location ── */}
      <div
        className="relative z-10 w-full"
        style={{ background: "linear-gradient(180deg, #1B1A4E 0%, #13113A 100%)" }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8"
        >
          <span className="mb-3" style={textStyleToCss(data.mapTitleKickerStyle)}>
            {data.mapTitleKicker}
          </span>
          <h3 className="mt-3 font-bold" style={textStyleToCss(data.mapTitleStyle)}>
            {data.mapTitle}
            <span style={textStyleToCss(data.mapHighlightStyle)}>
              {data.mapHighlight}
            </span>
          </h3>
          <p className="mt-4 max-w-2xl mx-auto" style={textStyleToCss(data.officeAddressStyle)}>
            {OFFICE_ADDRESS}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            border: "1px solid rgba(131,127,251,0.25)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.55), 0 0 50px rgba(131,127,251,0.15)",
          }}
        >
          <iframe
            src={MAP_EMBED_URL}
            title="Dgion office location — Bademiya Complex, Nampally, Hyderabad"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="w-full h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] block"
            style={{ border: 0, filter: "saturate(1.1) contrast(1.05)" }}
          />

          {/* subtle purple overlay wash for brand consistency */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(131,127,251,0.04) 0%, transparent 50%)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>

        <div className="mt-6 flex justify-center">
          <a
            href={MAP_OPEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(131,127,251,0.12)",
              border: "1px solid rgba(131,127,251,0.35)",
              boxShadow: "0 8px 24px rgba(131,127,251,0.15)",
            }}
          >
            Open in Google Maps
            <span aria-hidden>↗</span>
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}