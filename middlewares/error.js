const ErrorHandler  =  require("../utils/errorhandler"); 

module.exports = (err , req , res , next)=>{ 
      err.statusCode = err.statusCode  || 500 ; 
      err.message = err.message ||"internal server Error" ;   

    // wrong MongoDB ID error 
    if(err.name === "CastError"){ 
        const message  = 'Resource not Found. Invalid: $(err.path)' ; 
        err  = new ErrorHandler(message , 400); 

    }

    if(err.code  === 11000){
       const message  =  `Duplicate ${Object.keys(err.keyValue)}Entered`
    }
     if(err.name  ==="jsonWebTokenError"){
       const message  =  `json Web Token is invalid, try again` ; 
       err  = new ErrorHandler(message , 400); 
    }
    if(err.name  ==="TokenExpireError"){
       const message  =  `json Web Token is Expired, try again` ; 
       err  = new ErrorHandler(message , 400); 
    }

      res.status(err.statusCode).json({
        success: false , 
        message : err.message ,
        err : err.stack
      
      }) ; 
      
}