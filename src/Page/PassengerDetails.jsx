import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
    FaBus,
    FaArrowLeft,
    FaTicketAlt,
    FaCheckCircle,
    FaCalendarAlt,
    FaTimesCircle,
    FaDownload,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaChair,
    FaMoneyBillWave,
    FaTimes,
    FaExclamationTriangle,
} from "react-icons/fa";

const STORAGE_KEY = "destiniBookings";

const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getBookingId = (booking) =>
    booking.bookingId || booking.id || "N/A";

const PassengerDetails = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [cancelBookingId, setCancelBookingId] = useState(null);

    // Load bookings from LocalStorage
    useEffect(() => {
        const loadBookings = () => {
            try {
                const savedBookings = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) || "[]"
                );

                setBookings(
                    Array.isArray(savedBookings) ? savedBookings : []
                );
            } catch (error) {
                console.error("Unable to load bookings:", error);
                setBookings([]);
            }
        };

        loadBookings();

        // Update when another tab changes LocalStorage
        window.addEventListener("storage", loadBookings);

        return () => {
            window.removeEventListener("storage", loadBookings);
        };
    }, []);

    const saveBookings = (updatedBookings) => {
        setBookings(updatedBookings);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedBookings)
        );
    };

    // Dashboard statistics
    const statistics = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const confirmed = bookings.filter(
            (booking) =>
                (booking.status || "Confirmed").toLowerCase() ===
                "confirmed"
        );

        const upcoming = confirmed.filter((booking) => {
            if (!booking.journeyDate) return false;

            const journeyDate = new Date(
                `${booking.journeyDate}T00:00:00`
            );

            return (
                !Number.isNaN(journeyDate.getTime()) &&
                journeyDate >= today
            );
        });

        const cancelled = bookings.filter(
            (booking) =>
                (booking.status || "").toLowerCase() === "cancelled"
        );

        return {
            total: bookings.length,
            confirmed: confirmed.length,
            upcoming: upcoming.length,
            cancelled: cancelled.length,
        };
    }, [bookings]);

    // Remove booking completely
    const handleCancelBooking = () => {
        if (!cancelBookingId) return;

        const updatedBookings = bookings.filter(
            (booking) => getBookingId(booking) !== cancelBookingId
        );

        saveBookings(updatedBookings);
        setCancelBookingId(null);
    };

    // Generate PDF ticket
    const handleDownloadTicket = (booking) => {
        if ((booking.status || "Confirmed").toLowerCase() !== "confirmed") {
            return;
        }

        const pdf = new jsPDF();

        const bookingId = getBookingId(booking);
        const passengerName =
            booking.passengerName ||
            booking.name ||
            "Passenger";

        const from = booking.from || "Departure";
        const to = booking.to || "Destination";
        const busName =
            booking.busName ||
            booking.operator ||
            booking.selectedBus?.name ||
            "Bus Operator";

        const seats = Array.isArray(booking.seats)
            ? booking.seats.join(", ")
            : booking.seats || "Not specified";

        const fare =
            booking.totalFare ??
            booking.totalAmount ??
            booking.price ??
            0;

        pdf.setFillColor(11, 16, 32);
        pdf.rect(0, 0, 210, 45, "F");

        pdf.setTextColor(255, 128, 88);
        pdf.setFontSize(23);
        pdf.setFont("helvetica", "bold");
        pdf.text("DESTINI TRAVEL", 15, 22);

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("YOUR JOURNEY, OUR PRIORITY", 15, 31);

        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(19);
        pdf.setFont("helvetica", "bold");
        pdf.text("BUS TICKET", 15, 61);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Booking ID: ${bookingId}`, 15, 72);

        pdf.setDrawColor(220, 225, 232);
        pdf.line(15, 80, 195, 80);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("JOURNEY DETAILS", 15, 92);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        const details = [
            ["Passenger Name", passengerName],
            ["Mobile Number", booking.phone || booking.mobile || "N/A"],
            ["Email Address", booking.email || "N/A"],
            ["Bus Operator", busName],
            ["Bus Type", booking.busType || booking.type || "N/A"],
            ["Departure", from],
            ["Destination", to],
            ["Journey Date", formatDate(booking.journeyDate)],
            ["Departure Time", booking.departureTime || "N/A"],
            ["Seat Number", seats],
            ["Total Fare", `BDT ${Number(fare).toLocaleString("en-BD")}`],
        ];

        let y = 104;

        details.forEach(([label, value]) => {
            pdf.setTextColor(100, 116, 139);
            pdf.text(label, 15, y);

            pdf.setTextColor(30, 41, 59);
            pdf.setFont("helvetica", "bold");
            pdf.text(String(value), 75, y);

            pdf.setFont("helvetica", "normal");
            y += 11;
        });

        pdf.setDrawColor(220, 225, 232);
        pdf.line(15, y + 3, 195, y + 3);

        pdf.setTextColor(22, 163, 74);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("BOOKING CONFIRMED", 15, y + 17);

        pdf.setTextColor(100, 116, 139);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(
            "Please keep this ticket with you during your journey.",
            15,
            y + 27
        );
        pdf.text(
            "This is a demo ticket generated by DESTINI TRAVEL.",
            15,
            y + 34
        );

        pdf.save(`DESTINI-Ticket-${bookingId}.pdf`);
    };

    const statCards = [
        {
            title: "Total Bookings",
            value: statistics.total,
            icon: <FaTicketAlt />,
            color: "text-[#ff8058]",
            iconBg: "bg-[#ff8058]/10",
        },
        {
            title: "Confirmed",
            value: statistics.confirmed,
            icon: <FaCheckCircle />,
            color: "text-emerald-400",
            iconBg: "bg-emerald-400/10",
        },
        {
            title: "Upcoming Trips",
            value: statistics.upcoming,
            icon: <FaCalendarAlt />,
            color: "text-blue-400",
            iconBg: "bg-blue-400/10",
        },
        {
            title: "Cancelled",
            value: statistics.cancelled,
            icon: <FaTimesCircle />,
            color: "text-rose-400",
            iconBg: "bg-rose-400/10",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0b1020] text-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b1020]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2.5"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff8058] text-[#0b1020]">
                            <FaBus size={20} />
                        </span>

                        <span className="text-left leading-tight">
                            <span className="block text-lg font-extrabold tracking-wide">
                                DESTINI
                            </span>
                            <span className="block text-[10px] font-semibold tracking-[3px] text-slate-400">
                                TRAVEL
                            </span>
                        </span>
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-[#ff8058]/40 hover:bg-[#ff8058]/10 hover:text-[#ff8058]"
                    >
                        <FaArrowLeft size={12} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 pb-16 pt-9 sm:px-6 sm:pt-12 lg:px-8">
                {/* Page Heading */}
                <div className="mb-8">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-[#ff8058]">
                        Passenger Dashboard
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Passenger Details
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage your bookings and keep track of your journeys.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.title}
                            className="group rounded-2xl border border-white/[0.06] bg-[#151d31] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ff8058]/25"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">
                                        {stat.title}
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold tabular-nums text-white">
                                        {String(stat.value).padStart(2, "0")}
                                    </h2>
                                </div>

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.color} ${stat.iconBg}`}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking List Heading */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold">
                            Your Bookings
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            All your journey reservations in one place.
                        </p>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300">
                        {bookings.length}{" "}
                        {bookings.length === 1 ? "Booking" : "Bookings"}
                    </span>
                </div>

                {/* Booking Cards */}
                {bookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#121a2c] px-5 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff8058]/10 text-3xl text-[#ff8058]">
                            <FaTicketAlt />
                        </div>

                        <h3 className="text-lg font-semibold">
                            No Bookings Found
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                            You haven't booked any journeys yet. Find your
                            destination and start your next trip with Destini.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-xl bg-[#ff8058] px-6 py-3 text-sm font-bold text-[#0b1020] transition hover:bg-[#ff9674]"
                        >
                            Book Your Journey
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {bookings.map((booking, index) => {
                            const bookingId = getBookingId(booking);
                            const status =
                                booking.status || "Confirmed";
                            const isCancelled =
                                status.toLowerCase() === "cancelled";

                            const busName =
                                booking.busName ||
                                booking.operator ||
                                booking.selectedBus?.name ||
                                "Bus Operator";

                            const passengerName =
                                booking.passengerName ||
                                booking.name ||
                                "Passenger";

                            const seats = Array.isArray(booking.seats)
                                ? booking.seats.join(", ")
                                : booking.seats || "N/A";

                            const fare =
                                booking.totalFare ??
                                booking.totalAmount ??
                                booking.price ??
                                0;

                            return (
                                <article
                                    key={`${bookingId}-${index}`}
                                    className={`overflow-hidden rounded-2xl border bg-[#151d31] transition duration-300 ${
                                        isCancelled
                                            ? "border-rose-500/15"
                                            : "border-white/[0.07] hover:border-[#ff8058]/25"
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff8058]/10 text-[#ff8058]">
                                                <FaBus />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white">
                                                    {busName}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Booking ID: {bookingId}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                                isCancelled
                                                    ? "border-rose-400/20 bg-rose-400/10 text-rose-400"
                                                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </div>

                                    <div className="p-5 sm:p-6">
                                        {/* Route */}
                                        <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                                            <div>
                                                <p className="text-xl font-bold text-white sm:text-2xl">
                                                    {booking.from || "Departure"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {booking.departureTime || "Departure"}
                                                </p>
                                            </div>

                                            <div className="flex min-w-16 flex-col items-center gap-2 text-[#ff8058]">
                                                <FaBus size={18} />
                                                <div className="h-px w-full bg-[#ff8058]/50" />
                                                <span className="whitespace-nowrap text-[10px] text-slate-400">
                                                    {booking.duration || "Journey"}
                                                </span>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white sm:text-2xl">
                                                    {booking.to || "Destination"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {booking.arrivalTime || "Arrival"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Passenger Details */}
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl bg-[#0d1527] p-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <div className="flex items-start gap-3">
                                                <FaUser className="mt-1 text-[#ff8058]" />
                                                <div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Passenger
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-slate-200">
                                                        {passengerName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <FaCalendarAlt className="mt-1 text-[#ff8058]" />
                                                <div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Journey Date
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-slate-200">
                                                        {formatDate(booking.journeyDate)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <FaChair className="mt-1 text-[#ff8058]" />
                                                <div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Seat Number
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-slate-200">
                                                        {seats}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <FaMoneyBillWave className="mt-1 text-[#ff8058]" />
                                                <div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Total Fare
                                                    </p>
                                                    <p className="mt-1 text-sm font-bold text-white">
                                                        ৳{Number(fare).toLocaleString("en-BD")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
                                            {booking.phone || booking.mobile ? (
                                                <span className="flex items-center gap-2">
                                                    <FaPhone className="text-[#ff8058]" />
                                                    {booking.phone || booking.mobile}
                                                </span>
                                            ) : null}

                                            {booking.email ? (
                                                <span className="flex items-center gap-2">
                                                    <FaEnvelope className="text-[#ff8058]" />
                                                    {booking.email}
                                                </span>
                                            ) : null}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                                            <button
                                                onClick={() =>
                                                    setCancelBookingId(bookingId)
                                                }
                                                disabled={isCancelled}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-5 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <FaTimesCircle />
                                                Cancel Ticket
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDownloadTicket(booking)
                                                }
                                                disabled={isCancelled}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-[#ff8058] px-5 py-3 text-sm font-bold text-[#0b1020] transition hover:bg-[#ff9674] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <FaDownload />
                                                Collect Ticket
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Cancel Confirmation Modal */}
            {cancelBookingId && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050914]/85 p-4 backdrop-blur-md"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setCancelBookingId(null);
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151d31] p-6 shadow-2xl">
                        <div className="mb-5 flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-400/10 text-xl text-rose-400">
                                <FaExclamationTriangle />
                            </div>

                            <button
                                onClick={() => setCancelBookingId(null)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white">
                            Cancel this booking?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Are you sure you want to cancel this ticket?
                            This action will permanently remove this booking
                            from your booking history. You cannot undo this action.
                        </p>

                        <div className="mt-7 flex gap-3">
                            <button
                                onClick={() => setCancelBookingId(null)}
                                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                            >
                                Keep Booking
                            </button>

                            <button
                                onClick={handleCancelBooking}
                                className="flex-1 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
                            >
                                Yes, Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PassengerDetails;