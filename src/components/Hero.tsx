import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      className="relative min-h-[680px] overflow-hidden bg-cover bg-center bg-no-repeat lg:min-h-[700px]"
      style={{
        backgroundImage:
          "url('./hero.jpg')",
      }}
    >
      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[680px] w-full max-w-[1600px] items-center px-6 pb-32 pt-20 sm:px-10 lg:min-h-[700px] lg:px-14 xl:px-20">
        <div className="w-full max-w-[570px]">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[42px] leading-[1.08] tracking-[-1.5px] text-[#071535] sm:text-[50px] lg:text-[56px] xl:text-[50px]"
          >
            <span className="block font-bold">
              Transforming Lives,
            </span>

            <span className="block font-normal">
              Restoring Your Health
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="mt-5 max-w-[520px] text-sm leading-6 text-slate-600 sm:text-[15px]"
          >
            Embrace a world of comprehensive healthcare where your
            well-being takes center stage. At Meca, we're dedicated to
            providing you with personalized and compassionate medical
            services.
          </motion.p>

          {/* Learn More Button */}
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200/50 transition-colors duration-200 hover:bg-violet-600"
          >
            <span>Learn More</span>
            <ArrowRight size={16} strokeWidth={2} />
          </motion.a>
        </div>
      </div>

      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.45,
          ease: "easeOut",
        }}
        className="absolute bottom-[72px] left-0 z-20 flex w-[560px] max-w-[calc(100%-24px)] items-center rounded-r-[38px] bg-white py-4 pl-8 pr-3 shadow-[0_10px_35px_rgba(0,0,0,0.06)] sm:pl-10"
      >
        <div className="flex-1">
          <h2 className="text-[13px] font-semibold tracking-[0.5px] text-[#071535]">
            FIND A LOCATION NEARBY
          </h2>

          <p className="mt-1 max-w-[380px] text-[11px] leading-4 text-slate-500">
            Hospa medical center operates more than 120 locations. Find the
            nearest...
          </p>
        </div>

        {/* Location button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-white transition-colors duration-200 hover:bg-sky-500"
          aria-label="Find a nearby location"
        >
          <MapPin size={17} strokeWidth={2} />
        </motion.button>
      </motion.div>

      {/* Bottom white curved edge */}
      <div className="absolute bottom-0 left-0 z-10 h-[38px] w-full rounded-t-[55px] bg-white sm:h-[45px] lg:h-[50px]" />
    </section>
  );
};

export default Hero;