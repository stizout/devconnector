const validator = require('validator');
const isEmpty = (val) => {
  return (
    val === undefined ||
    val === null || 
    typeof(val) === 'object' && Object.keys(val).length === 0 ||
    typeof(val) === 'string' && val.trim().length === 0
  )
}

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''



  if(validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required'
  }
  if(validator.isEmpty(data.company)) {
    errors.company = 'Company field is required'
  }
  if(validator.isEmpty(data.from)) {
    errors.from = 'From date field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}