const Yup = require("yup");

const formSchema = Yup.object({
    username: Yup.string()
    .required("Username required")
    .min(1, "Username too short")
    .max(28, "Username too long!"),
    password: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
});

const validateForm = (formData) => { 
    const validationErrors = []; //   Объявите   validationErrors   здесь

    formSchema
        .validate(formData)
        .catch(err => {
            validationErrors.push(...err.errors); //   Добавьте   ошибки   в   массив   validationErrors
            //console.log(err.errors);
            return true; //   Прекратите   выполнение   validateForm
        });

    return validationErrors; //   Возвращайте   validationErrors
};

module.exports = validateForm; 
