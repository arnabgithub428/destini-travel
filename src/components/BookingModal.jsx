
import { useMemo, useState } from "react";
import {
    FaBus,
    FaTimes,
    FaArrowLeft,
    FaArrowRight,
    FaCalendarAlt,
    FaUsers,
    FaSnowflake,
    FaWifi,
    FaPlug,
    FaChair,
    FaDoorOpen,
    FaCheck,
    FaInfoCircle,
    FaTicketAlt,
    FaCheckCircle,
    FaHome,
    FaUser,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";

const busList = [
    {
        id: 1,
        operator: "Green Line Paribahan",
        type: "Business Class AC",
        departure: "10:30 PM",
        arrival: "04:00 AM",
        duration: "5h 30m",
        price: 1200,
        available: 18,
        image:
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=85",
        features: ["AC", "Wi-Fi", "Charging Port"],
        badge: "POPULAR",
    },
    {
        id: 2,
        operator: "Hanif Enterprise",
        type: "AC Economy",
        departure: "11:00 PM",
        arrival: "05:00 AM",
        duration: "6h 00m",
        price: 950,
        available: 12,
        image:
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=85",
        features: ["AC", "Charging Port"],
        badge: "BEST PRICE",
    },
    {
        id: 3,
        operator: "Shohagh Paribahan",
        type: "Luxury AC",
        departure: "11:30 PM",
        arrival: "05:15 AM",
        duration: "5h 45m",
        price: 1100,
        available: 15,
        image:
            "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=900&q=85",
        features: ["AC", "Wi-Fi", "Charging Port"],
        badge: "LUXURY",
    },
];

const bookedSeats = ["A3", "B2", "C4", "D1", "E3", "F2"];
const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H"];

const BookingModal = ({
    isOpen,
    onClose,
    from = "Dhaka",
    to = "Chattogram",
    journeyDate = "",
    passengers = 1,
}) => {
    const [selectedBus, setSelectedBus] = useState(busList[0]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [notice, setNotice] = useState("");

    const [isPassengerForm, setIsPassengerForm] = useState(false);
    const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);

    // Passenger information
    const [passengerName, setPassengerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [savedBooking, setSavedBooking] = useState(null);

    const passengerCount = Number.parseInt(passengers, 10) || 1;

    const totalFare = useMemo(
        () => selectedSeats.length * (selectedBus?.price || 0),
        [selectedSeats, selectedBus]
    );

    const formattedDate = journeyDate
        ? new Date(`${journeyDate}T00:00:00`).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Date not selected";

    if (!isOpen) return null;

    // Reset booking
    const resetBooking = () => {
        setSelectedBus(busList[0]);
        setSelectedSeats([]);
        setNotice("");

        setIsPassengerForm(false);
        setIsBookingSuccessful(false);

        setPassengerName("");
        setPhone("");
        setEmail("");

        setSavedBooking(null);
    };

    // Close modal
    const handleClose = () => {
        resetBooking();
        onClose();
    };

    // Select bus
    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        setSelectedSeats([]);
        setNotice("");
        setIsPassengerForm(false);
        setIsBookingSuccessful(false);
    };

    // Select seats
    const handleSeatClick = (seat) => {
        if (bookedSeats.includes(seat)) return;

        setNotice("");

        setSelectedSeats((previous) => {
            if (previous.includes(seat)) {
                return previous.filter((item) => item !== seat);
            }

            if (previous.length >= passengerCount) {
                setNotice(
                    `You can select up to ${passengerCount} seat(s).`
                );
                return previous;
            }

            return [...previous, seat];
        });
    };

    // Continue to passenger form
    const handleContinue = () => {
        if (!selectedBus) {
            setNotice("Please select a bus first.");
            return;
        }

        if (selectedSeats.length === 0) {
            setNotice("Please select your seats.");
            return;
        }

        if (selectedSeats.length !== passengerCount) {
            setNotice(
                `Please select exactly ${passengerCount} seat(s) for your passengers.`
            );
            return;
        }

        setNotice("");
        setIsPassengerForm(true);
    };

    // Back to seat selection
    const handleBackToSeats = () => {
        setNotice("");
        setIsPassengerForm(false);
    };

    // Save confirmed booking
    const handleConfirmBooking = (event) => {
        event.preventDefault();

        setNotice("");

        const cleanName = passengerName.trim();
        const cleanPhone = phone.trim();
        const cleanEmail = email.trim();

        if (!cleanName) {
            setNotice("Please enter the passenger name.");
            return;
        }

        if (!/^[0-9+\-\s]{8,15}$/.test(cleanPhone)) {
            setNotice("Please enter a valid phone number.");
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            setNotice("Please enter a valid email address.");
            return;
        }

        if (!selectedBus || selectedSeats.length !== passengerCount) {
            setNotice("Please check your bus and seat selection.");
            return;
        }

        const bookingId = `DST${Date.now().toString().slice(-8)}`;

        const booking = {
            bookingId,
            id: bookingId,

            status: "Confirmed",

            busId: selectedBus.id,
            busName: selectedBus.operator,
            operator: selectedBus.operator,
            busType: selectedBus.type,
            type: selectedBus.type,

            from,
            to,

            journeyDate,
            formattedDate,

            departureTime: selectedBus.departure,
            arrivalTime: selectedBus.arrival,
            duration: selectedBus.duration,

            seats: [...selectedSeats],

            passengerCount,

            passengerName: cleanName,
            name: cleanName,

            phone: cleanPhone,
            mobile: cleanPhone,

            email: cleanEmail,

            price: selectedBus.price,
            totalFare,
            totalAmount: totalFare,

            bookingDate: new Date().toISOString(),
        };

        try {
            const existingBookings = JSON.parse(
                localStorage.getItem("destiniBookings") || "[]"
            );

            if (!Array.isArray(existingBookings)) {
                throw new Error("Invalid booking data.");
            }

            const updatedBookings = [
                booking,
                ...existingBookings,
            ];

            localStorage.setItem(
                "destiniBookings",
                JSON.stringify(updatedBookings)
            );

            setSavedBooking(booking);
            setIsPassengerForm(false);
            setIsBookingSuccessful(true);
        } catch (error) {
            console.error("Booking save error:", error);
            setNotice(
                "Unable to save your booking. Please try again."
            );
        }
    };

    // Seat component
    const renderSeat = (seat) => {
        const isBooked = bookedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);

        return (
            <button
                key={seat}
                type="button"
                disabled={isBooked}
                onClick={() => handleSeatClick(seat)}
                aria-label={`${seat} ${
                    isBooked
                        ? "booked"
                        : isSelected
                          ? "selected"
                          : "available"
                }`}
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200 sm:h-11 sm:w-11 ${
                    isBooked
                        ? "cursor-not-allowed border-slate-600 bg-slate-700 text-slate-400"
                        : isSelected
                          ? "scale-105 border-[#ff8058] bg-[#ff8058] text-[#111827] shadow-lg shadow-orange-500/20"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20"
                }`}
            >
                {isSelected ? <FaCheck /> : seat}
            </button>
        );
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050914]/85 p-2 backdrop-blur-md sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="relative flex max-h-[94vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1527] shadow-2xl shadow-black/50 sm:rounded-3xl">

                {/* HEADER */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4 sm:px-7">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={
                                isBookingSuccessful
                                    ? handleClose
                                    : isPassengerForm
                                      ? handleBackToSeats
                                      : handleClose
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#ff8058]/50 hover:bg-[#ff8058]/10 hover:text-[#ff8058]"
                            aria-label="Go back"
                        >
                            <FaArrowLeft size={13} />
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <FaTicketAlt className="text-[#ff8058]" />
                                <span className="text-xs font-bold tracking-[0.18em] text-[#ff8058]">
                                    DESTINI TRAVEL
                                </span>
                            </div>

                            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                                {isBookingSuccessful
                                    ? "Booking confirmation"
                                    : isPassengerForm
                                      ? "Passenger details"
                                      : "Book your journey"}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Close booking"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* JOURNEY DETAILS */}
                <div className="shrink-0 border-b border-white/10 bg-[#111d32] px-4 py-3 sm:px-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    From
                                </p>
                                <p className="text-sm font-semibold text-white">
                                    {from}
                                </p>
                            </div>

                            <FaArrowRight className="text-[#ff8058]" />

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    To
                                </p>
                                <p className="text-sm font-semibold text-white">
                                    {to}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                            <span className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[#ff8058]" />
                                {formattedDate}
                            </span>

                            <span className="flex items-center gap-2">
                                <FaUsers className="text-[#ff8058]" />
                                {passengerCount} Passenger
                                {passengerCount > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>

                {/* SUCCESS SCREEN */}
                {isBookingSuccessful ? (
                    <div className="flex-1 overflow-y-auto px-4 py-10 sm:px-7 sm:py-14">
                        <div className="mx-auto flex max-w-[600px] flex-col items-center text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 shadow-lg shadow-emerald-500/10">
                                <FaCheckCircle className="text-5xl text-emerald-400" />
                            </div>

                            <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                                DESTINI TRAVEL
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                                Congratulations!
                            </h2>

                            <h3 className="mt-2 text-xl font-bold text-[#ff8058]">
                                Booking Successful
                            </h3>

                            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                                Your booking has been confirmed
                                successfully. Your details are now
                                available in My Bookings.
                            </p>

                            {/* BOOKING SUMMARY */}
                            <div className="mt-8 w-full rounded-2xl border border-white/10 bg-[#121e32] p-5 text-left sm:p-6">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <h4 className="font-bold text-white">
                                        Booking Summary
                                    </h4>

                                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400">
                                        CONFIRMED
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Booking ID
                                        </span>
                                        <span className="text-right text-sm font-bold text-[#ff8058]">
                                            {savedBooking?.bookingId}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Passenger
                                        </span>
                                        <span className="text-right text-sm font-semibold text-white">
                                            {savedBooking?.passengerName}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Bus operator
                                        </span>
                                        <span className="text-right text-sm font-semibold text-white">
                                            {selectedBus.operator}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Bus type
                                        </span>
                                        <span className="text-right text-sm text-white">
                                            {selectedBus.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Journey route
                                        </span>
                                        <span className="text-right text-sm font-semibold text-white">
                                            {from} → {to}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Journey date
                                        </span>
                                        <span className="text-sm text-white">
                                            {formattedDate}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Departure
                                        </span>
                                        <span className="text-sm text-white">
                                            {selectedBus.departure}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-slate-400">
                                            Selected seats
                                        </span>
                                        <span className="text-right text-sm font-semibold text-[#ff8058]">
                                            {selectedSeats.join(", ")}
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-300">
                                                Total fare
                                            </span>

                                            <span className="text-2xl font-extrabold text-[#ff8058]">
                                                ৳{totalFare.toLocaleString("en-BD")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff8058] px-5 py-3.5 text-sm font-bold text-[#101827] transition hover:bg-[#ff9875]"
                            >
                                <FaHome />
                                Back to Home
                            </button>

                            <p className="mt-5 text-[10px] leading-5 text-slate-500">
                                Demo booking system. No actual ticket
                                has been issued and no payment has
                                been processed.
                            </p>
                        </div>
                    </div>
                ) : isPassengerForm ? (
                    /* PASSENGER DETAILS FORM */
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
                        <div className="mx-auto max-w-[760px]">
                            <div className="mb-7">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8058]">
                                    Step 04 · Passenger information
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-white">
                                    Enter passenger details
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Please provide your contact
                                    information to complete your booking.
                                </p>
                            </div>

                            {/* SELECTED SEAT SUMMARY */}
                            <div className="mb-6 rounded-2xl border border-[#ff8058]/20 bg-[#ff8058]/[0.06] p-4 sm:p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-slate-400">
                                            YOUR JOURNEY
                                        </p>

                                        <p className="mt-2 text-sm font-bold text-white">
                                            {from} → {to}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {selectedBus.operator} · {formattedDate}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400">
                                            Selected seats
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-[#ff8058]">
                                            {selectedSeats.join(", ")}
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-white">
                                            ৳{totalFare.toLocaleString("en-BD")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PASSENGER FORM */}
                            <form
                                onSubmit={handleConfirmBooking}
                                className="space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="passengerName"
                                        className="mb-2 block text-xs font-semibold text-slate-300"
                                    >
                                        Passenger Full Name
                                    </label>

                                    <div className="relative">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#ff8058]" />

                                        <input
                                            id="passengerName"
                                            type="text"
                                            value={passengerName}
                                            onChange={(e) =>
                                                setPassengerName(e.target.value)
                                            }
                                            placeholder="Enter passenger's full name"
                                            autoComplete="name"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-[#121e32] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#ff8058]/60"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="passengerPhone"
                                        className="mb-2 block text-xs font-semibold text-slate-300"
                                    >
                                        Mobile Number
                                    </label>

                                    <div className="relative">
                                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#ff8058]" />

                                        <input
                                            id="passengerPhone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="Enter mobile number"
                                            autoComplete="tel"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-[#121e32] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#ff8058]/60"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="passengerEmail"
                                        className="mb-2 block text-xs font-semibold text-slate-300"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#ff8058]" />

                                        <input
                                            id="passengerEmail"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Enter email address"
                                            autoComplete="email"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-[#121e32] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#ff8058]/60"
                                        />
                                    </div>
                                </div>

                                {/* NOTICE */}
                                {notice && (
                                    <div
                                        role="alert"
                                        className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300"
                                    >
                                        <FaInfoCircle className="mt-0.5 shrink-0" />
                                        {notice}
                                    </div>
                                )}

                                {/* TOTAL */}
                                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121e32] p-4">
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Total payable
                                        </p>
                                        <p className="mt-1 text-[10px] text-slate-500">
                                            {selectedSeats.length} seat(s) × ৳
                                            {selectedBus.price.toLocaleString("en-BD")}
                                        </p>
                                    </div>

                                    <p className="text-2xl font-extrabold text-[#ff8058]">
                                        ৳{totalFare.toLocaleString("en-BD")}
                                    </p>
                                </div>

                                {/* FORM BUTTONS */}
                                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={handleBackToSeats}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-xs font-semibold text-slate-300 transition hover:border-[#ff8058]/40 hover:bg-[#ff8058]/10 hover:text-[#ff8058]"
                                    >
                                        <FaArrowLeft />
                                        Back to Seats
                                    </button>

                                    <button
                                        type="submit"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-[#ff8058] px-6 py-3.5 text-xs font-bold text-[#101827] transition hover:bg-[#ff9875]"
                                    >
                                        Confirm Booking
                                        <FaCheckCircle />
                                    </button>
                                </div>
                            </form>

                            <p className="mt-5 text-center text-[10px] leading-5 text-slate-500">
                                This is a demo booking form. Your
                                information is saved locally in this
                                browser for demonstration purposes.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* SCROLLABLE BOOKING CONTENT */}
                        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">

                            {/* STEP 01: BUS LIST */}
                            <section>
                                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8058]">
                                            Step 01 · Choose your ride
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                            Select your bus
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Choose a comfortable ride for your journey.
                                        </p>
                                    </div>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                                        {busList.length} buses available
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {busList.map((bus) => {
                                        const isActive =
                                            selectedBus?.id === bus.id;

                                        return (
                                            <div
                                                key={bus.id}
                                                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                                                    isActive
                                                        ? "border-[#ff8058]/70 bg-[#ff8058]/[0.06] shadow-lg shadow-orange-500/5"
                                                        : "border-white/10 bg-[#121e32] hover:border-white/20"
                                                }`}
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_210px]">
                                                    <div className="p-4 sm:p-5">
                                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h4 className="font-bold text-white">
                                                                        {bus.operator}
                                                                    </h4>

                                                                    <span className="rounded-full bg-[#ff8058]/10 px-2 py-1 text-[9px] font-bold tracking-wider text-[#ff8058]">
                                                                        {bus.badge}
                                                                    </span>
                                                                </div>

                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    {bus.type}
                                                                </p>
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-[10px] text-slate-500">
                                                                    Starting from
                                                                </p>

                                                                <p className="text-xl font-extrabold text-[#ff8058]">
                                                                    ৳{bus.price.toLocaleString("en-BD")}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-5 flex items-center gap-3">
                                                            <div>
                                                                <p className="text-lg font-bold text-white">
                                                                    {bus.departure}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    {from}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-1 flex-col items-center gap-1">
                                                                <span className="text-[10px] text-slate-500">
                                                                    {bus.duration}
                                                                </span>

                                                                <div className="relative flex w-full items-center">
                                                                    <div className="h-px w-full border-t border-dashed border-slate-600" />
                                                                    <FaBus className="absolute left-1/2 -translate-x-1/2 bg-[#121e32] px-1 text-[#ff8058]" />
                                                                </div>

                                                                <span className="text-[9px] text-slate-500">
                                                                    Direct journey
                                                                </span>
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-white">
                                                                    {bus.arrival}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    {to}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                            <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
                                                                {bus.features.map((feature) => (
                                                                    <span
                                                                        key={feature}
                                                                        className="flex items-center gap-1.5"
                                                                    >
                                                                        {feature === "AC" ? (
                                                                            <FaSnowflake className="text-[#ff8058]" />
                                                                        ) : feature === "Wi-Fi" ? (
                                                                            <FaWifi className="text-[#ff8058]" />
                                                                        ) : (
                                                                            <FaPlug className="text-[#ff8058]" />
                                                                        )}
                                                                        {feature}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            <span className="text-[10px] text-emerald-400">
                                                                {bus.available} seats available
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelectBus(bus)
                                                            }
                                                            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:w-auto sm:min-w-[150px] ${
                                                                isActive
                                                                    ? "border border-[#ff8058] bg-[#ff8058]/10 text-[#ff8058]"
                                                                    : "bg-[#ff8058] text-[#101827] hover:bg-[#ff956f]"
                                                            }`}
                                                        >
                                                            {isActive ? (
                                                                <>
                                                                    <FaCheck />
                                                                    Selected
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Select this bus
                                                                    <FaArrowRight />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="relative min-h-[145px] overflow-hidden sm:min-h-full">
                                                        <img
                                                            src={bus.image}
                                                            alt={`${bus.operator} bus`}
                                                            className="absolute inset-0 h-full w-full object-cover"
                                                            onError={(event) => {
                                                                event.currentTarget.style.display = "none";
                                                            }}
                                                        />

                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527]/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-[#121e32]/20 sm:to-transparent" />

                                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020]/75 px-3 py-1.5 text-[10px] text-white backdrop-blur">
                                                            <FaBus className="text-[#ff8058]" />
                                                            Bus preview
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* STEP 02: BOOKING SUMMARY */}
                            <section className="mt-8">
                                <div className="mb-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8058]">
                                        Step 02 · Your selection
                                    </p>

                                    <h3 className="mt-1 text-xl font-bold text-white">
                                        Booking summary
                                    </h3>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-[#121e32] p-4 sm:p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FaBus className="text-[#ff8058]" />
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Selected bus
                                            </p>
                                        </div>

                                        <h4 className="text-lg font-bold text-white">
                                            {selectedBus.operator}
                                        </h4>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {selectedBus.type}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#0b1425] p-3">
                                            <div>
                                                <p className="text-lg font-bold text-white">
                                                    {selectedBus.departure}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {from}
                                                </p>
                                            </div>

                                            <FaArrowRight className="text-[#ff8058]" />

                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">
                                                    {selectedBus.arrival}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {to}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-between text-xs">
                                            <span className="text-slate-400">
                                                Price per seat
                                            </span>

                                            <span className="font-bold text-white">
                                                ৳{selectedBus.price.toLocaleString("en-BD")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-[#121e32] p-4 sm:p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FaChair className="text-[#ff8058]" />
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                                Your selected seats
                                            </p>
                                        </div>

                                        {selectedSeats.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSeats.map((seat) => (
                                                    <span
                                                        key={seat}
                                                        className="rounded-lg border border-[#ff8058]/40 bg-[#ff8058]/10 px-3 py-2 text-xs font-bold text-[#ff8058]"
                                                    >
                                                        {seat}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex min-h-[48px] items-center gap-2 text-xs text-slate-500">
                                                <FaInfoCircle />
                                                No seat selected yet
                                            </div>
                                        )}

                                        <div className="mt-4 border-t border-white/10 pt-3">
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>Seats selected</span>
                                                <span className="text-white">
                                                    {selectedSeats.length}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-slate-300">
                                                    Total fare
                                                </span>

                                                <span className="text-xl font-extrabold text-[#ff8058]">
                                                    ৳{totalFare.toLocaleString("en-BD")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* STEP 03: SEAT SELECTION */}
                            <section className="mt-8">
                                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8058]">
                                            Step 03 · Pick your seats
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold text-white">
                                            Choose your seats
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Select your preferred seats from the bus layout.
                                        </p>
                                    </div>

                                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-slate-300">
                                        {selectedSeats.length} / {passengerCount} selected
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-[#121e32] p-3 sm:p-6">
                                    <div className="mx-auto max-w-[520px]">
                                        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-[#0b1425] px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <FaDoorOpen className="text-[#ff8058]" />
                                                <span>Entrance door</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <FaBus className="text-[#ff8058]" />
                                                <span>Driver</span>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-dashed border-slate-600 bg-[#0b1425] p-3 sm:p-5">
                                            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
                                                <span className="text-[10px] font-bold tracking-widest text-slate-500">
                                                    FRONT OF THE BUS
                                                </span>

                                                <FaBus className="text-xl text-slate-400" />
                                            </div>

                                            <div className="space-y-3">
                                                {seatRows.map((row) => (
                                                    <div
                                                        key={row}
                                                        className="flex items-center justify-between gap-2"
                                                    >
                                                        <span className="w-4 text-[10px] font-bold text-slate-500">
                                                            {row}
                                                        </span>

                                                        <div className="flex gap-2">
                                                            {[1, 2].map((number) =>
                                                                renderSeat(`${row}${number}`)
                                                            )}
                                                        </div>

                                                        <div className="w-5" />

                                                        <div className="flex gap-2">
                                                            {[3, 4].map((number) =>
                                                                renderSeat(`${row}${number}`)
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-5 border-t border-white/10 pt-3 text-center">
                                                <span className="text-[10px] font-bold tracking-widest text-slate-500">
                                                    REAR OF THE BUS
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEAT LEGEND */}
                                    <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span className="h-3 w-3 rounded border border-emerald-500/40 bg-emerald-500/20" />
                                            Available
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span className="h-3 w-3 rounded bg-[#ff8058]" />
                                            Selected
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span className="h-3 w-3 rounded bg-slate-600" />
                                            Booked
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* NOTICE */}
                            {notice && (
                                <div
                                    role="alert"
                                    className="mt-4 flex items-start gap-2 rounded-xl border border-[#ff8058]/20 bg-[#ff8058]/10 px-4 py-3 text-xs text-[#ffb095]"
                                >
                                    <FaInfoCircle className="mt-0.5 shrink-0" />
                                    {notice}
                                </div>
                            )}

                            <p className="mt-4 text-center text-[10px] leading-5 text-slate-500">
                                Demo booking interface. Bus schedules,
                                seat availability and fares are sample
                                data for this portfolio project.
                            </p>
                        </div>

                        {/* STICKY FOOTER */}
                        <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-[#0d1527] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <div>
                                <p className="text-[10px] text-slate-500">
                                    Total payable
                                </p>

                                <p className="text-xl font-extrabold text-[#ff8058]">
                                    ৳{totalFare.toLocaleString("en-BD")}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/5 sm:flex-none"
                                >
                                    Back to home
                                </button>

                                <button
                                    onClick={handleContinue}
                                    disabled={
                                        selectedSeats.length === 0
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8058] px-5 py-3 text-xs font-bold text-[#101827] transition hover:bg-[#ff9875] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                                >
                                    Continue
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
