
import BookingModal from "../components/BookingModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBus,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaArrowRight,
    FaExchangeAlt,
    FaTicketAlt,
    FaShieldAlt,
    FaClock,
    FaHeadset,
    FaStar,
    FaRoute,
    FaCompass,
    FaBolt,
    FaBars,
    FaTimes,
    FaInfoCircle,
} from "react-icons/fa";

// POPULAR ROUTES
const popularRoutes = [
    {
        from: "Dhaka",
        to: "Chattogram",
        fromCode: "DHK",
        toCode: "CGP",
        price: "৳ 850",
        duration: "5h 30m",
        departure: "10:30 PM",
        busType: "AC / Non-AC",
        tag: "MOST POPULAR",
        tagColor: "orange",
    },
    {
        from: "Dhaka",
        to: "Cox's Bazar",
        fromCode: "DHK",
        toCode: "CXB",
        price: "৳ 1,250",
        duration: "9h 00m",
        departure: "09:00 PM",
        busType: "AC / Sleeper",
        tag: "BEACH ESCAPE",
        tagColor: "blue",
    },
    {
        from: "Chattogram",
        to: "Sylhet",
        fromCode: "CGP",
        toCode: "ZYL",
        price: "৳ 950",
        duration: "7h 00m",
        departure: "08:30 PM",
        busType: "AC / Non-AC",
        tag: "EXPLORE MORE",
        tagColor: "purple",
    },
];

const features = [
    {
        icon: <FaShieldAlt />,
        title: "Secure Booking",
        description:
            "A smooth and secure booking experience from start to finish.",
    },
    {
        icon: <FaClock />,
        title: "Save Your Time",
        description:
            "Find your preferred bus and book your seat in just a few steps.",
    },
    {
        icon: <FaHeadset />,
        title: "Travel Support",
        description:
            "A simple and convenient experience for every journey.",
    },
];

const navigation = [
    { name: "Home", link: "#top" },
    { name: "Destinations", link: "#routes" },
    { name: "Why Destini", link: "#features" },
    { name: "About Us", link: "#about" },
];

const locations = [
    "Dhaka",
    "Chattogram",
    "Cox's Bazar",
    "Sylhet",
    "Rajshahi",
    "Khulna",
];

function Home() {
    const navigate = useNavigate();

    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const [activeLink, setActiveLink] = useState("Home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [tripType, setTripType] = useState("one-way");
    const [from, setFrom] = useState("Dhaka");
    const [to, setTo] = useState("Chattogram");
    const [date, setDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [passengers, setPassengers] = useState("1 Passenger");
    const [searchMessage, setSearchMessage] = useState("");
    const [messageType, setMessageType] = useState("error");

    // Convert passenger selection into a number
    const passengerCount = Number.parseInt(passengers, 10) || 1;

    // Local date
    const today = new Date();

    const minDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    // Navigation handler
    const handleNavigation = (name) => {
        setActiveLink(name);
        setMobileMenuOpen(false);
    };

    // Active navigation while scrolling
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                { name: "Home", id: "top" },
                { name: "Destinations", id: "routes" },
                { name: "Why Destini", id: "features" },
                { name: "About Us", id: "about" },
            ];

            let currentSection = "Home";

            sections.forEach((section) => {
                const element = document.getElementById(section.id);

                if (
                    element &&
                    element.getBoundingClientRect().top <= 180
                ) {
                    currentSection = section.name;
                }
            });

            setActiveLink(currentSection);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Lock background scrolling while booking modal is open
    useEffect(() => {
        if (!isBookingOpen) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isBookingOpen]);

    // Swap locations
    const swapLocations = () => {
        setFrom(to);
        setTo(from);
        setSearchMessage("");
    };

    // Trip type
    const handleTripType = (type) => {
        setTripType(type);
        setSearchMessage("");

        if (type === "one-way") {
            setReturnDate("");
        }
    };

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();

        setSearchMessage("");

        if (from === to) {
            setMessageType("error");
            setSearchMessage(
                "Departure and destination cannot be the same."
            );
            return;
        }

        if (!date) {
            setMessageType("error");
            setSearchMessage("Please select your journey date.");
            return;
        }

        if (date < minDate) {
            setMessageType("error");
            setSearchMessage("Please select a valid journey date.");
            return;
        }

        if (tripType === "round-trip") {
            if (!returnDate) {
                setMessageType("error");
                setSearchMessage("Please select your return date.");
                return;
            }

            if (returnDate < date) {
                setMessageType("error");
                setSearchMessage(
                    "Return date cannot be before journey date."
                );
                return;
            }
        }

        // Open booking popup
        setIsBookingOpen(true);
    };

    // Select a route from Popular Routes
    const handleRouteBooking = (route) => {
        setFrom(route.from);
        setTo(route.to);
        setSearchMessage("");

        document.getElementById("booking")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    // Navigate to Passenger Details
    const handleMyBookings = () => {
        setMobileMenuOpen(false);
        navigate("/passenger-details");
    };

    return (
        <main
            id="top"
            className="min-h-screen overflow-x-hidden bg-[#0b1020] text-white"
        >
            {/* FLOATING NAVBAR */}
            <header className="fixed left-0 top-4 z-[999] w-full px-3 sm:top-5 sm:px-4">
                <nav className="relative mx-auto flex h-[62px] max-w-6xl items-center justify-between rounded-full border border-white/15 bg-[#0b1020]/90 px-4 shadow-[0_8px_35px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:h-[66px] sm:px-7">

                    {/* LOGO */}
                    <a
                        href="#top"
                        onClick={() => handleNavigation("Home")}
                        className="group flex shrink-0 items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff956f] to-[#f45d35] text-white shadow-lg shadow-orange-500/20 transition duration-300 group-hover:rotate-[-8deg]">
                            <FaCompass className="text-lg" />
                        </div>

                        <div className="leading-none">
                            <h1 className="text-[15px] font-extrabold tracking-[0.10em] text-white">
                                DESTINI
                            </h1>
                            <p className="mt-1 text-[8px] font-bold tracking-[0.32em] text-[#ff8058]">
                                TRAVEL
                            </p>
                        </div>
                    </a>

                    <div className="mx-5 hidden h-8 w-px bg-white/15 lg:block" />

                    {/* DESKTOP NAVIGATION */}
                    <div className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.link}
                                onClick={() =>
                                    handleNavigation(item.name)
                                }
                                className={`group relative whitespace-nowrap py-2 text-[12px] font-semibold tracking-wide transition-all duration-300 ${
                                    activeLink === item.name
                                        ? "text-[#ff8058]"
                                        : "text-slate-300 hover:text-white"
                                }`}
                            >
                                {item.name}

                                <span
                                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#ff8058] transition-all duration-300 ${
                                        activeLink === item.name
                                            ? "w-full opacity-100"
                                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                                    }`}
                                />
                            </a>
                        ))}
                    </div>

                    {/* DESKTOP MY BOOKINGS */}
                    <button
                        type="button"
                        onClick={handleMyBookings}
                        className="hidden shrink-0 items-center gap-2 rounded-full border border-[#ff8058]/30 bg-[#ff8058]/10 px-4 py-2.5 text-xs font-bold text-[#ff956f] transition-all duration-300 hover:border-[#ff8058] hover:bg-[#ff8058] hover:text-[#111827] lg:flex"
                    >
                        <FaTicketAlt className="text-sm" />
                        My Bookings
                        <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                    </button>

                    {/* MOBILE BUTTONS */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            onClick={handleMyBookings}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ff8058]/30 bg-[#ff8058]/10 text-[#ff956f] transition hover:bg-[#ff8058] hover:text-[#111827]"
                            aria-label="My Bookings"
                        >
                            <FaTicketAlt />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                            aria-label={
                                mobileMenuOpen
                                    ? "Close menu"
                                    : "Open menu"
                            }
                            aria-expanded={mobileMenuOpen}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white transition hover:border-[#ff8058] hover:text-[#ff8058]"
                        >
                            {mobileMenuOpen ? (
                                <FaTimes className="text-base" />
                            ) : (
                                <FaBars className="text-base" />
                            )}
                        </button>
                    </div>

                    {/* MOBILE DROPDOWN */}
                    <div
                        className={`absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-[22px] border border-white/10 bg-[#111a2d] shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
                            mobileMenuOpen
                                ? "visible translate-y-0 opacity-100"
                                : "invisible pointer-events-none -translate-y-2 opacity-0"
                        }`}
                    >
                        <div className="p-3">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.link}
                                    onClick={() =>
                                        handleNavigation(item.name)
                                    }
                                    className={`mb-1 flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                                        activeLink === item.name
                                            ? "bg-orange-400/10 text-[#ff8058]"
                                            : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                                >
                                    {item.name}

                                    {activeLink === item.name && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff8058]" />
                                    )}
                                </a>
                            ))}

                            <div className="my-2 border-t border-white/10" />

                            <button
                                type="button"
                                onClick={handleMyBookings}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff8058] px-4 py-3.5 text-sm font-bold text-[#171421] transition hover:bg-[#ff9876]"
                            >
                                <FaTicketAlt />
                                My Bookings
                                <FaArrowRight className="text-xs" />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* NAVBAR SPACING */}
            <div className="h-[100px] sm:h-[110px]" />

            {/* HERO SECTION */}
            <section className="relative px-5 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-20">
                <div className="pointer-events-none absolute -right-40 top-0 h-[400px] w-[400px] rounded-full bg-orange-500/[0.08] blur-[120px]" />
                <div className="pointer-events-none absolute -left-40 top-40 h-[300px] w-[300px] rounded-full bg-blue-500/[0.08] blur-[120px]" />

                <div className="relative mx-auto max-w-7xl">
                    <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">

                        {/* HERO CONTENT */}
                        <div className="lg:pl-14">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.08] px-4 py-2 text-[10px] font-semibold tracking-wide text-orange-300 sm:text-xs">
                                <FaBolt />
                                YOUR JOURNEY STARTS HERE
                            </div>

                            <h2 className="max-w-2xl text-[38px] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-5xl lg:text-[58px]">
                                Find your next
                                <span className="block text-[#ff8058]">
                                    destination.
                                </span>
                            </h2>

                            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:mt-6 sm:text-base sm:leading-8">
                                Every journey has a destination. Discover
                                your route, find your perfect seat, and
                                make every trip memorable with Destini
                                Travel.
                            </p>

                            {/* HERO BUTTONS */}
                            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
                                <a
                                    href="#booking"
                                    className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-[#ff8058] px-4 py-3.5 font-bold text-[#171421] shadow-xl shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-[#ff9876] sm:gap-4 sm:px-6 sm:py-4"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/10">
                                        <FaTicketAlt />
                                    </span>

                                    <span>
                                        <span className="block text-xs sm:text-sm">
                                            Book Your Ticket
                                        </span>
                                        <span className="mt-0.5 block text-[9px] font-medium opacity-70">
                                            START YOUR JOURNEY
                                        </span>
                                    </span>

                                    <FaArrowRight className="ml-1 text-xs transition group-hover:translate-x-1 sm:ml-2" />

                                    <span className="absolute -right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#0b1020]" />
                                </a>

                                <a
                                    href="#routes"
                                    className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3.5 text-xs font-semibold text-white transition hover:border-orange-400 hover:text-orange-400 sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    Explore Routes
                                    <FaArrowRight className="text-xs" />
                                </a>
                            </div>

                            {/* TRUST INFO */}
                            <div className="mt-9 grid max-w-md grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:gap-6 sm:pt-7">
                                <div>
                                    <h3 className="text-xl font-bold sm:text-2xl">
                                        Easy
                                    </h3>
                                    <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                                        Booking process
                                    </p>
                                </div>

                                <div className="border-l border-white/10 pl-4 sm:pl-6">
                                    <h3 className="text-xl font-bold sm:text-2xl">
                                        Smart
                                    </h3>
                                    <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                                        Seat selection
                                    </p>
                                </div>

                                <div className="border-l border-white/10 pl-4 sm:pl-6">
                                    <h3 className="text-xl font-bold sm:text-2xl">
                                        Simple
                                    </h3>
                                    <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                                        Travel experience
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* HERO VISUAL */}
                        <div className="relative mx-auto w-full max-w-[500px]">
                            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-dashed border-orange-400/30 sm:-right-8 sm:-top-8 sm:h-40 sm:w-40" />
                            <div className="absolute -bottom-6 -left-5 h-32 w-32 rounded-full border border-dashed border-blue-400/20 sm:-bottom-10 sm:-left-8 sm:h-40 sm:w-40" />

                            <div className="relative rounded-[26px] border border-white/10 bg-[#151d31] p-4 shadow-2xl shadow-black/30 sm:rounded-[32px] sm:p-6">

                                <div className="mb-5 flex items-center justify-between sm:mb-6">
                                    <div>
                                        <p className="text-[10px] text-slate-500 sm:text-xs">
                                            THE DESTINI EXPERIENCE
                                        </p>
                                        <h3 className="mt-1 text-lg font-bold sm:text-xl">
                                            Your next journey
                                        </h3>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10 text-lg text-orange-400 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">
                                        <FaRoute />
                                    </div>
                                </div>

                                {/* ROUTE VISUAL */}
                                <div className="rounded-2xl bg-[#202b42] p-4 sm:p-7">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-[9px] tracking-widest text-slate-500 sm:text-[10px]">
                                                FROM
                                            </p>
                                            <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                                                DHK
                                            </h3>
                                            <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                                                Dhaka
                                            </p>
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col items-center px-2 sm:px-3">
                                            <div className="mb-2 text-[9px] text-orange-400 sm:text-[10px]">
                                                05h 30m
                                            </div>
                                            <div className="relative flex w-full items-center">
                                                <div className="h-px w-full border-t border-dashed border-orange-400/60" />
                                                <FaBus className="absolute left-1/2 -translate-x-1/2 bg-[#202b42] px-1 text-xl text-orange-400 sm:text-2xl" />
                                            </div>
                                            <div className="mt-2 text-[9px] text-slate-500 sm:text-[10px]">
                                                Direct route
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[9px] tracking-widest text-slate-500 sm:text-[10px]">
                                                TO
                                            </p>
                                            <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                                                CGP
                                            </h3>
                                            <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                                                Chattogram
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3">
                                        <div className="rounded-xl bg-white/[0.05] p-3">
                                            <p className="text-[9px] text-slate-500 sm:text-[10px]">
                                                JOURNEY TYPE
                                            </p>
                                            <p className="mt-1 text-xs font-semibold sm:text-sm">
                                                Intercity
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-white/[0.05] p-3">
                                            <p className="text-[9px] text-slate-500 sm:text-[10px]">
                                                EXPERIENCE
                                            </p>
                                            <p className="mt-1 text-xs font-semibold sm:text-sm">
                                                Comfort Ride
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CLICKABLE COUPON TICKET */}
                                <a
                                    href="#top"
                                    onClick={() =>
                                        handleNavigation("Home")
                                    }
                                    className="group relative mt-4 flex overflow-hidden rounded-2xl bg-[#ff8058] text-[#1a1720] transition duration-300 hover:-translate-y-1 hover:bg-[#ff9876] sm:mt-5"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3 p-3 sm:p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10 text-lg sm:h-11 sm:w-11 sm:text-xl">
                                            <FaTicketAlt />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[9px] font-bold tracking-widest opacity-60 sm:text-[10px]">
                                                YOUR NEXT TRIP
                                            </p>
                                            <h4 className="mt-1 text-xs font-black sm:text-sm">
                                                Starts with DESTINI
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center border-l-2 border-dashed border-black/25 px-4">
                                        <div className="absolute -left-2.5 top-[-10px] h-5 w-5 rounded-full bg-[#151d31]" />
                                        <div className="absolute -left-2.5 bottom-[-10px] h-5 w-5 rounded-full bg-[#151d31]" />
                                        <FaArrowRight className="text-lg transition-transform group-hover:translate-x-1 sm:text-xl" />
                                    </div>
                                </a>

                                {/* FLOATING LABEL */}
                                <div className="absolute -left-5 top-1/3 hidden rounded-2xl border border-white/10 bg-[#202b42] p-4 shadow-xl sm:block">
                                    <div className="flex items-center gap-2">
                                        <FaStar className="text-sm text-orange-400" />
                                        <span className="text-xs font-bold">
                                            Travel made simple
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Your destination awaits.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BOOKING SEARCH SECTION */}
            <section
                id="booking"
                className="relative z-10 scroll-mt-28 px-5 pb-16 lg:px-8 lg:pb-20"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-[26px] border border-white/10 bg-[#151d31] p-5 shadow-2xl shadow-black/20 sm:rounded-[28px] sm:p-8">

                        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.2em] text-orange-400 sm:text-xs">
                                    PLAN YOUR TRIP
                                </p>
                                <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                                    Where would you like to go?
                                </h2>
                            </div>

                            {/* TRIP TYPE */}
                            <div className="flex w-fit rounded-full bg-[#0b1020] p-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleTripType("one-way")
                                    }
                                    className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                                        tripType === "one-way"
                                            ? "bg-orange-400 text-[#151421]"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    One Way
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleTripType("round-trip")
                                    }
                                    className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                                        tripType === "round-trip"
                                            ? "bg-orange-400 text-[#151421]"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    Round Trip
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSearch}>
                            <div
                                className={`grid gap-3 sm:grid-cols-2 ${
                                    tripType === "round-trip"
                                        ? "lg:grid-cols-3"
                                        : "lg:grid-cols-4"
                                }`}
                            >
                                {/* FROM */}
                                <div className="relative rounded-2xl border border-white/10 bg-[#0e1629] p-4 transition focus-within:border-orange-400/70">
                                    <label className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500">
                                        <FaMapMarkerAlt className="text-orange-400" />
                                        FROM
                                    </label>

                                    <select
                                        value={from}
                                        onChange={(e) => {
                                            setFrom(e.target.value);
                                            setSearchMessage("");
                                        }}
                                        className="w-full cursor-pointer bg-transparent text-sm font-bold text-white outline-none"
                                    >
                                        {locations.map((location) => (
                                            <option
                                                key={location}
                                                className="bg-[#151d31]"
                                                value={location}
                                            >
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* TO */}
                                <div className="relative rounded-2xl border border-white/10 bg-[#0e1629] p-4 transition focus-within:border-orange-400/70">
                                    <label className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500">
                                        <FaMapMarkerAlt className="text-orange-400" />
                                        TO
                                    </label>

                                    <select
                                        value={to}
                                        onChange={(e) => {
                                            setTo(e.target.value);
                                            setSearchMessage("");
                                        }}
                                        className="w-full cursor-pointer bg-transparent text-sm font-bold text-white outline-none"
                                    >
                                        {locations.map((location) => (
                                            <option
                                                key={location}
                                                className="bg-[#151d31]"
                                                value={location}
                                            >
                                                {location}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={swapLocations}
                                        title="Swap locations"
                                        aria-label="Swap departure and destination"
                                        className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-orange-400/30 bg-[#ff8058] text-[#171421] transition hover:rotate-180"
                                    >
                                        <FaExchangeAlt className="text-xs" />
                                    </button>
                                </div>

                                {/* JOURNEY DATE */}
                                <div className="rounded-2xl border border-white/10 bg-[#0e1629] p-4 transition focus-within:border-orange-400/70">
                                    <label className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500">
                                        <FaCalendarAlt className="text-orange-400" />
                                        JOURNEY DATE
                                    </label>

                                    <input
                                        type="date"
                                        min={minDate}
                                        value={date}
                                        onChange={(e) => {
                                            setDate(e.target.value);

                                            if (
                                                returnDate &&
                                                e.target.value > returnDate
                                            ) {
                                                setReturnDate("");
                                            }

                                            setSearchMessage("");
                                        }}
                                        className="w-full bg-transparent text-sm font-bold text-white outline-none [color-scheme:dark]"
                                    />
                                </div>

                                {/* PASSENGERS */}
                                <div className="rounded-2xl border border-white/10 bg-[#0e1629] p-4 transition focus-within:border-orange-400/70">
                                    <label className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500">
                                        <FaUsers className="text-orange-400" />
                                        PASSENGERS
                                    </label>

                                    <select
                                        value={passengers}
                                        onChange={(e) =>
                                            setPassengers(e.target.value)
                                        }
                                        className="w-full cursor-pointer bg-transparent text-sm font-bold text-white outline-none"
                                    >
                                        <option className="bg-[#151d31]">
                                            1 Passenger
                                        </option>
                                        <option className="bg-[#151d31]">
                                            2 Passengers
                                        </option>
                                        <option className="bg-[#151d31]">
                                            3 Passengers
                                        </option>
                                        <option className="bg-[#151d31]">
                                            4 Passengers
                                        </option>
                                    </select>
                                </div>

                                {/* RETURN DATE */}
                                {tripType === "round-trip" && (
                                    <div className="rounded-2xl border border-white/10 bg-[#0e1629] p-4 transition focus-within:border-orange-400/70">
                                        <label className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500">
                                            <FaCalendarAlt className="text-orange-400" />
                                            RETURN DATE
                                        </label>

                                        <input
                                            type="date"
                                            min={date || minDate}
                                            value={returnDate}
                                            onChange={(e) => {
                                                setReturnDate(e.target.value);
                                                setSearchMessage("");
                                            }}
                                            className="w-full bg-transparent text-sm font-bold text-white outline-none [color-scheme:dark]"
                                        />
                                    </div>
                                )}

                                {/* SEARCH BUTTON */}
                                <button
                                    type="submit"
                                    className="group flex min-h-[78px] items-center justify-center gap-3 rounded-2xl bg-[#ff8058] px-6 text-sm font-black text-[#171421] transition duration-300 hover:-translate-y-1 hover:bg-[#ff9876] hover:shadow-xl hover:shadow-orange-500/20"
                                >
                                    <FaTicketAlt className="text-xl" />
                                    <span>Find Bus</span>
                                    <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                                </button>
                            </div>

                            {/* SEARCH FEEDBACK */}
                            {searchMessage && (
                                <div
                                    role="status"
                                    className={`mt-5 rounded-xl border p-4 text-sm ${
                                        messageType === "success"
                                            ? "border-green-400/20 bg-green-400/10 text-green-300"
                                            : "border-orange-400/20 bg-orange-400/10 text-orange-300"
                                    }`}
                                >
                                    {searchMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* POPULAR ROUTES */}
            <section
                id="routes"
                className="scroll-mt-28 px-5 py-20 lg:px-8 lg:py-24"
            >
                <div className="mx-auto max-w-7xl">

                    {/* SECTION HEADING */}
                    <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="h-[2px] w-8 bg-[#ff8058]" />
                                <span className="text-xs font-bold uppercase tracking-[3px] text-[#ff8058]">
                                    Explore Bangladesh
                                </span>
                            </div>

                            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Popular{" "}
                                <span className="text-[#ff8058]">
                                    Routes
                                </span>
                            </h2>

                            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
                                Discover popular destinations and plan
                                your next journey with comfort and
                                convenience.
                            </p>
                        </div>

                        <a
                            href="#booking"
                            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition hover:text-[#ff8058]"
                        >
                            Explore all routes
                            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    {/* ROUTE CARDS */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {popularRoutes.map((route, index) => (
                            <article
                                key={route.fromCode + route.toCode}
                                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#151d31] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff8058]/50 hover:shadow-[0_15px_45px_rgba(0,0,0,0.25)]"
                            >
                                {/* CARD BACKGROUND ACCENT */}
                                <div
                                    className={`pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-[70px] ${
                                        index === 0
                                            ? "bg-orange-500/10"
                                            : index === 1
                                                ? "bg-sky-500/10"
                                                : "bg-violet-500/10"
                                    }`}
                                />

                                <div className="relative">

                                    {/* CARD TOP */}
                                    <div className="mb-7 flex items-center justify-between">
                                        <span className="rounded-full border border-[#ff8058]/20 bg-[#ff8058]/10 px-3 py-1.5 text-[9px] font-bold tracking-[1.5px] text-[#ff9878]">
                                            {route.tag}
                                        </span>

                                        <span className="text-xs font-bold tracking-widest text-slate-600">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    {/* ROUTE DETAILS */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="mb-1 text-xs font-semibold tracking-widest text-slate-500">
                                                {route.fromCode}
                                            </p>

                                            <h3 className="text-lg font-semibold text-white">
                                                {route.from}
                                            </h3>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                Departure
                                            </p>
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col items-center px-2">
                                            <span className="mb-2 whitespace-nowrap text-[10px] text-slate-500">
                                                {route.duration}
                                            </span>

                                            <div className="relative flex w-full items-center">
                                                <div className="h-px w-full border-t border-dashed border-slate-500/60" />
                                                <FaBus className="absolute left-1/2 -translate-x-1/2 bg-[#151d31] px-1 text-xl text-[#ff8058]" />
                                            </div>

                                            <span className="mt-2 text-[9px] text-slate-500">
                                                Direct route
                                            </span>
                                        </div>

                                        <div className="min-w-0 text-right">
                                            <p className="mb-1 text-xs font-semibold tracking-widest text-slate-500">
                                                {route.toCode}
                                            </p>

                                            <h3 className="text-lg font-semibold text-white">
                                                {route.to}
                                            </h3>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                Arrival
                                            </p>
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="my-6 border-t border-dashed border-white/10" />

                                    {/* JOURNEY INFORMATION */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
                                                <FaClock className="text-sm text-[#ff8058]" />
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-slate-500">
                                                    Departure
                                                </p>
                                                <p className="mt-0.5 text-xs font-semibold text-slate-200">
                                                    {route.departure}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
                                                <FaShieldAlt className="text-sm text-[#ff8058]" />
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-slate-500">
                                                    Bus Type
                                                </p>
                                                <p className="mt-0.5 text-xs font-semibold text-slate-200">
                                                    {route.busType}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOTTOM */}
                                    <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                                        <div>
                                            <p className="text-[10px] text-slate-500">
                                                Starting from
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-[#ff8058]">
                                                {route.price}
                                                <span className="ml-1 text-[10px] font-medium text-slate-500">
                                                    / person
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRouteBooking(route)
                                            }
                                            className="group/btn inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ff8058] px-4 py-3 text-xs font-bold text-[#171421] transition hover:bg-[#ff9878]"
                                        >
                                            Book Now
                                            <FaArrowRight className="text-[10px] transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* DEMO NOTE */}
                    <p className="mt-7 text-center text-xs text-slate-500">
                        <FaInfoCircle className="mr-1 inline text-[#ff8058]" />
                        All fares and journey details are sample data for
                        demonstration purposes.
                    </p>
                </div>
            </section>

            {/* WHY DESTINI */}
            <section
                id="features"
                className="scroll-mt-28 px-5 py-16 lg:px-8 lg:py-20"
            >
                <div className="mx-auto max-w-7xl rounded-[28px] border border-white/[0.07] bg-[#121a2d] px-6 py-12 sm:rounded-[32px] sm:px-10 sm:py-14 lg:px-14">

                    <div className="mx-auto mb-12 max-w-xl text-center">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-orange-400 sm:text-xs">
                            THE DESTINI DIFFERENCE
                        </p>

                        <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                            Travel should feel
                            <span className="text-orange-400">
                                {" "}effortless.
                            </span>
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-slate-400">
                            We believe planning a journey should be just
                            as enjoyable as reaching your destination.
                        </p>
                    </div>

                    <div className="grid gap-10 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-2xl text-orange-400 transition duration-300 hover:rotate-6 hover:scale-110">
                                    {feature.icon}
                                </div>

                                <h3 className="mt-6 text-lg font-bold">
                                    {feature.title}
                                </h3>

                                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section
                id="about"
                className="scroll-mt-28 px-5 py-16 lg:px-8 lg:py-20"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-[28px] bg-[#ff8058] p-7 text-[#171421] sm:rounded-[30px] sm:p-12 lg:p-16">

                        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[40px] border-black/[0.06]" />
                        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full border-[35px] border-black/[0.05]" />

                        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                            <div className="max-w-xl">
                                <p className="text-[10px] font-black tracking-[0.25em] opacity-60 sm:text-xs">
                                    YOUR NEXT CHAPTER BEGINS HERE
                                </p>

                                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                                    Ready to go
                                    <br />
                                    somewhere new?
                                </h2>

                                <p className="mt-4 max-w-md text-sm leading-7 opacity-70">
                                    Pick your destination. We will help
                                    you plan the journey.
                                </p>
                            </div>

                            <a
                                href="#booking"
                                className="group flex w-full shrink-0 items-center justify-between gap-4 rounded-xl border-2 border-dashed border-[#171421]/40 bg-[#171421] px-5 py-4 text-white transition hover:-translate-y-1 hover:bg-[#252036] sm:w-auto sm:px-6 sm:py-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400 text-xl text-[#171421]">
                                        <FaTicketAlt />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-orange-300">
                                            LET'S TRAVEL
                                        </p>
                                        <p className="mt-1 text-sm font-black">
                                            Book Your Ticket
                                        </p>
                                    </div>
                                </div>

                                <FaArrowRight className="transition group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/[0.07] px-5 py-9 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400 text-lg text-[#171421]">
                            <FaCompass />
                        </div>

                        <div>
                            <h3 className="text-lg font-black tracking-widest">
                                DESTINI
                            </h3>
                            <p className="text-[9px] font-bold tracking-[0.35em] text-orange-400">
                                TRAVEL
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} Destini Travel.
                        All rights reserved.
                    </p>

                    <p className="text-xs font-medium text-slate-400">
                        Made for better journeys.
                    </p>
                </div>
            </footer>

            {/* BOOKING POPUP */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                from={from}
                to={to}
                journeyDate={date}
                passengers={passengerCount}
            />

        </main>
    );
}

export default Home;
