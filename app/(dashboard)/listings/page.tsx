"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
	Plus,
	Edit,
	Trash2,
	Building,
	Wifi,
	Car,
	Coffee,
	Tv,
	Bath,
	Search,
	Eye,
	Image as ImageIcon,
	Users,
	DollarSign,
	Star,
	Snowflake,
	Fan,
	Loader2,
} from "lucide-react";
import {
	useCreateListingMutation,
	useDeleteListingMutation,
	useGetListingsQuery,
	useUpdateListingMutation,
} from "@/store/features/Listing";
import { toast } from "sonner";

// ... (other imports remain the same)

interface Listing {
	bookings: [];
	description: string;
	id: number;
	images: [
		{
			id: number;
			url: string;
		}
	];
	reviews: [];
	title: string;
	type: string;
	user: {
		id: number;
		name: string;
		email: string;
	};
	doubleOccupancy: number;
	singleOccupancy: number;
}

function getRoomTypeColor(type: string) {
	switch (type) {
		case "AC":
			return "bg-blue-100 w-fit p-2 px-3 text-blue-800";
		case "NonAC":
			return "bg-green-100 w-fit p-2 px-3 text-green-800";
		case "Both":
			return "bg-purple-100 w-fit p-2 px-3 text-purple-800";
		default:
			return "bg-gray-100 w-fit p-2 px-3 text-gray-800";
	}
}

function getRoomTypeIcon(type: string) {
	switch (type) {
		case "AC":
			return <Snowflake className="h-3 w-3" />;
		case "NonAC":
			return <Fan className="h-3 w-3" />;
		case "Both":
			return (
				<div className="flex gap-1">
					<Snowflake className="h-2 w-2" />
					<Fan className="h-2 w-2" />
				</div>
			);
		default:
			return null;
	}
}

export default function ListingsPage() {
	const [listings, setListings] = useState<Listing[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
	const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [editListing, setEditListing] = useState<Listing | null>(null);

	const [newListing, setNewListing] = useState({
		title: "",
		description: "",
		singleOccupancy: 0,
		doubleOccupancy: 0,
		type: "AC" as "AC" | "NonAC" | "Both",
		images: [] as File[], // New images to upload
		existingImages: [] as { id?: number; url: string }[], // Existing images from server
	});

	useEffect(() => {
		if (editListing) {
			setNewListing({
				title: editListing.title,
				description: editListing.description,
				singleOccupancy: editListing.singleOccupancy,
				doubleOccupancy: editListing.doubleOccupancy,
				type: editListing.type as "AC" | "NonAC" | "Both",
				images: [], // New images start empty
				existingImages: editListing.images, // Load existing images
			});
		} else {
			setNewListing({
				title: "",
				description: "",
				singleOccupancy: 0,
				doubleOccupancy: 0,
				type: "AC",
				images: [],
				existingImages: [],
			});
		}
	}, [editListing]);

	

	const [deleteListingMutation, { isLoading: isDeleteLoading }] =
		useDeleteListingMutation();

	const handleDeleteListing = async (id: number) => {
		const res = await deleteListingMutation({ id }).unwrap();
		if (res.success) {
			toast.success(res.message);
			refetch();
		}
	};

	const handleViewListing = (listing: Listing) => {
		setSelectedListing(listing);
		setIsViewDialogOpen(true);
	};

	const { data, refetch } = useGetListingsQuery({
		search: "",
	});
	const listingData = data?.data || [];
	const listingStats = {
		total: listingData.length,
		ac: listingData.filter((l) => l.type === "AC").length,
		nonAc: listingData.filter((l) => l.type === "NonAC").length,
		both: listingData.filter((l) => l.type === "Both").length,
	};
const filteredListings = listingData.filter((listing) => {
		const matchesSearch =
			listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			listing.user.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = typeFilter === "all" || listing.type === typeFilter;

		return matchesSearch && matchesType;
	});
	const [
		addListing,
		{
			isLoading: isCreateListingLoading,
			isError: isCreateError,
			error: createError,
		},
	] = useCreateListingMutation();

	const [
		updateListing,
		{
			isLoading: isUpdateListingLoading,
			isError: isUpdateError,
			error: updateError,
		},
	] = useUpdateListingMutation();

	const handleSubmitListing = async () => {
		try {
			const formData = new FormData();
			formData.append("title", newListing.title);
			formData.append("description", newListing.description);
			formData.append("singleOccupancy", String(newListing.singleOccupancy));
			formData.append("doubleOccupancy", String(newListing.doubleOccupancy));
			formData.append("type", newListing.type);
			newListing.images.forEach((image) => {
				formData.append("images", image);
			});
			if (newListing.existingImages.length > 0) {
				formData.append(
					"existingImages",
					JSON.stringify(newListing.existingImages.map((img) => img.id))
				);
			}

			let response;
			if (editListing) {
				response = await updateListing({
					id: editListing.id,
					formData,
				}).unwrap();
			} else {
				response = await addListing(formData).unwrap();
			}

			if (response.success) {
				toast.success(response.message);
				refetch();
			}

			setNewListing({
				title: "",
				description: "",
				singleOccupancy: 0,
				doubleOccupancy: 0,
				type: "AC",
				images: [],
				existingImages: [],
			});
			setEditListing(null);
			setIsCreateDialogOpen(false);
		} catch (err) {
			console.error("Failed to process listing:", err);
			toast.error("Failed to process listing");
		}
	};

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Listings
						</CardTitle>
						<Building className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{listingStats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">AC Rooms</CardTitle>
						<Snowflake className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{listingStats.ac}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Non-AC Rooms</CardTitle>
						<Fan className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{listingStats.nonAc}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Both Types</CardTitle>
						<div className="flex gap-1">
							<Snowflake className="h-3 w-3 text-purple-500" />
							<Fan className="h-3 w-3 text-purple-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{listingStats.both}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Listing Management */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Listing Management</CardTitle>
							<CardDescription>
								Manage student accommodation listings
							</CardDescription>
						</div>
						<Dialog
							open={isCreateDialogOpen}
							onOpenChange={(open) => {
								setIsCreateDialogOpen(open);
								if (!open) setEditListing(null);
							}}>
							<DialogTrigger asChild>
								<Button>
									<Plus className="mr-2 h-4 w-4" />
									Add Listing
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>
										{editListing
											? `Update ${editListing.title}`
											: "Create New Listing"}
									</DialogTitle>
									<DialogDescription>
										{editListing
											? "Update existing accommodation listing"
											: "Add a new student accommodation listing"}
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-6 py-4">
									<div className="space-y-2">
										<Label htmlFor="title">Title</Label>
										<Input
											id="title"
											value={newListing.title}
											onChange={(e) =>
												setNewListing((prev) => ({
													...prev,
													title: e.target.value,
												}))
											}
											placeholder="e.g., Cozy Single Room Near Campus"
										/>
									</div>

									<div className="grid grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="single-occupancy">
												Single Occupancy (₹)
											</Label>
											<Input
												id="single-occupancy"
												type="number"
												value={newListing.singleOccupancy}
												onChange={(e) =>
													setNewListing((prev) => ({
														...prev,
														singleOccupancy: parseInt(e.target.value),
													}))
												}
												placeholder="8000"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="double-occupancy">
												Double Occupancy (₹)
											</Label>
											<Input
												id="double-occupancy"
												type="number"
												value={newListing.doubleOccupancy}
												onChange={(e) =>
													setNewListing((prev) => ({
														...prev,
														doubleOccupancy: parseInt(e.target.value),
													}))
												}
												placeholder="12000"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="type">Room Type</Label>
											<Select
												value={newListing.type}
												onValueChange={(value: "AC" | "NonAC" | "Both") =>
													setNewListing((prev) => ({ ...prev, type: value }))
												}>
												<SelectTrigger>
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="AC">AC</SelectItem>
													<SelectItem value="NonAC">Non-AC</SelectItem>
													<SelectItem value="Both">Both</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<ImageUpload
										value={newListing.images}
										existingImages={newListing.existingImages}
										onChange={(newImages, existingImages) =>
											setNewListing((prev) => ({
												...prev,
												images: newImages,
												existingImages,
											}))
										}
										maxImages={4}
									/>

									<div className="space-y-2">
										<Label htmlFor="description">Description</Label>
										<Textarea
											id="description"
											value={newListing.description}
											onChange={(e) =>
												setNewListing((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
											placeholder="Describe the accommodation..."
											rows={4}
										/>
									</div>
								</div>
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										onClick={() => {
											setIsCreateDialogOpen(false);
											setEditListing(null);
										}}>
										Cancel
									</Button>
									<Button
										disabled={isCreateListingLoading || isUpdateListingLoading}
										onClick={handleSubmitListing}>
										<Loader2
											className={`mr-2 ${
												isCreateListingLoading || isUpdateListingLoading
													? "animate-spin"
													: "hidden"
											}`}
										/>
										{isCreateListingLoading || isUpdateListingLoading
											? "Processing..."
											: editListing
											? "Update Listing"
											: "Create Listing"}
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="mb-4 flex gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search listings..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-8"
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
								<SelectItem value="Both">Both</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Images</TableHead>
								<TableHead>Title</TableHead>
								<TableHead>Owner</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Single/Double</TableHead>
								<TableHead>Bookings</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredListings.map((listing) => (
								<TableRow key={listing.id}>
									<TableCell>
										<div className="flex items-center gap-1">
											{listing.images.length > 0 ? (
												<div className="flex -space-x-1">
													{listing.images.slice(0, 3).map((image, index) => (
														<div
															key={index}
															className="h-8 w-8 rounded border-2 border-background overflow-hidden">
															<img
																src={`http://localhost:5000${image.url}` || ""}
																alt={`${listing.title} image ${index + 1}`}
																className="h-full w-full object-cover"
															/>
														</div>
													))}
													{listing.images.length > 3 && (
														<div className="h-8 w-8 rounded border-2 border-background bg-muted flex items-center justify-center">
															<span className="text-xs text-muted-foreground">
																+{listing.images.length - 3}
															</span>
														</div>
													)}
												</div>
											) : (
												<div className="h-8 w-8 rounded border-2 border-dashed border-border flex items-center justify-center">
													<ImageIcon className="h-3 w-3 text-muted-foreground" />
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{listing.title}</div>
											<div className="text-sm text-muted-foreground">
												{listing.description.slice(0, 50)}...
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{listing.user.name}</div>
											<div className="text-sm text-muted-foreground">
												{listing.user.email}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={getRoomTypeColor(listing.type)}>
											<div className="flex items-center gap-1">
												{getRoomTypeIcon(listing.type)}
												{listing.type}
											</div>
										</Badge>
									</TableCell>
									<TableCell>
										<div className="text-sm">
											<div>₹{listing.singleOccupancy.toLocaleString()}</div>
											<div className="text-muted-foreground">
												₹{listing.doubleOccupancy.toLocaleString()}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Users className="h-3 w-3 text-muted-foreground" />
											{listing.bookings.length}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3 text-yellow-500 fill-current" />
											<span className="text-xs text-muted-foreground">
												({listing.reviews.length} reviews)
											</span>
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleViewListing(listing)}>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												onClick={() => {
													setEditListing(listing);
													setIsCreateDialogOpen(true);
												}}
												size="sm">
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDeleteListing(listing.id)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Listing View Dialog */}
			<Dialog
				open={isViewDialogOpen}
				onOpenChange={setIsViewDialogOpen}>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>{selectedListing?.title}</DialogTitle>
						<DialogDescription>
							Detailed view of listing information
						</DialogDescription>
					</DialogHeader>
					{selectedListing && (
						<div className="space-y-4">
							{selectedListing.images.length > 0 && (
								<div className="space-y-2">
									<Label>Listing Images</Label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{selectedListing.images.map((image, index) => (
											<div
												key={index}
												className="rounded-lg border overflow-hidden">
												<img
													src={`http://localhost:5000${image.url}` || ""}
													alt={`${selectedListing.title} image ${index + 1}`}
													className="w-full h-full object-cover"
												/>
											</div>
										))}
									</div>
								</div>
							)}

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<Label className="text-muted-foreground">
										Single Occupancy
									</Label>
									<p>₹{selectedListing.singleOccupancy.toLocaleString()}</p>
								</div>
								<div>
									<Label className="text-muted-foreground">
										Double Occupancy
									</Label>
									<p>₹{selectedListing.doubleOccupancy.toLocaleString()}</p>
								</div>
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground">Room Type</Label>
									<Badge
										variant="secondary"
										className={getRoomTypeColor(selectedListing.type)}>
										<div className="flex items-center gap-1">
											{getRoomTypeIcon(selectedListing.type)}
											{selectedListing.type}
										</div>
									</Badge>
								</div>
								<div>
									<Label className="text-muted-foreground">Owner</Label>
									<p>{selectedListing.user.name}</p>
								</div>
							</div>

							<div>
								<Label className="text-muted-foreground">Description</Label>
								<p className="mt-1">{selectedListing.description}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="text-muted-foreground">
										Total Bookings
									</Label>
									<p className="text-2xl font-bold">
										{selectedListing.bookings.length}
									</p>
								</div>
								<div>
									<Label className="text-muted-foreground">
										Average Rating
									</Label>
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-1">
											<Star className="h-4 w-4 text-yellow-500 fill-current" />
											<span className="text-sm text-muted-foreground">
												({selectedListing.reviews.length} reviews)
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
