/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		defaultLocale: "en",
		// Below are locales supported by DeepL
		locales: [
			"bg",
			"cs",
			"da",
			"de",
			"el",
			"en",
			"es",
			"et",
			"fi",
			"fr",
			"hu",
			"id",
			"it",
			"ja",
			"ko",
			"lt",
			"lv",
			"nb",
			"nl",
			"pl",
			"pt-BR",
			"pt-PT",
			"ro",
			"ru",
			"sk",
			"sl",
			"sv",
			"tr",
			"uk",
			"zh-HANS",
			"zh",
		],
	},
};

module.exports = nextConfig;
