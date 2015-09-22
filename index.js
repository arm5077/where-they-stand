var express = require("express");
var app = express();
var GoogleSpreadsheet = require('google-spreadsheet');
var mysql = require("mysql");
var firstBy = require('thenBy.js');

// Open mysql pool of connections
var pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || "mysql://root@localhost/where_they_stand");
pool.on("error", function(err){  
	pool.end;
	return setTimeout(function(){ return connectMySQL() },3000);
});

// Turn on server
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});


// Set up static page (main page)
app.get("/", function(request, response){
	response.redirect(301,'/app');
});
app.use("/app", express.static(__dirname + "/public/"));

app.get("/api/candidates", function(request, response){	
	pool.getConnection(function(err, connection){
		if(err) throw err;
		connection.query('SELECT * FROM candidates', function(err, rows){
			if(err) throw err;
			rows.sort(
				firstBy(function(a,b){
					if(a.party > b.party) return -1;
					if(a.party < b.party) return 1;
					return 0;
				})
				.thenBy("last_name")
			);

			connection.release();
			response.status(200).json(rows);
		});
	});
});

app.get("/api/issues", function(request, response){	
	pool.getConnection(function(err, connection){
		if(err) throw err;
		connection.query('SELECT * FROM issues', function(err, rows){
			if(err) throw err;
			rows.sort(
				firstBy(function(a,b){
					if(a.title > b.title) return 1;
					if(a.title < b.title) return -1;
					return 0;
				})
			);

			connection.release();
			response.status(200).json(rows);
		});
	});
});

app.get("/api/candidates/:candidate", function(request, response){
	pool.getConnection(function(err, connection){
		if(err) throw err;
		
		request.params.candidate = request.params.candidate.replace("%20", " ");
		connection.query('SELECT * FROM positions JOIN issues ON issues.issue_id = positions.issue_id JOIN quotes ON quotes.issue_id = positions.issue_id AND quotes.candidate = positions.candidate JOIN candidates ON candidates.name = positions.candidate WHERE positions.candidate = ?', 
		[request.params.candidate], function(err, rows){
			if(err) throw err;
			if(rows.length > 0){
				candidate = {name: request.params.candidate, party: rows[0].party, issues: []};

				rows.forEach(function(row){
					// Has this isue been pushed to the array yet?
					if( candidate.issues.map(function(d){ return d.title }).indexOf(row.title) == -1 )
						candidate.issues.push({title: row.title, quote: row.quote, questions: []})

					var index = candidate.issues.map(function(d){ return d.title }).indexOf(row.title);

					candidate.issues[index].questions.push({ question: row.question, shortAnswer: row.short_answer, longAnswer: row.long_answer  });
				});

				response.status(200).json(candidate);
			}
			else {
				response.status(200).json({});
			}
			
		});
	});
});

app.get("/api/issues/:issue", function(request, response){
	pool.getConnection(function(err, connection){
		if(err) throw err;
		connection.query('SELECT * FROM positions JOIN issues ON issues.issue_id = positions.issue_id JOIN quotes ON quotes.issue_id = positions.issue_id AND quotes.candidate = positions.candidate JOIN candidates ON candidates.name = positions.candidate WHERE issues.title = ?', 
		[request.params.issue], function(err, rows){
			if(err) throw err;
			issue = {title: request.params.issue, intro: rows[0].intro, candidates: []};
			
			rows.forEach(function(row){
				// Has this isue been pushed to the array yet?
				if( issue.candidates.map(function(d){ return d.name }).indexOf(row.candidate) == -1 )
					issue.candidates.push({name: row.candidate, party: row.party, quote: row.quote, questions: []})

				var index = issue.candidates.map(function(d){ return d.name }).indexOf(row.candidate);

				issue.candidates[index].questions.push({ question: row.question, shortAnswer: row.short_answer, longAnswer: row.long_answer  });
			});
			
			response.status(200).json(issue);
		});
	});
});

// Launch scraper
app.get("/api/scrape", function(request, response){	

	var spreadsheet_email = process.env.SPREADSHEET_EMAIL;
	var spreadsheet_key = process.env.SPREADSHEET_KEY;	

	var Spreadsheet = new GoogleSpreadsheet('1k1lRURGd4NXY4G1_VQJUbJgA9yHAZdD4bWvB9Pybs1o');

	// Log into master Where They Stand spreadsheet
	Spreadsheet.useServiceAccountAuth({
		client_email: spreadsheet_email,
		private_key: spreadsheet_key
	}, function(err){
		if(err) throw err;

		// Get info about master Where They Stand spreadsheet
		Spreadsheet.getInfo( function(err, info){
			if(err) throw err;
			console.log(info);
		
			// Open up a connection from the pool
			pool.getConnection(function(err, connection){

				// Truncate existing candidates
				connection.query('TRUNCATE TABLE candidates', error);
				connection.query('TRUNCATE TABLE positions', error);
				connection.query('TRUNCATE TABLE issues', error);
				connection.query('TRUNCATE TABLE quotes', error);
			
				// Loop through worksheets
				info.worksheets.forEach(function(worksheet){
					console.log("Looking at " + worksheet.title + " worksheet");

					// Check to see if worksheet contains candidates
					if( worksheet.title == "Candidates - don't delete!" ){
	
						// Add each candidate to the database
						worksheet.getRows(function(err, rows){
							if( err ) throw err;
							rows.forEach(function(row){
								connection.query('INSERT INTO candidates (name, first_name, last_name, party) VALUES (?, ?, ?, ?)', [row.name, row.firstname, row.lastname, row.party], error);
							});
						});
					}
					// OK, it's not a candidate, so it must be an issue
					else {
						worksheet.getRows(function(err, rows){
							var questions = [];
							var issue_id = null;
						
							// Add issue and get issue_id
							questions = getQuestions(rows[0], questions);
							connection.query('INSERT INTO issues (title, intro) VALUES (?, ?)', [rows[0].titlefirstlineonly, rows[0].introfirstlineonly], error);
							connection.query('SELECT issue_id FROM issues WHERE title = ?', [rows[0].titlefirstlineonly], function(err, issues){
								if(err) throw err;
								else issue_id = issues[0].issue_id;
							
								// Cycle through rows
								rows.forEach(function(row, index){
									// So it's not the first row, it's a candidate with answers. LET'S RECORD THEM.
									if( index != 0 ){
										// Cycle through questions...
										questions.forEach(function(question, i){
											connection.query('INSERT INTO positions (issue_id, candidate, question, short_answer, long_answer) VALUES (?, ?, ?, ?, ?)', [issue_id, row.candidate, question, row['shortanswer' + (i+1)], row['longanswer' + (i+1)] ], error);
										});
									
										// Add the quote
										connection.query('INSERT INTO quotes (issue_id, candidate, quote, context) VALUES (?, ?, ?, ?)', [issue_id, row.candidate, row.quote, row.quotecontext ], error);
									}
								});
							});
						});
					}
				});
			});	
		});	
	});
	
	function getQuestions(row, questions){
		// Let's get the questions first
		var i = 1;
		while(true){
			if( !row['shortanswer' + i] )
				break;
			else {
				questions.push(row['shortanswer' + i]);
				i++;
			}
		}
		return questions;
	}
});



function error(err){
	if(err) throw err
}
