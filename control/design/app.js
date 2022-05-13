var design;

function init(){
    loadData();
    setupHandlers();
}
init();
function setupHandlers(){
    ListLayout1.addEventListener("click", () => updateSelectedListLayout(1));
    ListLayout2.addEventListener("click",() => updateSelectedListLayout(2));
    DetailsLayout1.addEventListener("click", () => updateSelectedDetailsLayout(1));
    DetailsLayout2.addEventListener("click", () => updateSelectedDetailsLayout(2));

}

function updateSelectedListLayout(item){
    if(design.listLayout == item){
        return;
    }
    design.listLayout = item;
    if(item == 1){
        ListLayout.src = "./images/ListLayout1.png";
    } else {
         ListLayout.src = "./images/ListLayout2.png";
    }
    updateData();
}

function updateSelectedDetailsLayout(item){
    if(design.detailsLayout == item){
        return;
    }
    design.detailsLayout = item;
    if(item == 1){
        DetailsLayout.src = "./images/DetailsLayout1.png";
    } else {
        DetailsLayout.src = "./images/DetailsLayout2.png";
    }
    updateData();
}

function updateData(){
    Design.save(design).then(() => {});
}

function loadData(){
    Design.get().then((result, err) => {
        if (err) {
            console.log(err);
        } else {
            if(result && result.data && !isEmpty(result.data)){
                design = result.data;
            }
            else
            {
                design = new DesignItem();
            }
            updateUI();
            
        }
    });
}

function updateUI(){
    if(design.listLayout == 1){
        ListLayout.src = "./images/ListLayout1.png";
    } else {
        ListLayout.src = "./images/ListLayout2.png";
    }
    
    if(design.detailsLayout == 1){
        DetailsLayout.src = "./images/DetailsLayout1.png";
    } else {
        DetailsLayout.src = "./images/DetailsLayout2.png";
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
 }