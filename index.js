ptypes = [{name:"SI | Panamá",pp:50},
    {name:"SI | Classic",pp:40},
    {name:"SI | Premium",pp:30},
    {name:"SI | Access",pp:20},
    {name:"SI | Afinidad",pp:10},
    {name:"SI | Urgencias Médicas",pp:5},
    {name:"SC | Colectivo",pp:20},
    {name:"AU | Perdida Total",pp:30},
    {name:"AU | Cobertura Amplia",pp:20},
    {name:"AU | Rcv",pp:10},
    {name:"MA | Ap",pp:20},
    {name:"MA | Vida",pp:30},
    {name:"MA | Funerario",pp:10},
    {name:"MA | Pago Unico Cancer",pp:10},
    {name:"MA | Renta",pp:30},
    {name:"PA | Combinado",pp:50},
    {name:"PA | Incendio",pp:20},
    {name:"PA | Responsabilidad",pp:10},
    {name:"PA | Todo Riesgo",pp:50},
    {name:"PA | Riesgos Diversos",pp:30},
    {name:"PA | Fianza",pp:20},
    {name:"PA | Pyme",pp:10},
    {name:"PA | Otros",pp:10},
    ]
        
products = []
threshold = [10,20,30]
vm = 0.1
am = 0.2
miu = 3

function addProduct(){
    index = document.getElementById("products").value
    html = `<div class="p-card">
                <h2>${ptypes[index].name}</h2>
                <div class="flex-row">
                   <h3>Antiguedad (Años): </h3>
                   <input style="width: 15%;" type="number" value=1 onchange="updateProduct(${products.length},this.value,false)">
                </div>
                <div class="flex-row">
                    <h3>Puntos de Producto: </h3>
                    <input style="width: 15%;" type="number" value=${ptypes[index].pp} onchange="updateProduct(${products.length},this.value,true)">
                 </div>
            </div>>`
    const node = new DOMParser().parseFromString(html, "text/html").body
    .firstElementChild;
    document.getElementById("pcolumn").appendChild(node)

    products.push({
        type: ptypes[index].name,
        ant: 1,
        pp: ptypes[index].pp
    })
    console.log(products)
    updateTier()
}

function updateProduct(index,newValue, ispp){
    if (ispp){
        products[index].pp = parseInt(newValue)
    } else {
        products[index].ant = parseInt(newValue)
    }
    console.log(products)
    updateTier()
}

function updateThreshold(index, newValue){
    threshold[index] = newValue
    updateTier()
}



function loadProducts() {
    html  = `<label for="products">Comprar producto</label>
                <select name="products" id="products">
                    `

    ptypes.forEach((product, i) => {
       html+= `<option value=${i}>${product.name}</option>`
    });
    html+="</select>"
    document.getElementById("select").innerHTML = html
}

function updateHiper(index, newValue){
    switch (index)  {
    case 0:
        vm = newValue/100
        document.getElementById("vm").innerHTML = vm.toFixed(2)
        break
    case 1:
        am = newValue/100
        document.getElementById("am").innerHTML = am.toFixed(2)
        break
    case 2:
        miu = newValue
        document.getElementById("miu").innerHTML = miu
        break
    }
    updateTier()
}

function updateTier(){
   
    
    sumacc = 0
    products.forEach(product =>{
        pa = 0
        products.forEach(auxproduct => {
            if (product.type === auxproduct.type){
                pa +=1
            }
        })

        ant = 1+(product.ant*am)
        log = Math.log10(product.pp)/Math.log10(miu*pa)
        sumacc += ant*log
    })
    productNames = []
    products.forEach(auxproduct => {
        productNames.push(auxproduct.type)
    })

    pu = new Set(productNames).size


    points = ((1+(pu*vm))*sumacc).toFixed(0)

    document.getElementById("points").innerHTML = points
    updateTierPic(points)
}

function updateTierPic(points){

    html = ""

    if (points < threshold[0]) {
        html = `<div>
        <img src="assets/silver.jpg" alt="silver" style="width:100px;height:100px;">
            <p>Plata</p>
            </div>`
    } else if (points <threshold[1]){
        html =`<div><img src="assets/gold.png" alt="gold" style="width:100px;height:100px;">
            <p>Oro</p></div>`
    } else if (points < threshold[2]) {
        html =`<div><img src="assets/platinum.png" alt="platinum" style="width:100px;height:100px;">
            <p>Platino</p></div>`
    } else {
        html =`<div><img src="assets/diamond.png" alt="diamond" style="width:100px;height:100px;">
            <p>Diamante</p></div>`
    }

    const node = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
    document.getElementById("tier").innerHTML = ""
    document.getElementById("tier").appendChild(node)
}

loadProducts()