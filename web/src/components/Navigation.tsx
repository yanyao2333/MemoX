import useCurrentUser from "@/hooks/useCurrentUser";
import { Routes } from "@/router";
import { useInboxStore } from "@/store/v1";
import { Inbox_Status } from "@/types/proto/api/v1/inbox_service";
import { useTranslate } from "@/utils/i18n";
import { Tooltip } from "@mui/joy";
import clsx from "clsx";
import {
	ArchiveIcon,
	BellIcon,
	CalendarIcon,
	Globe2Icon,
	HomeIcon,
	LogInIcon,
	PaperclipIcon,
	SettingsIcon,
	SmileIcon,
	User2Icon,
} from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserBanner from "./UserBanner";

interface NavLinkItem {
	id: string;
	path: string;
	title: string;
	icon: React.ReactNode;
}

interface Props {
	collapsed?: boolean;
	className?: string;
}

const Navigation = (props: Props) => {
	const { collapsed, className } = props;
	const t = useTranslate();
	const user = useCurrentUser();
	const inboxStore = useInboxStore();
	const hasUnreadInbox = inboxStore.inboxes.some(
		(inbox) => inbox.status === Inbox_Status.UNREAD,
	);

	useEffect(() => {
		if (!user) {
			return;
		}

		inboxStore.fetchInboxes();
		// Fetch inboxes every 5 minutes.
		const timer = setInterval(
			async () => {
				await inboxStore.fetchInboxes();
			},
			1000 * 60 * 5,
		);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const homeNavLink: NavLinkItem = {
		id: "header-home",
		path: Routes.ROOT,
		title: t("common.home"),
		icon: <HomeIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const resourcesNavLink: NavLinkItem = {
		id: "header-resources",
		path: Routes.RESOURCES,
		title: t("common.resources"),
		icon: <PaperclipIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const exploreNavLink: NavLinkItem = {
		id: "header-explore",
		path: Routes.EXPLORE,
		title: t("common.explore"),
		icon: <Globe2Icon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const profileNavLink: NavLinkItem = {
		id: "header-profile",
		path: user ? `/u/${encodeURIComponent(user.username)}` : "",
		title: t("common.profile"),
		icon: <User2Icon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const inboxNavLink: NavLinkItem = {
		id: "header-inbox",
		path: Routes.INBOX,
		title: t("common.inbox"),
		icon: (
			<>
				<div className="relative">
					<BellIcon className="h-auto w-6 shrink-0 opacity-70" />
					{hasUnreadInbox && (
						<div className="absolute top-0 left-5 h-2 w-2 rounded-full bg-blue-500" />
					)}
				</div>
			</>
		),
	};
	const archivedNavLink: NavLinkItem = {
		id: "header-archived",
		path: Routes.ARCHIVED,
		title: t("common.archived"),
		icon: <ArchiveIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const settingNavLink: NavLinkItem = {
		id: "header-setting",
		path: Routes.SETTING,
		title: t("common.settings"),
		icon: <SettingsIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const signInNavLink: NavLinkItem = {
		id: "header-auth",
		path: Routes.AUTH,
		title: t("common.sign-in"),
		icon: <LogInIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const aboutNavLink: NavLinkItem = {
		id: "header-about",
		path: Routes.ABOUT,
		title: t("common.about"),
		icon: <SmileIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};
	const pastMonthsLink: NavLinkItem = {
		id: "header-past-months",
		path: Routes.PAST_MONTHS,
		title: t("common.past-months"),
		icon: <CalendarIcon className="h-auto w-6 shrink-0 opacity-70" />,
	};

	const navLinks: NavLinkItem[] = user
		? [
				homeNavLink,
				resourcesNavLink,
				exploreNavLink,
				pastMonthsLink,
				profileNavLink,
				inboxNavLink,
				archivedNavLink,
				settingNavLink,
			]
		: [exploreNavLink, signInNavLink, aboutNavLink];

	return (
		<header
			className={clsx(
				"hide-scrollbar z-30 flex h-full w-full flex-col items-start justify-start overflow-auto py-4 md:pt-6",
				className,
			)}
		>
			<UserBanner collapsed={collapsed} />
			<div className="flex w-full shrink-0 flex-col items-start justify-start space-y-2 px-1 py-2">
				{navLinks.map((navLink) => (
					<NavLink
						className={({ isActive }) =>
							clsx(
								"flex flex-row items-center rounded-2xl border px-2 py-2 text-gray-800 text-lg hover:border-gray-200 hover:bg-white dark:text-gray-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800",
								collapsed ? "" : "w-full px-4",
								isActive
									? "border-gray-200 bg-white drop-shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
									: "border-transparent",
							)
						}
						key={navLink.id}
						to={navLink.path}
						id={navLink.id}
						viewTransition
					>
						{props.collapsed ? (
							<Tooltip title={navLink.title} placement="right" arrow>
								<div>{navLink.icon}</div>
							</Tooltip>
						) : (
							navLink.icon
						)}
						{!props.collapsed && (
							<span className="ml-3 truncate">{navLink.title}</span>
						)}
					</NavLink>
				))}
			</div>
		</header>
	);
};

export default Navigation;
