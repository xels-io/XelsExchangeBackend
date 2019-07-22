class Pagination{

    constructor(totalCount,currentPage,pageUri,perPage=25){
        this.perPage = perPage;
        this.totalCount =parseInt(totalCount);
        this.currentPage = parseInt(currentPage);
        this.previousPage = this.currentPage - 1;
        this.nextPage = this.currentPage + 1;
        this.pageCount = Math.ceil(this.totalCount / this.perPage);
        pageUri = pageUri+'?';
        let iteration = 1;
        for (let q in Request.query){

            if(q!='page'){
                if(iteration==1){
                    pageUri += q+'='+Request.query[q];
                }else{
                    pageUri += '&'+q+'='+Request.query[q];
                }
                iteration++;
            }


        }
        if(iteration>1){
            pageUri = pageUri+'&page=';
        }else{
            pageUri = pageUri+'page=';
        }

        this.pageUri = pageUri;

        this.offset  = this.currentPage > 1 ? this.previousPage * this.perPage : 0;
        this.sidePages = 4;
        this.pages = false;
    }



    links(){
        if(this.totalCount<= this.perPage){
            return '';
        }
        this.pages='<ul class="pagination pagination-md">';

        if(this.previousPage > 0) {
            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + 1 + '">First</a></li>';
            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + this.previousPage + '">Previous</a></li>';
        }else{
            this.pages += '<li class="page-item disabled"><a class="page-link" href="' + this.pageUri + 1 + '">First</a></li>';
            this.pages += '<li class="page-item disabled"><a class="page-link" href="' + this.pageUri + this.previousPage + '">Previous</a></li>';
        }


        /*Add back links*/
        if(this.currentPage > 1){
            for (var x = this.currentPage - this.sidePages; x < this.currentPage; x++) {
                if(x > 0)
                    this.pages+='<li class="page-item"><a class="page-link" href="'+this.pageUri+x+'">'+x+'</a></li>';
            }
        }

        /*Show current page*/
        this.pages+='<li class="page-item active"><a class="page-link" href="'+this.pageUri+this.currentPage+'">'+this.currentPage+'</a></li>';

        /*Add more links*/
        for(x = this.nextPage; x <= this.pageCount; x++){

            this.pages+='<li class="page-item"><a class="page-link" href="'+this.pageUri+x+'">'+x+' </a></li>';

            if(x >= this.currentPage + this.sidePages)
                break;
        }


        /*Display next buttton navigation*/
        if(this.currentPage + 1 <= this.pageCount){
            this.pages+='<li class="page-item"><a class="page-link" href="'+this.pageUri+this.nextPage+'">Next</a></li>';
            this.pages+='<li class="page-item"><a class="page-link" href="'+this.pageUri+this.pageCount+'">Last</a></li>';
        }else{
            this.pages+='<li class="page-item disabled"><a class="page-link" href="'+this.pageUri+this.nextPage+'">Next</a></li>';
            this.pages+='<li class="page-item disabled"><a class="page-link" href="'+this.pageUri+this.pageCount+'">Last</a></li>';
        }


        this.pages+='</ul>';

        return this.pages;
    }
}
module.exports = Pagination;