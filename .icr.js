module.exports = function() {
	try {
		const fs = require("fs");
		const ljf = require('load-json-file')

		async function incrementPackage(){
		    const file = await ljf("package.json");
		    file.build.number++;
		    var curDate = new Date();
		    file.build.date = `${curDate.getFullYear()}_${curDate.getMonth()}_${curDate.getDate()}`;
		    file.build.timestamp = Math.round(curDate.valueOf()/1000);

		    fs.writeFile("./package.json", JSON.stringify(file,null,"\t"), function writeJSON(err) {
		        if (err) return console.log(err);
		        console.log("incremented package number");
		    });
		}

		incrementPackage()
	} catch (e) {
		console.error(e);
		process.exit(1)
	}
}
