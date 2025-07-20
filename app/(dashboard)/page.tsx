"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Building,
	Users,
	Calendar,
	DollarSign,
	TrendingUp,
	TrendingDown,
	Clock,
	AlertTriangle,
	CheckCircle,
	Star,
	Bell,
	Download,
	Snowflake,
	Fan,
	GraduationCap,
	User,
} from "lucide-react";
import {
	LineChart,
	Line,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { useGetCountsQuery } from "@/store/features/count";
import { useGetAllUsersQuery } from "@/store/baseApi";
import { useGetBookingsQuery } from "@/store/features/booking";
import { useGetListingsQuery } from "@/store/features/Listing";

const recentBookings = [
	{
		id: "BK001",
		guest: "John Smith",
		listing: "Cozy Single Room Near Campus",
		startDate: "2024-02-01",
		endDate: "2024-02-15",
		type: "AC",
		amount: "₹12,000",
		role: "STUDENT",
	},
	{
		id: "BK002",
		guest: "Sarah Johnson",
		listing: "Spacious Double Room with Balcony",
		startDate: "2024-02-05",
		endDate: "2024-02-20",
		type: "NonAC",
		amount: "₹15,000",
		role: "ALUMNI",
	},
	{
		id: "BK003",
		guest: "Emily Davis",
		listing: "Budget Friendly Student Room",
		startDate: "2024-02-10",
		endDate: "2024-02-25",
		type: "NonAC",
		amount: "₹9,000",
		role: "STUDENT",
	},
	{
		id: "BK004",
		guest: "Lisa Rodriguez",
		listing: "Cozy Single Room Near Campus",
		startDate: "2024-03-01",
		endDate: "2024-03-15",
		type: "AC",
		amount: "₹8,000",
		role: "STUDENT",
	},
];

const recentListings = [
	{
		title: "Modern Studio Apartment",
		owner: "David Brown",
		type: "Both",
		singlePrice: "₹12,000",
		doublePrice: "₹18,000",
		status: "new",
	},
	{
		title: "Shared Room with Study Area",
		owner: "Anna Wilson",
		type: "AC",
		singlePrice: "₹8,500",
		doublePrice: "₹13,000",
		status: "popular",
	},
	{
		title: "Cozy Budget Room",
		owner: "Mike Johnson",
		type: "NonAC",
		singlePrice: "₹6,000",
		doublePrice: "₹9,000",
		status: "trending",
	},
];

const revenueData = [
	{ month: "Sep", revenue: 645000, bookings: 580 },
	{ month: "Oct", revenue: 720000, bookings: 650 },
	{ month: "Nov", revenue: 890000, bookings: 780 },
	{ month: "Dec", revenue: 756000, bookings: 690 },
	{ month: "Jan", revenue: 845290, bookings: 892 },
	{ month: "Feb", revenue: 920000, bookings: 950 },
];

const roomTypeData = [
	{ name: "AC Rooms", value: 45, color: "#3B82F6" },
	{ name: "Non-AC Rooms", value: 35, color: "#10B981" },
	{ name: "Both Types", value: 20, color: "#F59E0B" },
];

const alerts = [
	{
		type: "warning",
		message: "Low occupancy in Budget category",
		time: "15 min ago",
	},
	{
		type: "info",
		message: "New review needs moderation",
		time: "30 min ago",
	},
	{
		type: "success",
		message: "Monthly target achieved",
		time: "1 hour ago",
	},
];

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

function getRoleColor(role: string) {
	switch (role) {
		case "STUDENT":
			return "bg-green-100 text-green-800";
		case "ALUMNI":
			return "bg-blue-100 text-blue-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function getStatusColor(status: string) {
	switch (status) {
		case "new":
			return "bg-green-100 text-green-800";
		case "popular":
			return "bg-blue-100 text-blue-800";
		case "trending":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

export default function DashboardPage() {
	const { data } = useGetCountsQuery({
		search: "",
	});
	const { data: users, refetch } = useGetAllUsersQuery({});
	const stats = [
		{
			title: "Total Listings",
			value: data?.data.listings,

			icon: Building,
		},
		{
			title: "Active Users",
			value: data?.data.users,

			icon: Users,
		},
		{
			title: "Total Bookings",
			value: data?.data.booking,

			icon: Calendar,
		},
		{
			title: "Revenue",
			value: data?.data.totalRevenue,

			icon: DollarSign,
		},
	];
	const total = users?.data.length || 0;
	const alumniCount =
		users?.data.filter((user) => user.role === "ALUMNI").length || 0;
	const studentCount =
		users?.data.filter((user) => user.role === "STUDENT").length || 0;

	const alumniPercentage = (alumniCount / total) * 100;
	const studentPercentage = (studentCount / total) * 100;
	const userDistribution = [
		{ name: "Students", value: studentPercentage, color: "#10B981" },
		{ name: "Alumni", value: alumniPercentage, color: "#3B82F6" },
	];

	const { data: bookings } = useGetBookingsQuery({});
	const recentBookings = bookings?.data?.slice().reverse().slice(0, 4) || [];
	const { data: listings } = useGetListingsQuery({});
	const recentListings = listings?.data?.slice().reverse().slice(0, 4) || [];

	return (
		<div className="space-y-6">
			{/* Header with Actions */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
					<p className="text-muted-foreground">
						Welcome to StudentStay Admin! Here's your platform overview.
					</p>
				</div>
				{/* <div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
					<Button size="sm">
						<Bell className="mr-2 h-4 w-4" />
						Alerts
						<Badge
							variant="destructive"
							className="ml-2">
							3
						</Badge>
					</Button>
				</div> */}
			</div>

			{/* Enhanced Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card
						key={stat.title}
						className="relative overflow-hidden">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							{/* <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p> */}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Row */}
			<div className="grid gap-6 md:grid-cols-1">
				{/* Revenue Chart */}
				{/* <Card>
					<CardHeader>
						<CardTitle>Revenue & Bookings Trend</CardTitle>
						<CardDescription>
							Monthly revenue and booking performance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<AreaChart data={revenueData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip
									formatter={(value, name) => [
										name === "revenue" ? `₹${value.toLocaleString()}` : value,
										name === "revenue" ? "Revenue" : "Bookings",
									]}
								/>
								<Area
									type="monotone"
									dataKey="revenue"
									stroke="#3B82F6"
									fill="#3B82F6"
									fillOpacity={0.3}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card> */}

				{/* User Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>User Distribution</CardTitle>
						<CardDescription>Students vs Alumni breakdown</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<PieChart>
								<Pie
									data={userDistribution}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={120}
									paddingAngle={5}
									dataKey="value">
									{userDistribution.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
										/>
									))}
								</Pie>
								<Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
							</PieChart>
						</ResponsiveContainer>
						<div className="mt-4 space-y-2">
							{userDistribution.map((item) => (
								<div
									key={item.name}
									className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: item.color }}
										/>
										<span>{item.name}</span>
									</div>
									<span className="font-medium">{item.value}%</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Recent Bookings */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Recent Bookings</CardTitle>
						<CardDescription>Latest accommodation bookings</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Booking ID</TableHead>
									<TableHead>Guest</TableHead>
									<TableHead>Listing</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Role</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentBookings.map((booking, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">
											BK{booking.id.toString().padStart(3, "0")}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{booking.user.role === "STUDENT" ? (
													<User className="h-3 w-3 text-green-500" />
												) : (
													<GraduationCap className="h-3 w-3 text-blue-500" />
												)}
												{booking.user.name}
											</div>
										</TableCell>
										<TableCell className="max-w-[200px] truncate">
											{booking.listing.title}
										</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className={getBookingTypeColor(booking.type)}>
												<div className="flex items-center gap-1">
													{booking.type === "AC" ? (
														<Snowflake className="h-3 w-3" />
													) : (
														<Fan className="h-3 w-3" />
													)}
													{booking.type}
												</div>
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className={getRoleColor(booking.user.role)}>
												{booking.user.role}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											{booking.total}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				{/* Recent Listings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building className="h-4 w-4" />
							Recent Listings
						</CardTitle>
						<CardDescription>New accommodation listings</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{recentListings.map((listing, index) => (
							<div
								key={index}
								className="flex items-center justify-between rounded-lg border p-3">
								<div className="space-y-1">
									<p className="font-medium text-sm">{listing.title}</p>
									<p className="text-xs text-muted-foreground">
										by {listing.user.name}
									</p>
									<div className="flex items-center gap-2">
										<Badge
											variant="secondary"
											className={getBookingTypeColor(listing.type)}>
											{listing.type}
										</Badge>
										{/* <Badge
											variant="secondary"
											className={getStatusColor(listing.status)}>
											{listing.status}
										</Badge> */}
									</div>
								</div>
								<div className="text-right text-xs">
									<p className="font-medium">{listing.singleOccupancy}</p>
									<p className="text-muted-foreground">{listing.doubleOccupancy}</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Analytics Overview */}
			{/* <Card>
				<CardHeader>
					<CardTitle>Platform Analytics</CardTitle>
					<CardDescription>
						Key performance indicators and trends
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="rounded-lg border p-4 text-center">
							<div className="text-2xl font-bold text-green-600">78%</div>
							<div className="text-sm text-muted-foreground mb-2">
								Booking Success Rate
							</div>
							<Progress
								value={78}
								className="h-2"
							/>
							<div className="text-xs text-muted-foreground mt-1">
								Above industry average
							</div>
						</div>
						<div className="rounded-lg border p-4 text-center">
							<div className="text-2xl font-bold text-blue-600">4.6</div>
							<div className="text-sm text-muted-foreground mb-2">
								Average Rating
							</div>
							<div className="flex justify-center gap-1 mb-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className={`h-3 w-3 ${
											star <= 4.6
												? "text-yellow-400 fill-current"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<div className="text-xs text-muted-foreground">
								Based on 1,234 reviews
							</div>
						</div>
						<div className="rounded-lg border p-4 text-center">
							<div className="text-2xl font-bold text-purple-600">65%</div>
							<div className="text-sm text-muted-foreground mb-2">
								Platform Occupancy
							</div>
							<Progress
								value={65}
								className="h-2"
							/>
							<div className="text-xs text-muted-foreground mt-1">
								Peak season target: 80%
							</div>
						</div>
					</div>
				</CardContent>
			</Card> */}
		</div>
	);
}
