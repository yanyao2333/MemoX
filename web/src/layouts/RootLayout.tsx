import Navigation from "@/components/Navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import useResponsiveWidth from "@/hooks/useResponsiveWidth";
import Loading from "@/pages/Loading";
import { Routes } from "@/router";
import { useMemoFilterStore } from "@/store/v1";
import { useTranslate } from "@/utils/i18n";
import { Tooltip } from "@mui/joy";
import { Button } from "@usememos/mui";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useLocalStorage from "react-use/lib/useLocalStorage";

const RootLayout = () => {
	const t = useTranslate();
	const location = useLocation();
	const { sm } = useResponsiveWidth();
	const currentUser = useCurrentUser();
	const memoFilterStore = useMemoFilterStore();
	const [collapsed, setCollapsed] = useLocalStorage<boolean>(
		"navigation-collapsed",
		false,
	);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (
			!currentUser &&
			(
				[
					Routes.ROOT,
					Routes.RESOURCES,
					Routes.INBOX,
					Routes.ARCHIVED,
					Routes.SETTING,
					Routes.PAST_MONTHS,
				] as string[]
			).includes(location.pathname)
		) {
			window.location.href = Routes.EXPLORE;
			return;
		}
		setInitialized(true);
	}, []);

	useEffect(() => {
		// When the route changes, remove all filters.
		memoFilterStore.removeFilter(() => true);
	}, [location.pathname]);

	return initialized ? (
		<div className="min-h-full w-full">
			<div
				className={clsx(
					"mx-auto flex w-full flex-row items-start justify-center transition-all",
					collapsed ? "sm:pl-16" : "sm:pl-56",
				)}
			>
				{sm && (
					<div
						className={clsx(
							"group fixed top-0 left-0 z-2 flex h-full select-none flex-col items-start justify-start border-r bg-zinc-50 transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-800 dark:bg-opacity-40",
							collapsed ? "w-16 px-2" : "w-56 px-4",
						)}
					>
						<Navigation className="!h-auto" collapsed={collapsed} />
						<div
							className={clsx(
								"flex h-auto w-full grow flex-col justify-end",
								collapsed ? "items-center" : "items-start",
							)}
						>
							<div
								className={clsx(
									"hidden flex-col items-center justify-center py-3 group-hover:flex",
								)}
								onClick={() => setCollapsed(!collapsed)}
							>
								{collapsed ? (
									<Tooltip title={t("common.expand")} placement="right" arrow>
										<Button className="rounded-xl" variant="plain">
											<ChevronRightIcon className="h-auto w-5 opacity-70" />
										</Button>
									</Tooltip>
								) : (
									<Button className="rounded-xl" variant="plain">
										<ChevronLeftIcon className="mr-1 h-auto w-5 opacity-70" />
										{t("common.collapse")}
									</Button>
								)}
							</div>
						</div>
					</div>
				)}
				<main className="flex h-auto w-full shrink flex-grow flex-col items-center justify-start">
					<Suspense fallback={<Loading />}>
						<Outlet />
					</Suspense>
				</main>
			</div>
		</div>
	) : (
		<Loading />
	);
};

export default RootLayout;
