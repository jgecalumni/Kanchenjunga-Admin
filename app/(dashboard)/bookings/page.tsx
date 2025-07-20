"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Plus,
	Search,
	Calendar,
	CalendarCheck,
	CalendarX,
	DollarSign,
	Eye,
	Edit,
	MoreHorizontal,
	Snowflake,
	Fan,
	User,
	Building,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useDeleteBookingMutation,
	useGetBookingsQuery,
} from "@/store/features/booking";
import { useState } from "react";
import { toast } from "sonner";

interface Booking {
	id: number;
	listingId: number;
	userId: number;
	startDate: string;
	endDate: string;
	type: "AC" | "NonAC";
	total: number;
	listing: {
		title: string;
		singleOccupancy: number;
		doubleOccupancy: number;
	};
	user: {
		name: string;
		email: string;
		role: "STUDENT" | "ALUMNI" | "ADMIN";
	};
	createdAt: string;
}

// const bookings: Booking[] = [
//   {
//     id: 1,
//     listingId: 1,
//     userId: 1,
//     startDate: "2024-02-01",
//     endDate: "2024-02-15",
//     type: "AC",
//     total: 12000,
//     listing: {
//       title: "Cozy Single Room Near Campus",
//       singleOccupancy: 8000,
//       doubleOccupancy: 12000,
//     },
//     user: {
//       name: "John Smith",
//       email: "john.smith@university.edu",
//       role: "STUDENT",
//     },
//     createdAt: "2024-01-15",
//   },
//   {
//     id: 2,
//     listingId: 2,
//     userId: 2,
//     startDate: "2024-02-05",
//     endDate: "2024-02-20",
//     type: "NonAC",
//     total: 15000,
//     listing: {
//       title: "Spacious Double Room with Balcony",
//       singleOccupancy: 10000,
//       doubleOccupancy: 15000,
//     },
//     user: {
//       name: "Sarah Johnson",
//       email: "sarah.j@alumni.edu",
//       role: "ALUMNI",
//     },
//     createdAt: "2024-01-16",
//   },
//   {
//     id: 3,
//     listingId: 3,
//     userId: 4,
//     startDate: "2024-02-10",
//     endDate: "2024-02-25",
//     type: "NonAC",
//     total: 9000,
//     listing: {
//       title: "Budget Friendly Student Room",
//       singleOccupancy: 6000,
//       doubleOccupancy: 9000,
//     },
//     user: {
//       name: "Emily Davis",
//       email: "emily.davis@university.edu",
//       role: "STUDENT",
//     },
//     createdAt: "2024-01-17",
//   },
//   {
//     id: 4,
//     listingId: 1,
//     userId: 6,
//     startDate: "2024-03-01",
//     endDate: "2024-03-15",
//     type: "AC",
//     total: 8000,
//     listing: {
//       title: "Cozy Single Room Near Campus",
//       singleOccupancy: 8000,
//       doubleOccupancy: 12000,
//     },
//     user: {
//       name: "Lisa Rodriguez",
//       email: "lisa.r@university.edu",
//       role: "STUDENT",
//     },
//     createdAt: "2024-01-18",
//   },
//   {
//     id: 5,
//     listingId: 2,
//     userId: 1,
//     startDate: "2024-03-05",
//     endDate: "2024-03-20",
//     type: "AC",
//     total: 10000,
//     listing: {
//       title: "Spacious Double Room with Balcony",
//       singleOccupancy: 10000,
//       doubleOccupancy: 15000,
//     },
//     user: {
//       name: "John Smith",
//       email: "john.smith@university.edu",
//       role: "STUDENT",
//     },
//     createdAt: "2024-01-19",
//   },
// ];

function getBookingTypeColor(type: string) {
	switch (type) {
		case "AC":
			return "bg-blue-100 text-blue-800";
		case "NonAC":
			return "bg-green-100 text-green-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function getBookingTypeIcon(type: string) {
	switch (type) {
		case "AC":
			return <Snowflake className="h-3 w-3" />;
		case "NonAC":
			return <Fan className="h-3 w-3" />;
		default:
			return null;
	}
}

function getRoleColor(role: string) {
	switch (role) {
		case "ADMIN":
			return "bg-purple-100 text-purple-800";
		case "ALUMNI":
			return "bg-blue-100 text-blue-800";
		case "STUDENT":
			return "bg-green-100 text-green-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function calculateDays(startDate: string, endDate: string): number {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const diffTime = Math.abs(end.getTime() - start.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function BookingsPage() {
	const { data, refetch } = useGetBookingsQuery({});
	const bookings = data?.data || [];
	const bookingStats = {
		totalBookings: bookings.length,
		acBookings: bookings.filter((b) => b.type === "AC").length,
		nonAcBookings: bookings.filter((b) => b.type === "NonAC").length,
		totalRevenue: bookings.reduce((sum, b) => sum + b.total, 0),
	};
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all-role");
	const filteredBookings = bookings.filter((booking) => {
		const matchesSearch =
			booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			booking.id.toLocaleString().includes(searchTerm.toLowerCase());
		const matchesType = typeFilter === "all" || booking.type === typeFilter;
		const matchesRole =
			roleFilter === "all-role" || booking.user.role === roleFilter;

		return matchesSearch && matchesType && matchesRole;
	});
	const [deleteBooking] = useDeleteBookingMutation();
	const handleDeleteBooking = async (id: number) => {
		try {
			const res = await deleteBooking(id).unwrap();
			if (res.success) {
				toast.success(res.message);
				refetch();
			}
		} catch (error) {
			console.error("Failed to delete booking:", error);
		}
	};
	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Bookings
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{bookingStats.totalBookings}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">AC Bookings</CardTitle>
						<Snowflake className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{bookingStats.acBookings}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Non-AC Bookings
						</CardTitle>
						<Fan className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{bookingStats.nonAcBookings}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							₹{bookingStats.totalRevenue.toLocaleString()}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Booking Management */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Booking Management</CardTitle>
							<CardDescription>
								Manage student accommodation bookings
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="mb-4 flex gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search bookings..."
								className="pl-8"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Select
							value={typeFilter}
							onValueChange={setTypeFilter}>
							<SelectTrigger className="w-[150px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="AC">AC</SelectItem>
								<SelectItem value="NonAC">Non-AC</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={roleFilter}
							onValueChange={setRoleFilter}>
							<SelectTrigger className="w-[150px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all-role">All Users</SelectItem>
								<SelectItem value="STUDENT">Students</SelectItem>
								<SelectItem value="ALUMNI">Alumni</SelectItem>
								<SelectItem value="ADMIN">Admins</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Booking ID</TableHead>
								<TableHead>Guest</TableHead>
								<TableHead>Listing</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead>End Date</TableHead>
								<TableHead>Duration</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Total</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredBookings.map((booking) => (
								<TableRow key={booking.id}>
									<TableCell className="font-medium">
										BK{booking.id.toString().padStart(3, "0")}
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{booking.user.name}</div>
											<div className="text-sm text-muted-foreground">
												<Badge
													variant="secondary"
													className={getRoleColor(booking.user.role)}>
													{booking.user.role}
												</Badge>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{booking.listing.title}</div>
											<div className="text-sm text-muted-foreground">
												<Building className="inline h-3 w-3 mr-1" />
												ID: {booking.listingId}
											</div>
										</div>
									</TableCell>
									<TableCell>
										{new Date(booking.startDate).toLocaleDateString(undefined, {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</TableCell>
									<TableCell>
										{new Date(booking.endDate).toLocaleDateString(undefined, {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</TableCell>
									<TableCell>
										{calculateDays(booking.startDate, booking.endDate)} days
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={getBookingTypeColor(booking.type)}>
											<div className="flex items-center gap-1">
												{getBookingTypeIcon(booking.type)}
												{booking.type}
											</div>
										</Badge>
									</TableCell>
									<TableCell>
										<div className="font-medium">
											₹{booking.total.toLocaleString()}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0">
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												{/* <DropdownMenuItem>
													<Eye className="mr-2 h-4 w-4" />
													View details
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Edit className="mr-2 h-4 w-4" />
													Edit booking
												</DropdownMenuItem>
												<DropdownMenuItem>Contact guest</DropdownMenuItem>
												<DropdownMenuItem>View listing</DropdownMenuItem>
												<DropdownMenuSeparator /> */}
												<DropdownMenuItem
													onClick={() => handleDeleteBooking(booking.id)}
													className="text-red-600">
													Cancel booking
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
