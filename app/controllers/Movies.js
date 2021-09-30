let Movie = require('../models').Movie,
    { transaction } = require('objection'),
    { filterer } = require('../lib/filters')
module.exports = {
    async getMovies(query = {}, pageNumber = 0, perPage = 20) {
        return {
            ...await filterer(query, Movie, {
                pageNumber,
                perPage,
                related: query.related,
                orderBy: query.orderBy || 'id'
            }),
            page: pageNumber,
            per_page: perPage
        }

    },

    async getMovie(id, query) {
        if (!id) {
            throw {
                message: 'ID Not Provided',
                statusCode: 400
            }
        }

        let theMovie = await Movie.query().findById(id).eager(query.related)

        if (!theMovie) {
            throw {
                message: 'Movie Not Found',
                statusCode: 404
            }
        }

        return theMovie
    },

    async createMovie(movieBody, userPermissions = {}) {
        const movie = await transaction(
            Movie,
            async (Movie) => {
                var newMovie = await Movie.query().insert({
                    ...movieBody
                })

                return newMovie
            }
        )

        return movie

    },

    async editMovie(id, newBody) {
        if (!id) {
            throw {
                message: 'ID Not Provided',
                statusCode: 400
            }
        }
        if (newBody.id) {
            delete newBody.id
        }
        let editedMovie = await Movie.query().patchAndFetchById(id, { ...newBody })

        if (!editedMovie) {
            throw {
                message: 'Movie Not Found',
                statusCode: 404
            }
        }

        return editedMovie
    },

    async deleteMovie(id) {

        if (!id) {
            throw {
                message: 'No ID Provided',
                statusCode: 400
            }
        }

        let deletedCount = await Movie.query().patchAndFetchById(id, { is_deleted: true })
        await Promise.all(
            Object.keys(Movie.getRelations()).map((relation) => {
                return deletedCount.$relatedQuery(relation).unrelate()
            })
        )

        if (deletedCount < 1) {
            throw {
                message: 'Movie Not Found',
                statusCode: 404
            }
        }

        return deletedCount

    }

}
