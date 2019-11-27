const Controller = loadCore('controller');

let $this;

module.exports = class homeController extends Controller {

    constructor() {
        super();
        $this = this;
    }

    index(Request,Response){
        $this.data.Request = Request;
        Response.render('pages/index',$this.data);
    }
}


