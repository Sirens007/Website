// Timeline data configuration file
// Used to manage data for the timeline page

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // If empty, it means current
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "website" | "certificate" | "project" | "other";
	}[];
	icon?: string; // Iconify icon name
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [
	{
		id: 'computer-science-degree',
		title: '信息安全学士学位',
		description: '系统学习计算机科学基础理论，包括数据结构、算法、操作系统、数据库等核心课程。',
		type: 'education',
		startDate: '2024-09-01',
		location: '长春',
		organization: '长春理工大学',
		skills: ['Java', 'C++', 'MySQL', 'Linux'],
		achievements: [
			'GPA: 3.14/5.0',
			'获得校级优秀学生奖学金',
			'参与多个课程项目和实习'
		],
		icon: 'material-symbols:school',
		color: '#eaec64ff',
		featured: true
	},
	// {
	// 	id: "mizuki-blog-project",
	// 	title: "Mizuki Personal Blog Project",
	// 	description:
	// 		"A personal blog website developed using the Astro framework as a practical project for learning frontend technologies.",
	// 	type: "project",
	// 	startDate: "2024-06-01",
	// 	endDate: "2024-08-01",
	// 	skills: ["Astro", "TypeScript", "Tailwind CSS", "Git"],
	// 	achievements: [
	// 		"Mastered modern frontend development tech stack",
	// 		"Learned responsive design and user experience optimization",
	// 		"Completed the full process from design to deployment",
	// 	],
	// 	links: [
	// 		{
	// 			name: "GitHub Repository",
	// 			url: "https://github.com/example/mizuki-blog",
	// 			type: "project",
	// 		},
	// 		{
	// 			name: "Live Demo",
	// 			url: "https://mizuki-demo.example.com",
	// 			type: "website",
	// 		},
	// 	],
	// 	icon: "material-symbols:code",
	// 	color: "#7C3AED",
	// 	featured: true,
	// },
	// {
	// 	id: "summer-internship-2024",
	// 	title: "Frontend Development Intern",
	// 	description:
	// 		"Summer internship at an internet company, participating in frontend development of web applications.",
	// 	type: "work",
	// 	startDate: "2024-07-01",
	// 	endDate: "2024-08-31",
	// 	location: "Beijing",
	// 	organization: "TechStart Internet Company",
	// 	position: "Frontend Development Intern",
	// 	skills: ["React", "JavaScript", "CSS3", "Git", "Figma"],
	// 	achievements: [
	// 		"Completed user interface component development",
	// 		"Learned team collaboration and code standards",
	// 		"Received outstanding internship performance certificate",
	// 	],
	// 	icon: "material-symbols:work",
	// 	color: "#DC2626",
	// 	featured: true,
	// },
	// {
	// 	id: "web开发课程",
	// 	title: "已完成的web开发在线课程",
	// 	description:
	// 		"完成了全栈web开发在线课程，系统学习了前后端开发技术。",
	// 	type: "achievement",
	// 	startDate: "2024-01-15",
	// 	endDate: "2024-05-30",
	// 	organization: "Mooc网站",
	// 	skills: ["HTML", "CSS", "JavaScript", "Node.js", "Express"],
	// 	achievements: [
	// 		"已获得课程结业证书",
	// 		"完成5个实际项目",
	// 		"掌握了全栈开发基础",
	// 	],
	// 	links: [
	// 		{
	// 			name: "Course Certificate",
	// 			url: "https://certificates.example.com/web-dev",
	// 			type: "certificate",
	// 		},
	// 	],
	// 	icon: "material-symbols:verified",
	// 	color: "#059669",
	// },
	// {
	// 	id: "student-management-system",
	// 	title: "Student Management System Course Project",
	// 	description:
	// 		"Final project for the database course, developed a complete student information management system.",
	// 	type: "project",
	// 	startDate: "2023-11-01",
	// 	endDate: "2023-12-15",
	// 	skills: ["Java", "MySQL", "Swing", "JDBC"],
	// 	achievements: [
	// 		"Received excellent course project grade",
	// 		"Implemented complete CRUD functionality",
	// 		"Learned database design and optimization",
	// 	],
	// 	icon: "material-symbols:database",
	// 	color: "#EA580C",
	// },
	{
		id: 'Provincial Education System Cyber Defense Exercise',
		title: '吉林省教育系统网络安全攻防演习',
		description: '负责线下信息搜集访问校园内网，实施近源攻击，最终荣获“优秀攻击队”称号',
		type: 'achievement',
		startDate: '2025-10-02',
		endDate: '2025-10-09',
		location: '长春',
		organization: '吉林省教育厅',
		skills: ['MySQL', 'Python', 'Linux', '内网', '信息搜集'],
		achievements: [
			'荣获“优秀攻击队”称号',
			'线下信息搜集访问校园内网',
			'对内网横向扫描，搜集大量资产'
		],
		icon: 'material-symbols:verified',
		color: '#ba25ebff',
		featured: true
	},
	{
		id: 'Cybersecurity Attack and Defense Competition',
		title: '第三届“古剑山”全国大学生网络攻防大赛',
		description: '负责Web，Crypto方向题目的flag获取，最终荣获省级三等奖',
		type: 'achievement',
		startDate: '2025-11-29',
		endDate: '2025-11-29',
		location: '线上',
		organization: '中共重庆市委网络安全和信息化委员办公室、重庆移通学院',
		position: 'Web、crypto方向',
		skills: ['PHP反序列化', 'Python', 'Linux', 'RSA', 'ssrf'],
		achievements: [
			'荣获第三届“古剑山”全国大学生网络攻防大赛省级三等奖',
			'积累了加密算法绕过与身份认证测试',
			'带领团队拿到web、crypto方向题目的flag'
		],
		icon: 'material-symbols:verified',
		color: '#25eb7eff',
		featured: true
	},
	{
		id: 'information-security-competition',
		title: '第22届全国大学生信息安全竞赛',
		description: '负责Web方向题目的flag获取，最终荣获信息安全竞赛国家级三等奖',
		type: 'achievement',
		startDate: '2025-05-01',
		endDate: '2025-07-02',
		location: '长春',
		organization: '中国兵工学会、北京理工大学、中国兵工学会信息安全与对抗专业委员会',
		position: 'Web方向',
		skills: ['PHP反序列化', 'Python', 'java', 'MySQL', '图片上传'],
		achievements: [
			'荣获信息安全竞赛国家级三等奖',
			'积累了信息搜集、加密算法绕过与身份认证测试',
			'带领团队拿到web方向题目的flag'
		],
		icon: 'material-symbols:verified',
		color: '#2563EB',
		featured: true
	},
	{
		id: 'edusrc-first-vulnerability',
		title: '第一次挖到教育SRC漏洞',
		description: '通过信息收集与接口分析，成功提交第一个教育SRC漏洞。',
		type: 'achievement',
		startDate: '2024-11-15',
		endDate: '2024-11-15',
		location: '线上',
		organization: '教育漏洞报告平台edusrc',
		skills: ['Burpsuite应用','参数构造', '弱口令利用'],
		achievements: [
			'成功挖掘并提交首个教育SRC漏洞',
			'掌握了 sign、timestamp 等参数分析与模拟请求方法',
			'提升了对接口认证绕过和验证码爆破的理解'
		],
		icon: 'mdi:shield-search',
		color: '#10B981',
		featured: true
	},
	{
		id: "english-certificate",
		title: "英语四级证书",
		description: "通过了大学英语四级考试，具备了基本的英语读写能力。",
		type: "achievement",
		startDate: '2024-12-27',
		endDate: '2025-01-27',
		organization: "全国大学英语四、六级考试委员会",
		achievements: [
			"四级成绩：470分",
			"提升了英语技术文档阅读能力",
			"为后续学习国外技术资料打下基础",
		],
		links: [
			{
				name: "CET-4 Certificate",
				url: "https://certificates.example.com/cet4",
				type: "certificate",
			},
		],
		icon: "material-symbols:translate",
		color: "#f57490ff",
	},
	{
		id: 'programming-start',
		title: '开始编程学习',
		description: '第一次接触编程，从C语言和C++开始，逐步学习Java和其他技术。',
		type: 'education',
		startDate: '2024-07-01',
		skills: ['C语言', 'C++', 'Java'],
		achievements: [
			'完成了第一个编程语法学习',
			'掌握了C/C++基本语法',
			'培养了对编程的兴趣'
		],
		icon: 'material-symbols:code',
		color: '#7C3AED'
	},
];

// Get timeline statistics
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education")
			.length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement")
			.length,
	};

	return { total, byType };
};

// Get timeline items by type
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
};

// Get featured timeline items
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
};

// Get current ongoing items
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};

// Calculate total work experience
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
