'use strict';
var model={
    currentCat:null
    ,cats:[{},{name:'cat1',clicks:0,
    src:'images/cat1.jpg'},{name:'cat2',clicks:0,
    src:'images/cat2.jpg'},{name:'cat3',clicks:0,
    src:'images/cat3.jpg'},{name:'cat4',clicks:0,
    src:'images/cat4.jpg'},{name:'cat5',clicks:0,
    src:'images/cat5.jpg'}]}

var octopus={
    init:function(){
    
        viewforcatforlist.init();
        viewforcat.init();
        model.currentCat=model.cats[1]
        viewforcat.render();
        viewforAdminArea.init();
 
    },
    addClicks:function(){
          model.currentCat.clicks++;
          viewforcat.render();
          viewforAdminArea.render();
    },
    setCurrentCat:function(cat){
        model.currentCat=cat;

        viewforcat.render();
        viewforAdminArea.render();
    },
    getCurrentCat:function(){
        return model.currentCat
    }
    ,
    getCats:function(){
        return model.cats;
    },
    updateCateInfo:function(cat){
        model.currentCat.name=cat.name;
         model.currentCat.clicks=cat.clicks;
          model.currentCat.src=cat.src;
        viewforcat.render();
    }
}
var viewforcatforlist={
    init:function(){
        var ol=$('ol');
        for(var i=1;i<=5;i++){
            var cat=octopus.getCats()[i];
            ol.append('<li>'+cat.name+'</li>')
        }
    }
}
var viewforcat={
    init:function(){
        this.cat_name=$('#cat_name');
        this.click_nums=$('#click_nums');
        this.my_elem=$('#my-elem');
        var that=this;
        for(var i=0;i<=5;i++){
            $('ol li:nth-child('+i+')').click((function(icopy){
                return function(){
                    //viewforcat不会直接更改model
                    console.log(icopy-1)
                    var cat=octopus.getCats()[icopy];

                    octopus.setCurrentCat(cat);


                }
            })(i))
        }
        $('#my-elem').unbind('click').click(function(e) {
                //the element has been clicked... do stuff here
                octopus.addClicks();
            });
    },
    render:function(){
        var cat=octopus.getCurrentCat();
        this.cat_name.html(cat.name);
        this.click_nums.html(cat.clicks);
        this.my_elem.attr('src',cat.src);
    }
}


var viewforAdminArea={
    init:function(){

        this.admin_area=$('#admin_area');
        this.bt_admin=$('#bt_admin');
        this.input_cat_name=$('#input_cat_name');
        this.input_imageurl=$('#input_imageurl');
        this.input_clicks=$('#input_clicks');
        this.bt_cancel=$('#bt_cancel');
        this.bt_save=$('#bt_save');
        
        this.render();
        this.admin_area.hide();

        var that=this;
        this.bt_cancel.click(function(e){
            that.admin_area.hide();
        });
        this.bt_admin.click(function(e){
            that.admin_area.toggle();
        });
        this.bt_save.click(function(e){
            that.admin_area.hide();
            var cat={
                name: that.input_cat_name.val(),
                clicks: parseInt(that.input_clicks.val()),
                src:  that.input_imageurl.val()
            }
            octopus.updateCateInfo(cat)
        });
    },
    render:function(){
        var cat=octopus.getCurrentCat();
        this.input_cat_name.val(cat.name)
        this.input_imageurl.val(cat.src)
        this.input_clicks.val(parseInt(cat.clicks));
    }
}
octopus.init();