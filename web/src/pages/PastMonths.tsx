import {
	ExploreSidebar,
	ExploreSidebarDrawer,
} from "@/components/ExploreSidebar";
import MemoFilters from "@/components/MemoFilters";
import MemoView from "@/components/MemoView";
import MobileHeader from "@/components/MobileHeader";
import PagedMemoList from "@/components/PagedMemoList";
import useCurrentUser from "@/hooks/useCurrentUser";
import { RowStatus } from "@/types/proto/api/v1/common";
import clsx from "clsx";
import dayjs from "dayjs";
import useResponsiveWidth from "@/hooks/useResponsiveWidth";
import { useMemoFilterStore, useMemoList, useMemoStore } from "@/store/v1";
import type { Memo } from "@/types/proto/api/v1/memo_service";
import { useTranslate } from "@/utils/i18n";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import Empty from "../components/Empty";

interface Props {
	renderer: (memo: Memo) => JSX.Element;
	listSort?: (list: Memo[]) => Memo[];
}

const MemoList = (props: Props) => {
	const t = useTranslate();
	const { md } = useResponsiveWidth();
	const memoStore = useMemoStore();
	const memoList = useMemoList();
	const [isRequesting, setIsRequesting] = useState(true);
	const sortedMemoList = props.listSort
		? props.listSort(memoList.value)
		: memoList.value;

	const fetchMoreMemos = async () => {
		setIsRequesting(true);
		await memoStore.getPastMonthsMemos({
			// 暂时硬编码为查询前 12 个月的 memos
			months: 12,
		});
		setIsRequesting(false);
	};

	const refreshList = async () => {
		memoList.reset();
		fetchMoreMemos();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: 只在页面加载时运行一次
	useEffect(() => {
		refreshList();
	}, []);

	const children = (
		<>
			{sortedMemoList.map((memo) => props.renderer(memo))}
			{isRequesting && (
				<div className="my-4 flex w-full flex-row items-center justify-center">
					<LoaderIcon className="animate-spin text-zinc-500" />
				</div>
			)}
			{!isRequesting && sortedMemoList.length === 0 && (
				<div className="mt-12 mb-8 flex w-full flex-col items-center justify-center italic">
					<Empty />
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						{t("message.no-data")}
					</p>
				</div>
			)}
		</>
	);

	// In case of md screen, we don't need pull to refresh.
	if (md) {
		return children;
	}

	return (
		<PullToRefresh
			onRefresh={() => refreshList()}
			pullingContent={
				<div className="my-4 flex w-full flex-row items-center justify-center">
					<LoaderIcon className="opacity-60" />
				</div>
			}
			refreshingContent={
				<div className="my-4 flex w-full flex-row items-center justify-center">
					<LoaderIcon className="animate-spin" />
				</div>
			}
		>
			{children}
		</PullToRefresh>
	);
};

const PastMonths = () => {
	const { md } = useResponsiveWidth();
	const user = useCurrentUser();
	const memoFilterStore = useMemoFilterStore();

	return (
		<section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
			{!md && <MobileHeader />}
			<div
				className={clsx(
					"flex w-full flex-row items-start justify-start gap-4 px-4 sm:px-6",
				)}
			>
				<div className="flex w-full max-w-full flex-col items-start justify-start">
					<MemoList
						renderer={(memo: Memo) => (
							<MemoView
								key={`${memo.name}-${memo.updateTime}`}
								memo={memo}
								showCreator
								showVisibility
								compact
							/>
						)}
						listSort={(memos: Memo[]) =>
							memos
								.filter((memo) => memo.rowStatus === RowStatus.ACTIVE)
								.sort((a, b) =>
									memoFilterStore.orderByTimeAsc
										? dayjs(a.displayTime).unix() - dayjs(b.displayTime).unix()
										: dayjs(b.displayTime).unix() - dayjs(a.displayTime).unix(),
								)
						}
					/>
				</div>
			</div>
		</section>
	);
};

export default PastMonths;
