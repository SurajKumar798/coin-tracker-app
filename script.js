const table = document.querySelector('.table-body');
const apiData = " https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

async function fetchData(){
    try{
        const response = await fetch(apiData);
        const data = await response.json();

        let reqData = data;
        renderData(reqData);
    }catch(error){
        console.log('There was a problem fetching data: ', error);
    }
 }

 function renderData(reqData){
    reqData.forEach(items => {
        let priceRange = parseFloat(items.price_change_24h).toFixed(2);
        let sybmol = items.symbol.toUpperCase();

        let newRow = document.createElement('tr');
        newRow.innerHTML = `
         <td>
           <div class="coin-img">
            <img src="${items.image}" alt="coin-img" style="width: 45px; height: 45px" />
            <div class="coin-name">${items.name}</div>
           </div>
         </td>
         <td>${sybmol}</td>
         <td>${items.current_price}</td>
         <td>${items.total_volume}</td>
         <td class="percentage_change">${priceRange}%</td>
         <td>Mkr Cap: ${items.market_cap}</td>
        `;

        let tdCell = newRow.querySelector('.percentage_change');

        if(priceRange < 0){
            tdCell.style.color = 'red';
        }else{
            tdCell.style.color = 'green';
        }
        table.appendChild(newRow);
    });
 }

 function updateTable(searchItem){
    fetch(apiData)
    .then((response)=>{
        return response.json();
    })
    .then(data => {
        const filterData = data.filter(item => {
            return item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
                   item.symbol.toLowerCase().includes(searchItem.toLowerCase());
        });
        table.innerHTML = "";
        renderData(filterData);
    })
    .catch(error =>{
        console.log('Error fetching data:', error);
    });
 }

 document.getElementById('search-bar').addEventListener('keyup', function(e){
    const searchItem = e.target.value;
    updateTable(searchItem);
 });

 function marketCap(){
    fetch(apiData)
    .then(response =>{
        return response.json();
    }).then(data => {
        let sortedDataCap = data.sort((a,b)=> {
            return b.market_cap - a.market_cap;
        })
        table.innerHTML = '';
        renderData(sortedDataCap);
    })
 }

 function percentage(){
    fetch(apiData)
    .then(response=>{
        return response.json();
    }).then(data =>{
        let sortedDataPer = data.sort((a,b)=> {
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
        })
        table.innerHTML = '';
        renderData(sortedDataPer);
    })
 }
 document.getElementById('mkt-cap-btn').addEventListener('click', marketCap);
 document.getElementById('percentage-btn').addEventListener('click', percentage);
 fetchData();
 renderData();