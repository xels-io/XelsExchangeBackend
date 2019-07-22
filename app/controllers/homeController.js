const Controller = loadCore('controller');



module.exports = class homeController extends Controller {

    constructor() {
        super();
    }

    index(){
        Response.render('pages/index');
    }
}


