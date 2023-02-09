// execute this file to import csv: node streams/import-tasks-from-csv.js

import fs from 'node:fs'
import { parse } from 'csv-parse';

const csvPath = new URL('./tasks.csv', import.meta.url)

const tasksFile = fs.createReadStream(csvPath, 'utf-8')

async function importCsv() {
    const fileToParse = tasksFile.pipe(parse({
        delimiter: ',',
        skipEmptyLines: true,
        fromLine: 2
    }))
    
    for await (const task of fileToParse) {  
        
        const [title, description] = task;
    
        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},       
            body: JSON.stringify({
                title,
                description
            }),   
        }) 
    }
}

importCsv()