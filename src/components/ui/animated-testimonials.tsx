"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Quote, Star } from "lucide-react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { type TextStyle } from "@/content/typography"
import { textStyleToCss } from "@/content/typography"

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  titleStyle?: TextStyle
  subtitleStyle?: TextStyle
  badgeStyle?: TextStyle
  trustedCompaniesStyle?: TextStyle
  className?: string
}

export function AnimatedTestimonials({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it. See what developers and companies have to say about our starter template.",
  badgeText = "Trusted by developers",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by developers from companies worldwide",
  titleStyle,
  subtitleStyle,
  badgeStyle,
  trustedCompaniesStyle,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Refs for scroll animations
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Auto rotate testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} id="testimonials" className={`py-24 overflow-hidden bg-transparent ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-16 w-full lg:grid-cols-2 lg:gap-24 items-center"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="space-y-6">
              {badgeText && (
                <div 
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#837FFB]/10 border border-[#837FFB]/20 text-[#837FFB]"
                  style={textStyleToCss(badgeStyle)}
                >
                  <Star className="mr-2 h-3.5 w-3.5 fill-[#837FFB]" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] text-white"
                style={textStyleToCss(titleStyle)}
              >
                {title}
              </h2>

              <p 
                className="max-w-[600px] text-white/50 text-lg md:text-xl leading-relaxed"
                style={textStyleToCss(subtitleStyle)}
              >
                {subtitle}
              </p>

              <div className="flex items-center gap-3 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "w-10 bg-[#837FFB]" : "w-2 bg-white/10"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div variants={itemVariants} className="relative h-[450px] md:h-[500px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div className="bg-[#837FFB]/10 backdrop-blur-3xl border border-[#837FFB]/40 shadow-[0_40px_100px_rgba(131,127,251,0.25),inset_0_0_40px_rgba(131,127,251,0.1)] rounded-[32px] p-8 md:p-12 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#837FFB]/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#837FFB]/5 blur-[80px] -ml-32 -mb-32 rounded-full" />
                  
                  <div className="relative z-10 mb-6 flex gap-2">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-[#837FFB] text-[#837FFB]" />
                      ))}
                  </div>

                  <div className="relative mb-6 flex-1">
                    <Quote className="absolute -top-2 -left-2 h-10 w-10 text-[#837FFB]/10 rotate-180" />
                    <p className="relative z-10 text-xl md:text-2xl font-medium leading-[1.6] text-white/90">
                      "{testimonial.content}"
                    </p>
                  </div>

                  <Separator className="my-6 bg-white/10" />

                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-white/10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
                      <AvatarFallback className="bg-[#837FFB]/20 text-[#837FFB] font-bold">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-white text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-white/40">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-xl bg-[#837FFB]/5 blur-xl"></div>
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-xl bg-[#837FFB]/5 blur-xl"></div>
          </motion.div>
        </motion.div>

        {/* Logo cloud */}
        {trustedCompanies.length > 0 && (
          <motion.div variants={itemVariants} initial="hidden" animate={controls} className="mt-32 text-center pt-20 border-t border-white/5">
            <h3 
              className="text-xs font-bold uppercase tracking-widest text-[#837FFB]/60 mb-12"
              style={textStyleToCss(trustedCompaniesStyle)}
            >
              {trustedCompaniesTitle}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
              {trustedCompanies.map((company) => (
                <div key={company} className="text-2xl md:text-3xl font-bold font-display text-[#837FFB]/30 hover:text-[#837FFB] transition-all cursor-default">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
