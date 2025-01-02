import csv from "csv-parser"; 
import fs from "fs";

const results = [];

const getProfileImageUrl = (url) => {
	const googleDriveLinkRegex = /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view.*/;
	const googleDriveLinkRegexMatches = url.match(googleDriveLinkRegex);
	if (googleDriveLinkRegexMatches) {
		const fileId = googleDriveLinkRegexMatches[1];
		return `https://lh3.googleusercontent.com/d/${fileId}`;
	} else {
		return url;
	}
}


fs.createReadStream(
	"./src/assets/2024 Hackomania Organizing Team Members - Sheet1.csv",
)
	.pipe(csv())
	.on("data", (data) => results.push(data))
	.on("end", () => {
		const jsonArray = results.map((row) => {
			return {
				Team: row.Team,
				Name: row.Name,
				Role: row.Role || `Team - Core Member`,
				"Profile Image": getProfileImageUrl(row["Profile Image"]),
				LinkedIn: row.LinkedIn,
				Twitter: row.Twitter,
				GitHub: row.GitHub,
			};
		});

		const result = jsonArray
		
		fs.open("./src/assets/team.json", "w", (err, fd) => {
			if (err) {
				console.error(err);
				return;
			}

			fs.writeFile(fd, JSON.stringify(result, null, 4), (err) => {
				if (err) {
					console.error(err);
				}

				fs.close(fd, (err) => {
					if (err) {
						console.error(err);
					}
				});
			});
		});
	});