"use client";

import { useState } from "react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
	Star,
	MessageSquare,
	Building,
	User,
	Eye,
	Edit,
	MoreHorizontal,
	ThumbsUp,
	ThumbsDown,
	Flag,
	Calendar,
	MapPin,
	Users,
	Filter,
	Heart,
	Reply,
	ExternalLink,
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
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	useDeleteReviewMutation,
	useGetReviewsQuery,
} from "@/store/features/review";
import { toast } from "sonner";

interface Review {
	id: number;
	content: string;
	createdAt: string;
	rating: number;
	listing: {
		id: number;
		description: string;
		doubleOccupancy: number;
		singleOccupancy: number;
		images: [
			{
				id: number;
				url: string;
			}
		];
		title: string;
		type: string;
	};
	user: {
		id: number;
		name: string;
		email: string;
		role: string;
		phone: string;
	};
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

function getRatingColor(rating: number) {
	if (rating >= 4) return "text-green-600";
	if (rating >= 3) return "text-yellow-600";
	return "text-red-600";
}

function getTypeColor(type: string) {
	switch (type) {
		case "AC":
			return "bg-blue-100 text-blue-800";
		case "NonAC":
			return "bg-green-100 text-green-800";
		case "Both":
			return "bg-purple-100 text-purple-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
}

function renderStars(rating: number, size = "h-4 w-4") {
	return (
		<div className="flex items-center">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`${size} ${
						star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
					}`}
				/>
			))}
		</div>
	);
}

function ReviewDetailDialog({ review }: { review: Review }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<Eye className="mr-2 h-4 w-4" />
					View full review
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5" />
						Review Details
					</DialogTitle>
					<DialogDescription>
						Detailed view of review #{review.id}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Review Header */}
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-12 w-12">
								<AvatarImage
									src={`/avatars/${review.id}.png`}
									alt={review.user.name}
								/>
								<AvatarFallback>
									{review.user.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex items-center gap-2">
									<h3 className="font-semibold">{review.user.name}</h3>
									<Badge
										variant="secondary"
										className={getRoleColor(review.user.role)}>
										{review.user.role}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{review.user.email}
								</p>
								<div className="flex items-center gap-2 mt-1">
									<Calendar className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										{new Date(review.createdAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</span>
								</div>
							</div>
						</div>

						<div className="text-right">
							<div className="flex items-center gap-2 mb-1">
								{renderStars(review.rating, "h-5 w-5")}
								<span
									className={`text-xl font-bold ${getRatingColor(
										review.rating
									)}`}>
									{review.rating}.0
								</span>
							</div>
						</div>
					</div>

					{/* Listing Information */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-lg flex items-center gap-2">
								<Building className="h-4 w-4" />
								{review.listing.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1">
									<MapPin className="h-3 w-3 text-muted-foreground" />
									<span>Kanchenjunga,JGEC</span>
								</div>
								<Badge
									variant="secondary"
									className={getTypeColor(review.listing.type)}>
									{review.listing.type}
								</Badge>
								<Button
									variant="ghost"
									size="sm"
									className="h-6 px-2">
									<ExternalLink className="h-3 w-3 mr-1" />
									View Listing
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Review Content */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Review</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm leading-relaxed whitespace-pre-wrap">
								{review.content}
							</p>
						</CardContent>
					</Card>

					{/* Owner Response */}
					{/* {review.response && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  Owner Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed mb-2">
                  {review.response.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>by {review.response.author}</span>
                  <span>•</span>
                  <span>{review.response.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          )} */}

					{/* Actions */}
					{/* <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleHelpful}
                disabled={hasVoted}
                className={hasVoted ? "bg-green-50" : ""}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {hasVoted ? "Marked Helpful" : "Mark as Helpful"}
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-3 w-3 mr-1" />
                Report
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Users className="h-3 w-3 mr-1" />
                View User Profile
              </Button>
              <Button variant="outline" size="sm">
                <Building className="h-3 w-3 mr-1" />
                View Listing
              </Button>
            </div>
          </div> */}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function ReviewsPage() {
	const { data, refetch } = useGetReviewsQuery({});
	const reviews = data?.data || [];
	const reviewStats = {
		totalReviews: reviews.length,
		averageRating: (
			reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
		).toFixed(1),
		fiveStars: reviews.filter((r) => r.rating === 5).length,
		fourStars: reviews.filter((r) => r.rating === 4).length,
		threeStars: reviews.filter((r) => r.rating === 3).length,
		twoStars: reviews.filter((r) => r.rating === 2).length,
		oneStars: reviews.filter((r) => r.rating === 1).length,
	};
	const [deleteReview] = useDeleteReviewMutation();
	const handleDeleteReview = async (id: number) => {
		const res = await deleteReview(id).unwrap();
		if (res.success) {
			toast.success(res.message);
			
		}
    refetch()
	};

	const [searchTerm, setSearchTerm] = useState("");
	const [filterRating, setFilterRating] = useState<string>("all");
	const [filterRole, setFilterRole] = useState<string>("all");

	const filteredReviews = reviews.filter((review) => {
		const matchesSearch =
			review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.listing.title.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesRating =
			filterRating === "all" || review.rating.toString() === filterRating;
		const matchesRole = filterRole === "all" || review.user.role === filterRole;

		return matchesSearch && matchesRating && matchesRole;
	});

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{reviewStats.totalReviews}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
						<Star className="h-4 w-4 text-yellow-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{reviewStats.averageRating}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Verified</CardTitle>
						<Users className="h-4 w-4 text-green-500" />
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">5 Stars</CardTitle>
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className="h-2 w-2 text-yellow-400 fill-current"
								/>
							))}
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{reviewStats.fiveStars}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">4 Stars</CardTitle>
						<div className="flex">
							{[1, 2, 3, 4].map((star) => (
								<Star
									key={star}
									className="h-2 w-2 text-yellow-400 fill-current"
								/>
							))}
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{reviewStats.fourStars}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">≤3 Stars</CardTitle>
						<div className="flex">
							{[1, 2, 3].map((star) => (
								<Star
									key={star}
									className="h-2 w-2 text-red-400 fill-current"
								/>
							))}
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{reviewStats.threeStars +
								reviewStats.twoStars +
								reviewStats.oneStars}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Review Management */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Review Management</CardTitle>
							<CardDescription>
								Monitor and manage reviews for listings with detailed view
								capabilities
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search and Filters */}
					<div className="mb-4 flex gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search reviews, users, or listings..."
								className="pl-8"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Select
							value={filterRating}
							onValueChange={setFilterRating}>
							<SelectTrigger className="w-32">
								<SelectValue placeholder="Rating" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Ratings</SelectItem>
								<SelectItem value="5">5 Stars</SelectItem>
								<SelectItem value="4">4 Stars</SelectItem>
								<SelectItem value="3">3 Stars</SelectItem>
								<SelectItem value="2">2 Stars</SelectItem>
								<SelectItem value="1">1 Star</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={filterRole}
							onValueChange={setFilterRole}>
							<SelectTrigger className="w-32">
								<SelectValue placeholder="Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="STUDENT">Students</SelectItem>
								<SelectItem value="ALUMNI">Alumni</SelectItem>
								<SelectItem value="ADMIN">Admins</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Reviewer</TableHead>
								<TableHead>Listing</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead>Review Preview</TableHead>
								<TableHead>Date</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredReviews.map((review) => (
								<TableRow key={review.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={`/avatars/${review.id}.png`}
													alt={review.user.name}
												/>
												<AvatarFallback>
													{review.user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium flex items-center gap-2">
													{review.user.name}
												</div>
												<Badge
													variant="secondary"
													className={getRoleColor(review.user.role)}>
													{review.user.role}
												</Badge>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{review.listing.title}</div>
											<div className="text-sm text-muted-foreground flex items-center gap-1">
												<MapPin className="h-3 w-3" />
												Kanchenjunga,JGEC
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											{renderStars(review.rating)}
											<span
												className={`font-bold ${getRatingColor(
													review.rating
												)}`}>
												{review.rating}
											</span>
										</div>
									</TableCell>
									<TableCell className="max-w-md">
										<p className="text-sm line-clamp-3">{review.content}</p>
										{/* {review.response && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <span className="font-medium text-blue-800">
                          Owner replied:
                        </span>{" "}
                        {review.response.content.substring(0, 50)}...
                      </div>
                    )} */}
									</TableCell>

									<TableCell>
										{new Date(review.createdAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
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
												<ReviewDetailDialog review={review} />

												<DropdownMenuSeparator />

												<DropdownMenuSeparator />
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<DropdownMenuItem
															onSelect={(e) => e.preventDefault()}
															className="text-red-600">
															<ThumbsDown className="mr-2 h-4 w-4" />
															Remove review
														</DropdownMenuItem>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Remove Review</AlertDialogTitle>
															<AlertDialogDescription>
																Are you sure you want to remove this review?
																This action cannot be undone.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDeleteReview(review.id)}
																className="bg-red-600 hover:bg-red-700">
																Remove
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
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
