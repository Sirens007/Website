type UmamiStats = {
	pageviews?: number;
	visitors?: number;
	visits?: number;
	bounces?: number;
	totaltime?: number;
};

type UmamiStatsConfig = {
	websiteId?: string;
	apiEndpoint?: string;
	baseUrl?: string;
	shareUrl?: string;
	apiKey?: string;
	token?: string;
};

type UmamiShareConfig = {
	apiEndpoint: string;
	shareId: string;
};

type UmamiShareData = {
	id?: string;
	entityId?: string;
	shareId?: string;
	token?: string;
	websiteId?: string;
};

type UmamiShareDetails = {
	id?: string;
	entityId?: string;
	websiteId?: string;
};

declare global {
	interface Window {
		__umamiStatsConfig?: UmamiStatsConfig;
		oddmisc?: {
			getStats?: (path?: string) => Promise<UmamiStats>;
			getSiteStats?: () => Promise<UmamiStats>;
			getPageStats?: (path: string) => Promise<UmamiStats>;
		};
		fetchUmamiStats?: (options?: {
			path?: string;
			startAt?: number;
			endAt?: number;
		}) => Promise<UmamiStats>;
	}
}

const normalizeEndpoint = (value?: string) => value?.replace(/\/+$/, "") ?? "";

const getApiEndpoint = (config: UmamiStatsConfig) => {
	const explicitEndpoint = normalizeEndpoint(config.apiEndpoint);

	if (explicitEndpoint) {
		return explicitEndpoint;
	}

	if (config.apiKey) {
		return "https://api.umami.is/v1";
	}

	const baseUrl = normalizeEndpoint(config.baseUrl);

	if (!baseUrl) {
		return "";
	}

	return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
};

const getShareConfig = (config: UmamiStatsConfig): UmamiShareConfig | null => {
	if (!config.shareUrl) {
		return null;
	}

	try {
		const shareUrl = new URL(config.shareUrl);
		const pathParts = shareUrl.pathname.split("/");
		const shareIndex = pathParts.indexOf("share");
		const shareId = pathParts[shareIndex + 1];

		if (shareIndex === -1 || !shareId) {
			return null;
		}

		const apiPath = pathParts.slice(0, shareIndex).join("/");
		const apiEndpoint = normalizeEndpoint(
			config.apiEndpoint ||
				`${shareUrl.protocol}//${shareUrl.host}${apiPath}/api`,
		);

		return { apiEndpoint, shareId };
	} catch {
		return null;
	}
};

const getAuthHeaders = (config: UmamiStatsConfig): Record<string, string> => {
	if (config.apiKey) {
		return { "x-umami-api-key": config.apiKey };
	}

	if (config.token) {
		return { Authorization: `Bearer ${config.token}` };
	}

	return {};
};

const readTimestamp = (value: number | undefined, fallback: number) =>
	Number.isFinite(value) && value !== undefined && value >= 0
		? value
		: fallback;

const readStatsValue = (value: unknown) => {
	if (typeof value === "number") {
		return value;
	}

	if (value && typeof value === "object" && "value" in value) {
		const nestedValue = (value as { value?: unknown }).value;
		return typeof nestedValue === "number" ? nestedValue : 0;
	}

	return 0;
};

const normalizeStats = (stats: UmamiStats = {}) => ({
	pageviews: readStatsValue(stats.pageviews),
	visitors: readStatsValue(stats.visitors),
	visits: readStatsValue(stats.visits),
	bounces: readStatsValue(stats.bounces),
	totaltime: readStatsValue(stats.totaltime),
});

const statsCache = new Map<string, Promise<UmamiStats>>();
let shareDataPromise: Promise<UmamiShareData | null> | null = null;
let shareDetailsPromise: Promise<UmamiShareDetails | null> | null = null;

const getStatsFromOddmisc = ({ path }: { path?: string } = {}) => {
	if (!window.oddmisc) {
		return null;
	}

	if (path && window.oddmisc.getPageStats) {
		return window.oddmisc.getPageStats(path);
	}

	if (path && window.oddmisc.getStats) {
		return window.oddmisc.getStats(path);
	}

	if (window.oddmisc.getSiteStats) {
		return window.oddmisc.getSiteStats();
	}

	return null;
};

const waitForOddmiscStats = (options: { path?: string } = {}) =>
	new Promise<UmamiStats>((resolve, reject) => {
		const timeoutId = window.setTimeout(() => {
			reject(new Error("Umami share client did not load"));
		}, 3000);

		window.addEventListener(
			"oddmisc-ready",
			() => {
				window.clearTimeout(timeoutId);

				const statsPromise = getStatsFromOddmisc(options);
				if (!statsPromise) {
					reject(new Error("Umami share client is not available"));
					return;
				}

				statsPromise.then(resolve, reject);
			},
			{ once: true },
		);
	});

const hasDirectApiConfig = (config: UmamiStatsConfig) => {
	const authHeaders = getAuthHeaders(config);

	return Boolean(
		config.websiteId &&
		getApiEndpoint(config) &&
		Object.keys(authHeaders).length > 0,
	);
};

const hasShareConfig = (config: UmamiStatsConfig) =>
	Boolean(getShareConfig(config));

const fetchDirectUmamiStats = async ({
	path,
	startAt,
	endAt,
}: {
	path?: string;
	startAt?: number;
	endAt?: number;
}) => {
	const config = window.__umamiStatsConfig ?? {};
	const websiteId = config.websiteId;
	const apiEndpoint = getApiEndpoint(config);
	const authHeaders = getAuthHeaders(config);

	if (!websiteId || !apiEndpoint || Object.keys(authHeaders).length === 0) {
		throw new Error("Umami API is not configured for client-side access");
	}

	const params = new URLSearchParams({
		startAt: String(readTimestamp(startAt, 0)),
		endAt: String(readTimestamp(endAt, Date.now())),
	});

	if (path) {
		params.set("path", path);
	}

	const response = await fetch(
		`${apiEndpoint}/websites/${websiteId}/stats?${params.toString()}`,
		{
			headers: {
				Accept: "application/json",
				...authHeaders,
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch stats: ${response.status}`);
	}

	const stats = (await response.json()) as UmamiStats;

	return normalizeStats(stats);
};

const getShareData = async (shareConfig: UmamiShareConfig) => {
	shareDataPromise ??= fetch(
		`${shareConfig.apiEndpoint}/share/${shareConfig.shareId}`,
		{
			headers: {
				Accept: "application/json",
			},
		},
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error(
					`Failed to fetch Umami share data: ${response.status}`,
				);
			}

			return response.json() as Promise<UmamiShareData>;
		})
		.catch(() => null);

	return shareDataPromise;
};

const getShareDetails = async (
	shareConfig: UmamiShareConfig,
	shareData: UmamiShareData,
) => {
	const shareId = shareData.shareId ?? shareData.id;
	const shareToken = shareData.token;

	if (!shareId || !shareToken) {
		return null;
	}

	shareDetailsPromise ??= fetch(
		`${shareConfig.apiEndpoint}/share/id/${shareId}`,
		{
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${shareToken}`,
			},
		},
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error(
					`Failed to fetch Umami share details: ${response.status}`,
				);
			}

			return response.json() as Promise<UmamiShareDetails>;
		})
		.catch(() => null);

	return shareDetailsPromise;
};

const fetchSharedStatsWithHeaders = async ({
	apiEndpoint,
	websiteId,
	params,
	headers,
}: {
	apiEndpoint: string;
	websiteId: string;
	params: URLSearchParams;
	headers: Record<string, string>;
}) => {
	const response = await fetch(
		`${apiEndpoint}/websites/${websiteId}/stats?${params.toString()}`,
		{
			headers: {
				Accept: "application/json",
				...headers,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch shared Umami stats: ${response.status}`,
		);
	}

	return normalizeStats((await response.json()) as UmamiStats);
};

const fetchSharedUmamiStats = async ({
	path,
	startAt,
	endAt,
}: {
	path?: string;
	startAt?: number;
	endAt?: number;
}) => {
	const config = window.__umamiStatsConfig ?? {};
	const shareConfig = getShareConfig(config);

	if (!shareConfig) {
		throw new Error("Umami share URL is not configured");
	}

	const shareData = await getShareData(shareConfig);
	const shareDetails = shareData
		? await getShareDetails(shareConfig, shareData)
		: null;
	const shareToken = shareData?.token;
	const websiteId =
		shareDetails?.entityId ??
		shareDetails?.websiteId ??
		shareData?.entityId ??
		shareData?.websiteId ??
		config.websiteId;

	if (!shareToken || !websiteId) {
		throw new Error("Umami share data is missing website id or token");
	}

	const params = new URLSearchParams({
		startAt: String(readTimestamp(startAt, 0)),
		endAt: String(readTimestamp(endAt, Date.now())),
	});

	if (path) {
		params.set("path", path);
		params.set("filters", JSON.stringify({ path }));
	}

	try {
		return await fetchSharedStatsWithHeaders({
			apiEndpoint: shareConfig.apiEndpoint,
			websiteId,
			params,
			headers: { Authorization: `Bearer ${shareToken}` },
		});
	} catch (error) {
		return fetchSharedStatsWithHeaders({
			apiEndpoint: shareConfig.apiEndpoint,
			websiteId,
			params,
			headers: { "x-umami-share-token": shareToken },
		});
	}
};

window.fetchUmamiStats = async ({ path, startAt, endAt } = {}) => {
	const config = window.__umamiStatsConfig ?? {};
	const cacheKey = JSON.stringify({
		path: path ?? "",
		startAt: readTimestamp(startAt, 0),
		endAt: readTimestamp(endAt, 0),
	});

	if (statsCache.has(cacheKey)) {
		return statsCache.get(cacheKey)!;
	}

	const statsPromise = (async () => {
		if (hasShareConfig(config)) {
			return fetchSharedUmamiStats({ path, startAt, endAt });
		}

		if (hasDirectApiConfig(config)) {
			return fetchDirectUmamiStats({ path, startAt, endAt });
		}

		const oddmiscStats = getStatsFromOddmisc({ path });

		if (oddmiscStats) {
			return oddmiscStats;
		}

		return waitForOddmiscStats({ path });
	})();

	statsCache.set(cacheKey, statsPromise);

	return statsPromise;
};

window.dispatchEvent(new Event("umami-stats-ready"));

export {};
