const Controller = loadCore('controller');

let $this;

module.exports = class homeController extends Controller {

    constructor() {
        super();
        $this = this;
    }

    index(Request,Response){
        let data = {
            Request : Request
        }
        Response.render('pages/index',data);
    }
}


