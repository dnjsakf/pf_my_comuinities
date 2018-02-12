import session from 'express-session';
export default session({
    secret: "dolf@@c(*@_ASD",
    resave: false,
    saveUninitialized: true
});