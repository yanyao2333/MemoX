import { HomeSidebar, HomeSidebarDrawer } from "@/components/HomeSidebar";
import MemoEditor from "@/components/MemoEditor";
import MemoFilters from "@/components/MemoFilters";
import MemoView from "@/components/MemoView";
import MobileHeader from "@/components/MobileHeader";
import PagedMemoList from "@/components/PagedMemoList";
import useCurrentUser from "@/hooks/useCurrentUser";
import useResponsiveWidth from "@/hooks/useResponsiveWidth";
import { useMemoFilterStore } from "@/store/v1";
import { RowStatus } from "@/types/proto/api/v1/common";
import type { Memo } from "@/types/proto/api/v1/memo_service";
import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo } from "react";

const Home = () => {
	const { md } = useResponsiveWidth();
	const user = useCurrentUser();
	const memoFilterStore = useMemoFilterStore();

	const memoListFilter = useMemo(() => {
		const filters = [
			`creator == "${user.name}"`,
			`row_status == "NORMAL"`,
			"order_by_pinned == true",
		];
		const contentSearch: string[] = [];
		const tagSearch: string[] = [];
		for (const filter of memoFilterStore.filters) {
			if (filter.factor === "contentSearch") {
				contentSearch.push(`"${filter.value}"`);
			} else if (filter.factor === "tagSearch") {
				tagSearch.push(`"${filter.value}"`);
			} else if (filter.factor === "property.hasLink") {
				filters.push("has_link == true");
			} else if (filter.factor === "property.hasTaskList") {
				filters.push("has_task_list == true");
			} else if (filter.factor === "property.hasCode") {
				filters.push("has_code == true");
			} else if (filter.factor === "displayTime") {
				const filterDate = new Date(filter.value);
				const filterUtcTimestamp =
					filterDate.getTime() + filterDate.getTimezoneOffset() * 60 * 1000;
				const timestampAfter = filterUtcTimestamp / 1000;
				filters.push(`display_time_after == ${timestampAfter}`);
				filters.push(`display_time_before == ${timestampAfter + 60 * 60 * 24}`);
			}
		}
		// 当是搜索状态（即存在搜索内容或 tag 时），判断「包含评论」状态
		if (contentSearch.length > 0 || tagSearch.length > 0) {
			if (memoFilterStore.includeComments) {
				filters.push("include_comments == true");
			}
		}
		if (memoFilterStore.orderByTimeAsc) {
			filters.push("order_by_time_asc == true");
		}
		if (contentSearch.length > 0) {
			filters.push(`content_search == [${contentSearch.join(", ")}]`);
		}
		if (tagSearch.length > 0) {
			filters.push(`tag_search == [${tagSearch.join(", ")}]`);
		}
		return filters.join(" && ");
	}, [user, memoFilterStore.filters, memoFilterStore.orderByTimeAsc]);

	return (
		<section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
			{!md && (
				<MobileHeader>
					<HomeSidebarDrawer />
				</MobileHeader>
			)}
			<div
				className={clsx(
					"flex w-full flex-row items-start justify-start gap-4 px-4 sm:px-6",
				)}
			>
				<div className={clsx(md ? "w-[calc(100%-15rem)]" : "w-full")}>
					<MemoEditor className="mb-2" cacheKey="home-memo-editor" />
					<MemoFilters />
					<div className="flex w-full max-w-full flex-col items-start justify-start">
						<PagedMemoList
							renderer={(memo: Memo) => (
								<MemoView
									key={`${memo.name}-${memo.displayTime}`}
									memo={memo}
									showVisibility
									showPinned
									compact
								/>
							)}
							listSort={(memos: Memo[]) =>
								memos
									.filter((memo) => memo.rowStatus === RowStatus.ACTIVE)
									.sort((a, b) =>
										memoFilterStore.orderByTimeAsc
											? dayjs(a.displayTime).unix() -
												dayjs(b.displayTime).unix()
											: dayjs(b.displayTime).unix() -
												dayjs(a.displayTime).unix(),
									)
									.sort((a, b) => Number(b.pinned) - Number(a.pinned))
							}
							filter={memoListFilter}
							currentUser={user}
						/>
					</div>
				</div>
				{md && (
					<div className="-mt-6 sticky top-0 left-0 h-full w-56 shrink-0">
						<HomeSidebar className="py-6" />
					</div>
				)}
			</div>
		</section>
	);
};

export default Home;
