"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	LayoutDashboard,
	Building,
	Users,
	Calendar,
	GraduationCap,
	Settings,
	LogOut,
	User,
	Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogoutMutation } from "@/store/baseApi";
import { toast } from "sonner";

const menuItems = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Listings",
		url: "/listings",
		icon: Building,
	},
	{
		title: "Users",
		url: "/users",
		icon: Users,
	},
	{
		title: "Bookings",
		url: "/bookings",
		icon: Calendar,
	},
	{
		title: "Reviews",
		url: "/reviews",
		icon: Star,
	},
];

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const [logout] = useLogoutMutation();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const response = await logout().unwrap();
			if (response.success) {
				router.push("/login");
				setTimeout(() => {
					toast.success(response.message);
				}, 800);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Logout failed");
		}
	};
	return (
		<SidebarProvider>
			<Sidebar variant="inset">
				<SidebarHeader>
					<div className="flex items-center gap-2 px-2 py-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<GraduationCap className="h-4 w-4" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold text-sidebar-foreground">
								Kanchenjunga
							</span>
							<span className="truncate text-xs text-sidebar-foreground/70">
								Admin Dashboard
							</span>
						</div>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menuItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={
												item.url === "/"
													? pathname === "/"
													: pathname.startsWith(item.url)
											}>
											<Link href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup className="mt-auto">
						<SidebarGroupContent>
							<SidebarMenu>
								{/* <SidebarMenuItem>
									<SidebarMenuButton asChild>
										<button>
											<Settings />
											<span>Settings</span>
										</button>
									</SidebarMenuButton>
								</SidebarMenuItem> */}
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<button onClick={handleLogout}>
											<LogOut />
											<span>Logout</span>
										</button>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 h-4"
					/>

					<div className="flex flex-1 items-center justify-between">
						<div className="flex items-center gap-4">
							<h1 className="text-lg font-semibold">
								{menuItems.find((item) =>
									item.url === "/"
										? pathname === "/"
										: pathname.startsWith(item.url)
								)?.title || "Dashboard"}
							</h1>

							{/* <div className="relative hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings, users..."
                  className="pl-8 w-64"
                />
              </div> */}
						</div>

						<div className="flex items-center gap-2">
							<ThemeToggle />

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-8 w-8 rounded-full">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src="/avatars/01.png"
												alt="Admin"
											/>
											<AvatarFallback>AD</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-56"
									align="end"
									forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												Admin User
											</p>
											{/* <p className="text-xs leading-none text-muted-foreground">
												admin@studentstay.com
											</p> */}
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{/* <DropdownMenuItem>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator /> */}
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
