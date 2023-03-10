import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { ApiError } from './utils/ApiError.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) =>{
            
            const { search } = req.query
            const tasks = database.select('tasks', {
                title: search,
                description: search
            });        

            return res.end(JSON.stringify(tasks))
        }

    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) =>{
            const { title, description } = req.body
            
            if(!title) throw new ApiError('O título da tarefa é obrigatório!')
            if(!description) throw new ApiError('A descrição da tarefa é obrigatória!')

            const task = {
                id: randomUUID(),
                title,
                description
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) =>{
            const { id } = req.params
            const { title, description } = req.body

            if(!title) throw new ApiError('O título da tarefa é obrigatório!')
            if(!description) throw new ApiError('A descrição da tarefa é obrigatória!')

            database.update('tasks', id, {
                title,
                description
            })

            return res.writeHead(204).end()
        }

    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) =>{
            const { id } = req.params
            const { isCompleted } = req.body
            
            database.patch('tasks', id, {  isCompleted: isCompleted === undefined ?  true : isCompleted })

            return res.writeHead(204).end()
        }

    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) =>{
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }

    }
]