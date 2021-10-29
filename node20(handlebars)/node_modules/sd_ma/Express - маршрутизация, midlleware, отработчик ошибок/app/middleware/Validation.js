const yup = require('yup');

const addUserSchema = yup.object().shape({
    Id: yup.number().required(),
    userName: yup.string().trim().required(),
    userSurname: yup.string().trim().required(),
    userBirth_date: yup.date().required(),
    userPassword: yup.string().min(4).max(20).required(),
    userMail: yup.email().required(),
    userScore: yup.number().required(),
});

const updateUserSchema = yup.object().shape({
    userName: yup.string().trim().required(),
    userSurname: yup.string().trim().required(),
    userBirth_date: yup.date().required(),
    userPassword: yup.string().min(4).max(20).required(),
    userMail: yup.string().email().required(),
    userScore: yup.number().required(),
});

function Validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.validate(req.body);
            await next();
        } catch (e) {
            const payload = req.body;
            payload.errorMessage = `Make sure each field has a valid value. ${e}`;
            return res.status(400).send(payload);
        }
    };
}

module.exports = {
    Validate,
    addUserSchema,
    updateUserSchema,
};
