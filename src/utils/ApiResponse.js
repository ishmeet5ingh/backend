class ApiResponse {
    // whenever send a response send it from this class only.
    constructor(
        statuscode,
        data,
        message = "Success"
    ){
        this.statuscode = statuscode
        this.data = data
        this.message = message
        this.success = statuscode < 400
    }
}
