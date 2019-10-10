var errorObject = { errors:
   [ { value: '',
       msg: 'Invalid value',
       param: 'name',
       location: 'body' },
     { value: '',
       msg: 'Invalid value',
       param: 'email',
       location: 'body' },
     { value: '',
       msg: 'Invalid value',
       param: 'username',
       location: 'body' },
     { value: '',
       msg: 'Invalid value',
       param: 'password',
       location: 'body' } ] };




function errorRepackage(errorObject){
  let arrayErrors = errorObject['errors'];
  var errorPackage = [];
  arrayErrors.forEach((errors)=>{
    errorPackage.push(errors.param + ": " + errors.msg);
  });
  return {"errors": errorPackage};
}

console.log(errorRepackage(errorObject));
