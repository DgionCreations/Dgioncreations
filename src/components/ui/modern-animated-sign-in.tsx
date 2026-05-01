import {
  memo,
  ReactNode,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==================== Input ==================== */
export const Input = memo(
  forwardRef(function Input(
    { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) {
    const radius = 100;
    const [visible, setVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent<HTMLDivElement>) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    };

    return (
      <motion.div
        style={{
          background: useMotionTemplate`radial-gradient(${
            visible ? radius + "px" : "0px"
          } circle at ${mouseX}px ${mouseY}px, #837FFB, transparent 80%)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md border-none bg-zinc-900/80 px-3 py-2 text-sm text-white transition duration-400 placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-[#837FFB]/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-[0px_0px_1px_1px_#404040]",
            className
          )}
          {...props}
        />
      </motion.div>
    );
  })
);
(Input as any).displayName = "Input";

/* ==================== BoxReveal ==================== */
type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
};

export const BoxReveal = memo(function BoxReveal({
  children,
  width = "fit-content",
  boxColor,
  duration,
  overflow = "hidden",
  position = "relative",
  className,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position as "relative" | "absolute" | "fixed" | "sticky" | "static",
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{ hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? "#837FFB",
          borderRadius: 4,
        }}
      />
    </section>
  );
});

/* ==================== Ripple ==================== */
type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

export const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = "",
}: RippleProps) {
  return (
    <section
      className={`absolute inset-0 flex items-center justify-center [mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        return (
          <span
            key={i}
            className="absolute animate-ripple rounded-full bg-[#837FFB]/10 border"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay,
              borderStyle,
              borderWidth: 1,
              borderColor: `rgba(131,127,251,${0.05 + i * 0.05})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </section>
  );
});

/* ==================== OrbitingCircles ==================== */
type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

export const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg className="pointer-events-none absolute inset-0 size-full">
          <circle className="stroke-white/10 stroke-1" cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      )}
      <section
        style={
          {
            "--duration": duration,
            "--radius": radius,
            "--delay": -delay,
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-white/5 [animation-delay:calc(var(--delay)*1000ms)]",
          reverse && "[animation-direction:reverse]",
          className
        )}
      >
        {children}
      </section>
    </>
  );
});

/* ==================== TechOrbitDisplay ==================== */
type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactNode;
};

export const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = "Let's Connect",
}: {
  iconsArray: IconConfig[];
  text?: string;
}) {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-[#837FFB]/40 bg-clip-text text-center text-5xl md:text-6xl font-bold leading-tight text-transparent">
        {text}
      </span>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

/* ==================== Label ==================== */
export const Label = memo(function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

/* ==================== BottomGradient ==================== */
export const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-[#837FFB] to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-[#5B57F5] to-transparent" />
  </>
);

/* ==================== AnimatedForm ==================== */
type FieldType = "text" | "email" | "password" | "textarea";
type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  rows?: number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type Errors = Record<string, string>;

export const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  errorField,
  onSubmit,
  goTo,
}: AnimatedFormProps) {
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setVisible(!visible);

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const current: Errors = {};
    fields.forEach((field) => {
      const el = (event.target as HTMLFormElement).elements.namedItem(field.label) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      const value = el?.value ?? "";
      if (field.required && !value.trim()) current[field.label] = `${field.label} is required`;
      if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value))
        current[field.label] = "Invalid email address";
    });
    return current;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);
    if (Object.keys(formErrors).length === 0) {
      setErrors({});
      onSubmit(event);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className="max-md:w-full flex flex-col gap-4 w-96 mx-auto">
      <BoxReveal boxColor="#837FFB" duration={0.3}>
        <h2 className="font-bold text-3xl text-white">{header}</h2>
      </BoxReveal>

      {subHeader && (
        <BoxReveal boxColor="#837FFB" duration={0.3} className="pb-2">
          <p className="text-neutral-300 text-sm max-w-sm">{subHeader}</p>
        </BoxReveal>
      )}

      <form onSubmit={handleSubmit}>
        <section className="grid grid-cols-1 mb-4 gap-3">
          {fields.map((field) => (
            <section key={field.label} className="flex flex-col gap-2">
              <BoxReveal boxColor="#837FFB" duration={0.3}>
                <Label htmlFor={field.label}>
                  {field.label}
                  {field.required && <span className="text-[#837FFB]"> *</span>}
                </Label>
              </BoxReveal>

              <BoxReveal
                width="100%"
                boxColor="#837FFB"
                duration={0.3}
                className="flex flex-col space-y-2 w-full"
              >
                <section className="relative">
                  {field.type === "textarea" ? (
                    <motion.div className="group/input rounded-lg p-[2px] transition duration-300">
                      <textarea
                        id={field.label}
                        name={field.label}
                        placeholder={field.placeholder}
                        rows={field.rows ?? 4}
                        onChange={field.onChange}
                        className="flex w-full rounded-md border-none bg-zinc-900/80 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-[#837FFB]/60 focus-visible:outline-none shadow-[0px_0px_1px_1px_#404040] resize-none"
                      />
                    </motion.div>
                  ) : (
                    <Input
                      type={
                        field.type === "password"
                          ? visible
                            ? "text"
                            : "password"
                          : field.type
                      }
                      id={field.label}
                      name={field.label}
                      placeholder={field.placeholder}
                      onChange={field.onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                    />
                  )}

                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-white/70"
                    >
                      {visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  )}
                </section>

                <section className="h-4">
                  {errors[field.label] && (
                    <p className="text-red-400 text-xs">{errors[field.label]}</p>
                  )}
                </section>
              </BoxReveal>
            </section>
          ))}
        </section>

        {errorField && <p className="text-red-400 text-sm mb-4">{errorField}</p>}

        <BoxReveal width="100%" boxColor="#837FFB" duration={0.3} overflow="visible">
          <button
            className="bg-gradient-to-br relative group/btn from-[#837FFB] to-[#5B57F5] block w-full text-white rounded-md h-11 font-medium shadow-[0_0_25px_rgba(131,127,251,0.35)] hover:shadow-[0_0_35px_rgba(131,127,251,0.6)] outline-hidden hover:cursor-pointer transition-shadow"
            type="submit"
          >
            {submitButton} &rarr;
            <BottomGradient />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal boxColor="#837FFB" duration={0.3}>
            <section className="mt-4 text-center hover:cursor-pointer">
              <button
                type="button"
                className="text-sm text-[#837FFB] hover:text-white hover:cursor-pointer outline-hidden transition-colors"
                onClick={goTo}
              >
                {textVariantButton}
              </button>
            </section>
          </BoxReveal>
        )}
      </form>
    </section>
  );
});