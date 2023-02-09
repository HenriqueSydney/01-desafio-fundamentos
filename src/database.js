import fs from 'node:fs/promises'
import { ApiError } from './utils/ApiError.js'
import { getCurrentDate } from './utils/currentDate.js'

const databasePath = new URL('../db.json', import.meta.url)


export class Database{
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    } 

    select(table, search){
        let data = this.#database[table] ?? []
        
        if(search.title && search.description){          
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    insert(table, data) {

        const now = getCurrentDate();
      
        data.completed_at = null
        data.create_at = now
        data.updated_at = now

        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist();

        return data
    }

    update(table, id, data){          

        const rowIndex = this.#database[table] ? this.#database[table].findIndex(row => row.id === id) : -1

        if(rowIndex > -1){            
            const savedData = this.#database[table][rowIndex]
            const now = getCurrentDate()

            savedData.title = data.title
            savedData.description = data.description
            savedData.updated_at = now

            this.#database[table][rowIndex] = { ...savedData }
            this.#persist()
        } else {
            throw new ApiError('Tarefa não localizada'); 
        }
    }

    patch(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
       
        if(rowIndex> -1){
            const savedData = this.#database[table][rowIndex]
            const now = getCurrentDate()
            savedData.completed_at = data.isCompleted ? now : null
    
            this.#database[table][rowIndex] = { ...savedData }
            this.#persist()
        } else {
            throw new ApiError('Tarefa não localizada'); 
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex> -1){
            this.#database[table].splice(rowIndex,1)
            this.#persist()
        } else {
            throw new ApiError('Tarefa não localizada'); 
        }
    }

}