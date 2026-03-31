// 本地番剧数据配置
export interface AnimeItem {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
}

const localAnimeList: AnimeItem[] = [
	{
		title: "凸变英雄X",
		status: "watching",
		rating: 9.5,
		cover: "/assets/anime/tobe.webp",
		description: "这是一个由人们的信赖造就英雄的世界",
		episodes: "24 episodes",
		year: "2025",
		genre: ["奇幻", "战斗"],
		studio: "BeDream",
		link: "https://www.bilibili.com/bangumi/media/md28340128",
		progress: 24,
		totalEpisodes: 24,
		startDate: "2025-04",
		endDate: "2025-09",
	},
	{
		title: "突变英雄 BABA",
		status: "completed",
		rating: 9.8,
		cover: "/assets/anime/baba.webp",
		description: "厕所吸入，帅爸变英雄",
		episodes: "12 episodes",
		year: "2016",
		genre: ["日常", "治愈"],
		studio: "STUDIO.LAN！",
		link: "https://www.bilibili.com/bangumi/media/md5430",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2016-10",
		endDate: "2016-12",
	},
	{
		title: "名侦探柯南",
		status: "watching",
		rating: 9.7,
		cover: "/assets/anime/mzt.webp",
		description: "真相只有一个！",
		episodes: "1250 episodes",
		year: "2022",
		genre: ["推理", "悬疑"],
		studio: "V1Studio",
		link: "https://www.bilibili.com/bangumi/media/md28228775",
		progress: 1253,
		totalEpisodes: 	1253,
		startDate: "1996-01",
		endDate: "2025-10",
	},
];

export default localAnimeList;
