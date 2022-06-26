// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate';
import {createAttachmentPresignedUrl, getAttachmentBucketUrl} from "../fileStorage/attachmentUtils";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

// const XAWS = AWSXRay.captureAWS(AWS)
//
// const logger = createLogger('TodosAccess')

// Implement the dataLayer logic


export class TodosAccess {
    constructor(
        private readonly docClient = new DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX,
    ) {
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise();

        return todoItem;
    }

    async updateTodo(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {

        const updatedItem = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ConditionExpression: 'todoId = :todoId',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            },
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            }
        }).promise()

        return updatedItem.Attributes as TodoUpdate
    }

    async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise()
    }

    async getSignedUploadUrl(userId: string, todoId: string): Promise<string> {
        const attachmentUrl = createAttachmentPresignedUrl(todoId);

        this.docClient.update(
            {
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: "set attachmentUrl = :attachmentUrl",
                ExpressionAttributeValues: {
                    ":attachmentUrl": getAttachmentBucketUrl(todoId),
                }
            }
        );

        return attachmentUrl
    }
}
