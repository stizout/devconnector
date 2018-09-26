const validator = require('validator');
const isEmpty = (val) => {
  return (
    val === undefined ||
    val === null || 
    typeof(val) === 'object' && Object.keys(val).length === 0 ||
    typeof(val) === 'string' && val.trim().length === 0
  )
}

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : ''

  if(!validator.isLength(data.text, {min: 10, max: 300})) {
    errors.text = "Post must be between 10 and 300 characters"
  }

  if(validator.isEmpty(data.text)) {
    errors.text = 'Test is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}