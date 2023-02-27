/* eslint-disable camelcase */
import amqp from 'amqplib'
import LogCreateProject from './model/LogCreateProject.js'
import { notification } from './notification/sendWa.js'
import connect from './database/index.js'
import dotenv from 'dotenv'
import LogShowProject from './model/LogShowProject.js'
import LogUpdateProject from './model/LogUpdateProject.js'
import LogArchiveProject from './model/LogArchiveProject.js'
import LogUnarchiveProject from './model/LogUnarchiveProject.js'
import LogReopenProject from './model/LogReopenProject.js'
import LogCloseProject from './model/LogCloseProject.js'
import LogBookmarkProject from './model/LogBookmarkProject.js'
import LogDeleteProject from './model/LogDeleteProject.js'
dotenv.config()

const connected = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URI)

  const channel = await connection.createChannel()
  const queue = process.env.RABBITMQ_QUEUE

  channel.assertQueue(queue, { durable: true })

  channel.consume(queue, messages => {
    const data = messages.content.toString()
    const responseJson = JSON.parse(data)

    const { projectId, projectName, username: author, phoneNumber: phoneNumber_author, status, message, timestamp: date } = responseJson

    console.log(responseJson)
    // channel.ack(messages)

    try {
      const schema = {
        projectId,
        projectName,
        author,
        phoneNumber_author,
        status,
        message,
        date
      }

      if (status === 'create') {
        const logCreateProject = new LogCreateProject(schema)
        logCreateProject.save()
      }

      if (status === 'show') {
        const logShowProject = new LogShowProject(schema)
        logShowProject.save()
      }

      if (status === 'update') {
        const logUpdateProject = new LogUpdateProject(schema)
        logUpdateProject.save()
      }

      if (status === 'archive') {
        const logArchiveProject = new LogArchiveProject(schema)
        logArchiveProject.save()
      }

      if (status === 'unarchive') {
        const logUnarchiveProject = new LogUnarchiveProject(schema)
        logUnarchiveProject.save()
      }

      if (status === 'bookmark') {
        const logBookmarkProject = new LogBookmarkProject(schema)
        logBookmarkProject.save()
      }

      if (status === 'close') {
        const logCLoseProject = new LogCloseProject(schema)
        logCLoseProject.save()
      }

      if (status === 'reopen') {
        const logReopenProject = new LogReopenProject(schema)
        logReopenProject.save()
      }

      if (status === 'delete') {
        const logDeleteProject = new LogDeleteProject(schema)
        logDeleteProject.save()
      }

      console.log('Data telah masuk kedalam database')

      notification(responseJson.phoneNumber, 'Redmine', responseJson.message)
    } catch (error) {
      console.log(error)
    }
  }, { noAck: false })
}
connected()
connect()
