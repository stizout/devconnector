const validator = require('validator');
const isEmpty = (val) => {
  return (
    val === undefined ||
    val === null || 
    typeof(val) === 'object' && Object.keys(val).length === 0 ||
    typeof(val) === 'string' && val.trim().length === 0
  )
}

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''


  if(!validator.isEmail(data.email)) {
    errors.email = 'Email must be a valid email address'
  }
  if(validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }
  if(validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}