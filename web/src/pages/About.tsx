import MobileHeader from "@/components/MobileHeader";
import { Link } from "@mui/joy";

const About = () => {
	return (
		<section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
			<MobileHeader />
			<div className="w-full px-4 sm:px-6">
				<div className="flex w-full flex-col items-start justify-start rounded-xl bg-white px-4 py-3 text-black shadow dark:bg-zinc-800 dark:text-gray-300">
					<p className="text-2xl font-bold">MemoX</p>
					<p>
						Repo:{" "}
						<Link
							href="https://github.com/yanyao2333/memox"
							className=""
							target="_blank"
							rel="noreferrer"
						>
							yanyao2333/memox
						</Link>
					</p>
					<p>
						Based on{" "}
						<Link
							href="https://www.usememos.com"
							className=""
							target="_blank"
							rel="noreferrer"
						>
							usememos/memos
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default About;
