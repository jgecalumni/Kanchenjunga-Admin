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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Plus,
	Search,
	Users,
	UserCheck,
	Shield,
	Mail,
	Phone,
	Edit,
	MoreHorizontal,
	GraduationCap,
	User,
	Building,
	Star,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllUsersQuery } from "@/store/baseApi";
import { useState } from "react";
import { UserModal } from "@/components/Modals/UserModal";

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

function getRoleIcon(role: string) {
	switch (role) {
		case "ADMIN":
			return <Shield className="h-3 w-3" />;
		case "ALUMNI":
			return <GraduationCap className="h-3 w-3" />;
		case "STUDENT":
			return <User className="h-3 w-3" />;
		default:
			return <User className="h-3 w-3" />;
	}
}

export default function UsersPage() {
	const { data, refetch } = useGetAllUsersQuery({});
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedUser, setSelectedUser] = useState<any | null>(null);

	const users = data?.data || [];
	const userStats = {
		totalUsers: users.length,
		students: users.filter((u) => u.role === "STUDENT").length,
		alumni: users.filter((u) => u.role === "ALUMNI").length,
		admins: users.filter((u) => u.role === "ADMIN").length,
	};

	const filteredUser = users.filter((user) => {
		const matchesSearch = user.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userStats.totalUsers}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Students</CardTitle>
						<User className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{userStats.students}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Alumni</CardTitle>
						<GraduationCap className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{userStats.alumni}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Admins</CardTitle>
						<Shield className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{userStats.admins}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* User Management */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>User Management</CardTitle>
							<CardDescription>
								Manage students, alumni, and administrators
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="mb-4 flex gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search users..."
								className="pl-8"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Listings</TableHead>
								<TableHead>Bookings</TableHead>
								<TableHead>Reviews</TableHead>
								<TableHead>Join Date</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUser.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={`/avatars/${user.id}.png`}
													alt={user.name}
												/>
												<AvatarFallback>
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{user.name}</div>
												<div className="text-sm text-muted-foreground">
													ID: {user.id}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center gap-2 text-sm">
												<Mail className="h-3 w-3" />
												{user.email}
											</div>
											{user.phone && (
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Phone className="h-3 w-3" />
													{user.phone}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={getRoleColor(user.role)}>
											<div className="flex items-center gap-1">
												{getRoleIcon(user.role)}
												{user.role}
											</div>
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Building className="h-3 w-3 text-muted-foreground" />
											{user.listings.length}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<UserCheck className="h-3 w-3 text-muted-foreground" />
											{user.bookings.length}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3 text-yellow-500" />
											{user.reviews.length}
										</div>
									</TableCell>
									<TableCell>
										{user.createdAt
											? new Date(user.createdAt).toLocaleDateString(undefined, {
													day: "numeric",
													month: "short",
													year: "numeric",
											  })
											: ""}
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
												<DropdownMenuItem onClick={() => setSelectedUser(user)}>
													<Edit className="mr-2 h-4 w-4" />
													Edit user
												</DropdownMenuItem>
												<DropdownMenuItem>View listings</DropdownMenuItem>
												<DropdownMenuItem>View bookings</DropdownMenuItem>
												<DropdownMenuItem>Send message</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-red-600">
													Deactivate user
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
			{selectedUser && (
				<UserModal
					open={!!selectedUser}
					data={selectedUser}
					closed={() => {
						setSelectedUser(null), refetch();
					}}
				/>
			)}
		</div>
	);
}
