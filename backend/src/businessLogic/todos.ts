import {TodosAccess} from '../dataLayer/todosAcess'
import {TodoItem} from '../models/TodoItem'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import {TodoUpdate} from "../models/TodoUpdate";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

// TODO: Implement businessLogic

const bucketName = process.env.ATTACHMENT_S3_BUCKET;

const todosAccess = new TodosAccess();

export async function createTodo(user: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()
    return await todosAccess.createTodo({
        userId: user,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    })
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todosAccess.getTodosForUser(userId);
}

export async function deleteTodo(userId: string, todoId: string) {
    return await todosAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(userId: string, todoId: string): Promise<string> {
    return await todosAccess.getSignedUploadUrl(userId, todoId);
}

export async function updateTodo(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {
    return await todosAccess.updateTodo(userId, todoId, todoUpdate);
}
