// Import File System module ('fs') to work with file system
const fs = require('node:fs');
const crypto = require('node:crypto');

// Read the CSV file
const csvFile = 'database.csv';
const csvContent = fs.readFileSync(csvFile, 'utf8');

// Parse the CSV content into rows
let rows = csvContent.split('\n');

// Extract the header row
const header = rows[0];

// Remove rows with '-' character in the third column
rows = rows.filter(row => !row.includes('-'));

// Create an array of hashed values by mapping over rows (excluding the header)
const hashedValues = rows.slice(1).map((row, index) => {
    // Split the current row into an array of columns using ',' as the delimiter
    const columns = row.split(',');
    // Extract and trim the original value from the third column
    const originalValue = columns[2].trim();
    // Calculate the SHA-256 hash of the original value
    const hash = crypto.createHash('sha256').update(originalValue).digest('hex');
    // Replace the original value in the third column with the calculated hash
    columns[2] = ` ${hash}`;
    // Rewrite the value in the first column with sequential numbers (starting from 1)
    columns[0] = `${index + 1}`;
    // Join the modified columns back into a CSV-formatted string for the current row
    return columns.join(',');
});


// Create a new CSV content, preserving the header
const newCsvContent = [header, ...hashedValues].join('\n');

// Write the new CSV content to a new file
const newCsvFilePath = 'filtered_database.csv';
fs.writeFileSync(newCsvFilePath, newCsvContent, 'utf8');






