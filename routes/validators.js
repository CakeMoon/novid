//====================AUTH====================

const ensureUserSignedIn = function(req, res, next) {
    if (!req.session.uid) {
        res.status(401).json({
            error: "You are not signed in. Please sign in."
        }).end();
        return;
    }
    next();
};

const ensureUserNotSignedIn = function(req, res, next) {
    if (req.session.uid) {
        res.status(400).json({
            error: "You are already signed in!"
        }).end();
        return;
    }
    next();
}

//====================BODY=====================

const ensureValidUsernameInBody = function(req, res, next) {
    if (!req.body.username) {
        res.status(400).json({
            error: "The username field must not be empty."
        }).end();
        return;
    }
    next();
};

const ensureValidPasswordInBody = function(req, res, next) {
    if (!req.body.password) {
        res.status(400).json({
            error: "The password field must not be empty."
        }).end();
        return;
    }
    next();
}


module.exports = {
    ensureUserSignedIn,
    ensureValidUsernameInBody,
    ensureValidPasswordInBody,
    ensureUserNotSignedIn
}