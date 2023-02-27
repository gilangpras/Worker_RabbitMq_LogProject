import amqp from 'amqplib'
import LogProject from './model/logProject.js'
import { notification } from './notification/sendWa.js'
import connect from './database/index.js'
import dotenv from 'dotenv'
dotenv.config()

const connected = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URI)

  const channel = await connection.createChannel()
  const queue = process.env.RABBITMQ_QUEUE

  channel.assertQueue(queue, { durable: true })

  channel.consume(queue, message => {
    const data = message.content.toString()
    const responseJson = JSON.parse(data)

    console.log(responseJson)
    channel.ack(message)

    const logProject = new LogProject({
      projectId: responseJson.projectId,
      projectName: responseJson.projectName,
      author: responseJson.username,
      phoneNumber_author: responseJson.phoneNumber,
      status: responseJson.status,
      message: responseJson.message,
      date: responseJson.timestamp
    })

    try {
      logProject.save()
      console.log('Data telah masuk kedalam database')

      notification(responseJson.phoneNumber, 'Redmine', responseJson.message)
    } catch (error) {
      console.log(error)
    }
  }, { noAck: false })
}
connected()
connect()
