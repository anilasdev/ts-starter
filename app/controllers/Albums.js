let Album = require('../models').Album,
    { transaction } = require('objection'),
    { filterer } = require('../lib/filters')
module.exports = {
    async getAlbums(query = {}, pageNumber = 0, perPage = 20) {
        return {
            ...await filterer(query, Album, {
                pageNumber,
                perPage,
                related: query.related,
                orderBy: query.orderBy || 'id'
            }),
            page: pageNumber,
            per_page: perPage
        }

    },

    async getAlbum(id, query) {
        if (!id) {
            throw {
                message: 'ID Not Provided',
                statusCode: 400
            }
        }

        let theAlbum = await Album.query().findById(id).eager(query.related)

        if (!theAlbum) {
            throw {
                message: 'Album Not Found',
                statusCode: 404
            }
        }

        return theAlbum
    },

    async createAlbum(albumBody, userPermissions = {}) {
        const album = await transaction(
            Album,
            async (Album) => {
                var newAlbum = await Album.query().insert({
                    ...albumBody
                })

                return newAlbum
            }
        )

        return album

    },

    async editAlbum(id, newBody) {
        if (!id) {
            throw {
                message: 'ID Not Provided',
                statusCode: 400
            }
        }
        if (newBody.id) {
            delete newBody.id
        }
        let editedAlbum = await Album.query().patchAndFetchById(id, { ...newBody })

        if (!editedAlbum) {
            throw {
                message: 'Album Not Found',
                statusCode: 404
            }
        }

        return editedAlbum
    },

    async deleteAlbum(id) {

        if (!id) {
            throw {
                message: 'No ID Provided',
                statusCode: 400
            }
        }

        let deletedCount = await Album.query().patchAndFetchById(id, { is_deleted: true })
        await Promise.all(
            Object.keys(Album.getRelations()).map((relation) => {
                return deletedCount.$relatedQuery(relation).unrelate()
            })
        )

        if (deletedCount < 1) {
            throw {
                message: 'Album Not Found',
                statusCode: 404
            }
        }

        return deletedCount

    }

}
