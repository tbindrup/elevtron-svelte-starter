import { dirname } from "path";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import sass from "node-sass";

export default [
	{
		input: "src/main.js",
		output: [{ file: "dist/main.js", format: "cjs" }]
	},
	{
		input: "src/renderer.js",
		output: [{ file: "dist/renderer.js", format: "cjs" }],
		plugins: [
			svelte({
				include: "src/components/**/*.svelte",
				preprocess: {
					style: async ({ content, attributes, filename }) => {
						if (attributes.type !== "text/scss") return; // only process sass

						const { css, stats } = await new Promise((resolve, reject) =>
							sass.render(
								{
									file: filename,
									data: content,
									includePaths: [dirname(filename)]
								},
								(err, result) => {
									if (err) reject(err);
									else resolve(result);
								}
							)
						);

						return {
							code: css.toString(),
							dependencies: stats.includedFiles
						};
					}
				}
			}),
			resolve(),
			commonjs()
		]
	}
];
