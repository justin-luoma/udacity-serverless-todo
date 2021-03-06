import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {getUserId} from '../utils';
import {createTodo} from '../../businessLogic/todos'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const newTodo: CreateTodoRequest = JSON.parse(event.body)
            //  Implement creating a new TODO item
            const userId = getUserId(event);

            const todoItem = await createTodo(userId, newTodo);

            return {
                statusCode: 201,
                body: JSON.stringify({
                    item: todoItem
                })
            };
        } catch (e) {
            return {
                statusCode: 500,
                body: JSON.stringify(e)
            }
        }
    });

handler.use(
    cors({
        credentials: true
    })
)
