var express = require('express');
var tokenMiddleware = require('../middleware/token');

var Book = require('../models/book');

var router = express.Router();

router.get('/:ISBN', tokenMiddleware.verifyToken, function getBook(request, response) {

    console.log(request.params);

    Book
        .findOne({
            ISBN: request.params.ISBN
        })
        .exec(function handleQuery(error, book) {

            if (error) {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });

                throw error;
            }

            if (! book) {
                response.status(404).json({
                    success: false,
                    message: "Can't find book with isbn " + request.params.ISBN + "."
                });

                return;
            }

            response.json({
                success: true,
                event: book
            });
        });
});


router.post('/create', tokenMiddleware.verifyTokenForEditor, function createBook(request, response) {

    console.log(request.body);

    // find the user
    Book.findOne({
        ISBN: request.body.ISBN
    }, function handleQuery(error, book) {

        if (error) {
            response.status(500).json({
                success: false,
                message: 'Internal server error'
            });

            throw error;
        }

        if (book) {
            response.status(400).json({
                success: false,
                message: 'Book present'
            });

            return response;
        }

        var book = new Book({
            ISBN: request.body.ISBN,
            author: request.body.author,
            title: request.body.title,
            genre: request.body.genre
        });

        book.save(function (error) {

            if (error) {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });

                throw error;
            }

            response.json({
                success: true,
                book: book
            });
        });
    });
});

router.get('/', tokenMiddleware.verifyToken, function getAllBooks(request, response) {
    Book.find({})
        .populate('books')
        .exec(function handleQuery(error, books) {

            if (error) {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });

                throw error;
            }

            if (! books) {
                response.status(404).json({
                    success: false,
                    message: "Can't find event with id " + request.params.eventId + "."
                });

                return;
            }

            response.json({
                success: true,
                books: books
            });
        });
});
module.exports = router;