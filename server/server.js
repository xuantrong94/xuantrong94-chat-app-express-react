const app = require('./src/app')
const {
  app: { port }, token
} = require('./src/configs/env.config')
const logger = require('./src/utils/logger')

// console.log(app.get('env'))
// console.log(process.env)

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
    message: err.message,
    stack: err.stack,
  })
  process.exit(1)
})

const server = app.listen(port, () => {
  console.log(`Server is running on  port ${port}`)
})

//* sigint is a signal that is sent to the process when you press ctrl+c
process.on('SIGINT', () => {
  console.log('Server is shutting down...')
  server.close(() => {
    console.log('Server is closed')
    process.exit(0)
  })
})
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
    message: err.message,
    stack: err.stack,
  })
  server.close(() => {
    process.exit(1)
  })
})
