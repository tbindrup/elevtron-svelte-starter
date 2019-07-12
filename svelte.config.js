const { dirname } = require("path");
const sass = require("node-sass");

module.exports = {
	preprocess: {
		style: async ({ content, attributes, filename }) => {
			// only process sass
			if (attributes.type !== "text/scss") {
				return;
			}

			const { css, map, stats } = await new Promise((resolve, reject) =>
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
				code: css.toString("utf8"),
				map: map.toString("utf8"),
				dependencies: stats.includedFiles
			};
		}
	}
};
