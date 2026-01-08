// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Phone: [
		{
			name: "iPhone15",
			image: "/images/device/iPhone15.png",
			specs: "黑色 / 6G + 256GB",
			description:
				"A16 仿生芯片，出色影像系统，全新 USB-C",
			link: "https://support.apple.com/zh-cn/111831",
		},
				{
			name: "小米9SE",
			image: "/images/device/xiaomi9SE.png",
			specs: "深空灰 / 6G + 64GB",
			description:
				"骁龙 712，IMX586 影像，紧凑小屏设计",
			link: "https://www.mi.com/mi9se/specs",
		},
	],
	Computer: [
		{
			name: "Lenovo Y7000p 2024",
			image: "/images/device/Lenovo-Y7000p-2024.png",
			specs: "i7-14700HX / 16G + 1TB",
			description:
				"英特尔14代酷睿， 4060显卡，144Hz电竞屏",
			link: "https://item.lenovo.com.cn/product/1035316.html",
		},
				{
			name: "HUAWEI MateBook E 2022",
			image: "/images/device/matebooke2022.png",
			specs: "i5-1130G7 / 8G + 256GB",
			description:
				"12 代英特尔® 处理器，轻薄二合一触控屏，2K触控屏",
			link: "https://consumer.huawei.com/cn/laptops/matebook-e-2022/specs/",
		},
	],
};
