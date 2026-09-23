import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getImageUrl } from "../lib/api";
import type { NavbarColumn, SiteSettings } from "../types/api";

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

interface NavbarProps {
  siteSettings?: SiteSettings | null;
  columns?: NavbarColumn[] | null;
  isLoading?: boolean;
}

const getPathnameFromUrl = (url: string) => {
  const path = url.split("#")[0]?.trim() || "/";
  return path.startsWith("/") ? path : `/${path}`;
};

const isColumnActive = (column: NavbarColumn, pathname: string) => {
  const paths = [
    getPathnameFromUrl(column.url),
    ...column.dropdownItems.map((item) => getPathnameFromUrl(item.url)),
  ];

  if (pathname === "/") {
    return paths.some((path) => path === "/");
  }

  return paths.some(
    (path) => path !== "/" && (pathname === path || pathname.startsWith(`${path}/`)),
  );
};

const Navbar = ({
  siteSettings,
  columns = [],
  isLoading = false,
}: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const navbarRef = useRef<HTMLElement>(null);
  const hospitalName = siteSettings?.hospitalName || "Ali Hospital";
  const logoSrc = siteSettings?.logo
    ? getImageUrl(siteSettings.logo)
    : "./h-logo.svg";
  const emergencyPhone =
    siteSettings?.emergencyPhone ||
    siteSettings?.phone ||
    "+011 3253 4567";
  const menuColumns = columns ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setMobileDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (isLoading || !location.hash) return;

    const targetId = location.hash.replace(/^#/, "");
    if (!targetId) return;

    let attempts = 0;
    const maxAttempts = 30;

    const tryScroll = () => {
      const element = document.getElementById(targetId);
      if (!element) {
        attempts += 1;
        if (attempts < maxAttempts) {
          window.setTimeout(tryScroll, 100);
        }
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timeoutId = window.setTimeout(tryScroll, 50);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.hash, isLoading]);

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdown((current) => (current === label ? null : label));
  };

  const handleLinkNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileDropdown(null);

    const [rawPath = "/", hash] = url.split("#");
    const targetPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

    if (location.pathname === targetPath && hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `${targetPath}#${hash}`);
        return;
      }
    }

    navigate(hash ? `${targetPath}#${hash}` : targetPath);
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] items-center rounded-2xl bg-white px-4 py-3 shadow-[0_0_35px_rgba(124,58,237,0.15)] sm:px-5 lg:px-6">
          <div className="h-[40px] w-[40px] animate-pulse rounded-lg bg-gray-200 lg:h-[50px] lg:w-[50px]" />

          <div className="ml-auto hidden min-w-0 items-center gap-2 xl:flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-16 animate-pulse rounded bg-gray-200 2xl:w-20"
              />
            ))}
          </div>

          <div className="ml-3 hidden shrink-0 items-center gap-1.5 xl:flex">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="ml-auto h-10 w-10 animate-pulse rounded-lg bg-gray-200 xl:hidden" />
        </div>
      </nav>
    );
  }

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center rounded-2xl bg-white px-4 py-3 shadow-[0_0_35px_rgba(124,58,237,0.15)] sm:px-5 lg:px-6">
        <Link
          to="/"
          aria-label={`${hospitalName} home`}
          className="flex shrink-0 items-center"
        >
          <img
            src={logoSrc}
            alt={hospitalName}
            className="w-[40px] sm:w-[40px] lg:w-[50px]"
          />
        </Link>

        <div className="ml-auto hidden min-w-0 items-center xl:flex">
          {menuColumns.map((menu) => {
            const isOpen = activeDropdown === menu.id;
            const isActive = isColumnActive(menu, location.pathname);
            const hasLinks = menu.dropdownItems.length > 0;

            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() =>
                  hasLinks ? setActiveDropdown(menu.id) : undefined
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {hasLinks ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown(isOpen ? null : menu.id)
                    }
                    className={`group flex cursor-pointer items-center gap-1 whitespace-nowrap px-2 py-3 text-[13px] font-medium transition-colors duration-200 2xl:px-2.5 2xl:text-[13px] ${
                      isActive
                        ? "text-[#147bd5]"
                        : "text-gray-700 hover:text-[#147bd5]"
                    }`}
                    aria-expanded={isOpen}
                  >
                    {menu.label}

                    <ChevronDown
                      size={13}
                      strokeWidth={2}
                      className={`shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 text-[#147bd5]"
                          : "group-hover:text-[#147bd5]"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={menu.url || "/"}
                    className={`flex items-center gap-1 whitespace-nowrap px-2 py-3 text-[13px] font-medium transition-colors duration-200 2xl:px-2.5 2xl:text-[13px] ${
                      isActive
                        ? "text-[#147bd5]"
                        : "text-gray-700 hover:text-[#147bd5]"
                    }`}
                  >
                    {menu.label}
                  </Link>
                )}

                <AnimatePresence>
                  {isOpen && hasLinks && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-0 top-full z-50 min-w-[210px] pt-2"
                    >
                      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-xl shadow-[#147bd5]/60">
                        {menu.dropdownItems.map((item) => (
                          <a
                            key={item.id}
                            href={item.url}
                            onClick={(event) =>
                              handleLinkNavigation(event, item.url)
                            }
                            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#147bd5]/10 hover:text-[#147bd5]"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="ml-3 hidden shrink-0 items-center gap-1.5 xl:flex">
          <a
            href={`tel:${emergencyPhone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#147bd5] px-3 py-2.5 text-xs font-semibold text-[#147bd5] transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white 2xl:px-4 2xl:text-sm"
          >
            <Phone size={15} />
            Emergency
          </a>

          <Link
            to="/contact"
            className="whitespace-nowrap rounded-lg bg-[#147bd5] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#0a6cc2] hover:shadow-lg hover:shadow-[#147bd5]/20 2xl:px-5 2xl:text-sm"
          >
            Contact
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="ml-auto rounded-lg p-2 text-gray-700 transition-colors hover:bg-[#147bd5]/10 hover:text-[#147bd5] xl:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 w-full max-w-[1600px] overflow-hidden rounded-2xl bg-white p-4 shadow-xl shadow-[#147bd5]/50 xl:hidden"
          >
            <div className="flex flex-col">
              {menuColumns.map((menu) => {
                const isOpen = mobileDropdown === menu.id;
                const isActive = isColumnActive(menu, location.pathname);
                const hasLinks = menu.dropdownItems.length > 0;

                return (
                  <div key={menu.id}>
                    {hasLinks ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(menu.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors ${
                            isActive
                              ? "text-[#147bd5]"
                              : "text-gray-700 hover:bg-[#147bd5]/10 hover:text-[#147bd5]"
                          }`}
                        >
                          <span>{menu.label}</span>

                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-[#147bd5]" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-3 border-l border-[#147bd5] py-1 pl-3">
                                {menu.dropdownItems.map((item) => (
                                  <a
                                    key={item.id}
                                    href={item.url}
                                    onClick={(event) =>
                                      handleLinkNavigation(event, item.url)
                                    }
                                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-[#147bd5]/10 hover:text-[#147bd5]"
                                  >
                                    {item.label}
                                  </a>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={menu.url || "/"}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex w-full items-center rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? "text-[#147bd5]"
                            : "text-gray-700 hover:bg-[#147bd5]/10 hover:text-[#147bd5]"
                        }`}
                      >
                        {menu.label}
                      </Link>
                    )}
                  </div>
                );
              })}

              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-4">
                <a
                  href={`tel:${emergencyPhone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#147bd5] px-4 py-3 text-sm font-semibold text-[#147bd5] transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Phone size={16} />
                  Emergency
                </a>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-[#147bd5] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0a6cc2]"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
