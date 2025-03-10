const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const jwt = require('jsonwebtoken');

// load models
const { List, Task, User } = require('./db/models');

// middlewares

// load middleware
app.use(bodyParser.json());

// CORS headers middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    next();
});

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    // console.log('Token Received:', token); 
    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - do not authenticate
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// verify refresh tokens middleware
let verifySession = ((req, res, next) => {
    // grab refresh token from request headerheader
    let refreshToken = req.header('x-refresh-token');

    // grab the _id form request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldnt be found
            return Promise.reject({
                'error': 'User not found.'
            });
        }

        // if the user was found (refresh token exist in db)
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // session is valid 
            next();
        } else {
            // session not valid
            return Promise.reject({
                'error': 'Refresh token has expired or session is invalid.'
            })
        }
    }).catch((e) => {
        res.status(401).send(e);
    })
});



// route handlers

// list routes

// get all lists
app.get('/lists', authenticate, (req, res) => {
    // return array of all lists in database
    List.find({
        _userId: req.user_id
    })
        .then(lists => res.send(lists))
        .catch(err => res.status(500).json({ error: 'Server error' }));
    
});

// create a list
app.post('/lists', authenticate, (req, res) => {
    // create a new list
    let title = req.body.title;
    let newList = new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc) => {
        // the full document is returned with id
        res.send(listDoc);
    })
});

// update a specific list
app.patch('/lists/:id', authenticate, (req, res) => {
    // update a list specified by id
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});


// delete a specific list
app.delete('/lists/:id', authenticate, (req, res) => {
    // delete a list specified by id
    List.findOneAndDelete({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all tasks that are in the deleted list
        deleteTaskFromList(removedListDoc._id);
    });
});

// get all tasks in a specific list
app.get('/lists/:listId/tasks', authenticate, (req, res) => {
    // return all tasks that belong to a specific list 
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    });
});

// get a specific task in a specific list
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    // return a specific task that belongs to a specific list
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    });
});

// create a task in a specific list
app.post('/lists/:listId/tasks', authenticate, (req, res) => {
    // create a new task in a list specified by listId

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object is valid
            // therefore the current auth'ed user can create task
            return true;
        }
        return false; // list object is invalid or not found
    }).then(canCreateTask => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

// update a specific task in a specific list
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    // update a task specified by taskId in a list specified by listId

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id 
    }).then((list) => {
        if (list) {
            // list object is valid
            // therefore the current auth'ed user can update task
            return true;
        }
        return false; // list object is invalid or not found
    }).then((canUpdateTask) => {
        if (canUpdateTask) {
            // the current auth'ed user can update the task
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                $set: req.body
            }).then(() => {
                res.send({ message: 'updated task' })
            });
        } else {
            res.sendStatus(404);
        }
    });
});

// delete a specific task in a specific list
app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    // delete a task specified by taskId in a list specified by listId

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id 
    }).then((list) => {
        if (list) {
            // list object is valid
            // therefore the current auth'ed user can update task
            return true;
        }
        return false; // list object is invalid or not found
    }).then((canDeleteTask) => {
        if (canDeleteTask) {
            Task.findOneAndDelete({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            });
        } else {
            res.sendStatus(404);
        }        
    });
});



// user routes

// signup routes
app.post('/users', (req, res) => {
    // user signup

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // session created succesfully
        // generate an access auth token for the user
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // construct and send response to user with auth tokens in header and user obj in body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send({ newUser });
    }).catch((e) => {
        res.status(400).send({ e });
    })
})

// login routes
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // session created succesfully
            // generate an access auth token for user
            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated succesfully
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // now construct and send the response to user with auth tokens in header and user object in body
            res
            .header('x-access-token', authTokens.accessToken)
            .header('x-refresh-token', authTokens.refreshToken)
            .send(user);
        })
    }).catch((e) => {
        res.status(400).send({ e });
    });
})

// genrates and return the access token
app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send({ e });
    });
})


// helper methods
let deleteTaskFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log('Tasks from ' + _listId + ' were deleted!');
    });
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});