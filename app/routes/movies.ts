let { getMovies, getMovie, createMovie, deleteMovie, editMovie } = require('../controllers/Movies')
import * as express from 'express'
import { Result } from '../types/common'

module.exports = (router: express.Router) => {
  router.get('/', async (req, res) => {
    try {
      var movies = await getMovies(req.query, req.query.page, req.query.perPage)
    } catch (error) {
      if (error.statusCode === 500) {
        console.error(error)
      }
      let errResponse = formatResponse({ error }, true)
      let status = errResponse.status || 500
      delete errResponse.status
      return res.status(status).json({
        ...errResponse,
      })
    }

    let response = formatResponse(movies)
    let status = response.status || 200
    delete response.status

    return res.status(status || 200).json({
      ...response,
    })
  })

  router.get('/:id', async (req, res) => {
    try {
      var movie = await getMovie(req.params.id, req.query)
    } catch (error) {
      if (error.statusCode === 500) {
        console.error(error)
      }
      let errResponse = formatResponse({ error }, true)
      let status = errResponse.status || 500
      delete errResponse.status
      return res.status(status).json({
        ...errResponse,
      })
    }

    let response = formatResponse(movie)
    let status = response.status || 200
    delete response.status

    return res.status(status || 200).json({
      ...response,
    })
  })

  router.post('/', async (req, res) => {
    try {
      var movie = await createMovie(req.body)
    } catch (error) {
      if (error.statusCode === 500) {
        console.error(error)
      }
      let errResponse = formatResponse({ error }, true)
      let status = errResponse.status || 500
      delete errResponse.status
      return res.status(status).json({
        ...errResponse,
      })
    }

    let response = formatResponse(movie)
    let status = response.status || 200
    delete response.status

    return res.status(status || 200).json({
      ...response,
    })
  })

  router.patch('/:id', async (req, res) => {
    try {
      var movie = await editMovie(req.params.id, req.body)
    } catch (error) {
      if (error.statusCode === 500) {
        console.error(error)
      }
      let errResponse = formatResponse({ error }, true)
      let status = errResponse.status || 500
      delete errResponse.status
      return res.status(status).json({
        ...errResponse,
      })
    }

    let response = formatResponse(movie)
    let status = response.status || 200
    delete response.status

    return res.status(status || 200).json({
      ...response,
    })
  })

  router.delete('/:id', async (req, res) => {
    try {
      var movie = await deleteMovie(req.params.id)
    } catch (error) {
      if (error.statusCode === 500) {
        console.error(error)
      }
      let errResponse = formatResponse({ error }, true)
      let status = errResponse.status || 500
      delete errResponse.status
      return res.status(status).json({
        ...errResponse,
      })
    }

    return res.json(formatResponse(movie))
  })

  return router
}

function formatResponse(result: Result, isError = false) {
  if (isError === true) {
    return {
      message: result.error.message.message || result.error.message,
      success: false,
      status: result.error.statusCode,
    }
  }
  return {
    ...result,
    success: true,
    status: 200,
  }
}
