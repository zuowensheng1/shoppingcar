
let cartBtn = document.querySelector('.cartIconBox');
let goodsBox = document.querySelector('.goodsBox');
let cartListBox = document.querySelector('.cartListBox');
console.log(cartBtn);

cartBtn.onclick = function(){
    console.log(666);
    //让购物车列表显示
    cartListBox.classList.remove('hide');
    //商品列表隐藏
    goodsBox.classList.add('hide');
    cartBtn.classList.add('hide');
}

//实现点击返回按钮  回到商品列表页
let backBtn = document.querySelector(".back");

backBtn.onclick = function(){
    cartListBox.classList.add("hide");
    goodsBox.classList.remove("hide");
    cartBtn.classList.remove('hide');
}

//选项卡
tabFn();
//getData(1);
//let goodsList = document.querySelectorAll('.goodsList ul');

function tabFn(){
    let tabs = document.querySelectorAll('.tabBox ul li');
    for(let i=0;i<tabs.length;i++){
        
        tabs[i].onclick=function(){
            clearClass(tabs);
            tabs[i].classList.add('current');
            //getData(i);
            renderGoods2(i);
            //goodsList[i].classList.remove("hide");
        }
    }
}
function clearClass(tabs){
    for(let i=0;i<tabs.length;i++){
        tabs[i].classList.remove('current');
        //goodsList[i].classList.add("hide");
    }
}

//下一步实现数据的请求  fetch   ajax
function getData(i){
    //创建一个实例
    let xhr =  new XMLHttpRequest();
    //let num  = i+1;
    xhr.open("get",`./data/${i+1}.json`);//用get的方式去./1.json的路径请求数据
    xhr.onreadystatechange = function(){
        //随时监听  请求的状态
        if(xhr.status == 200 && xhr.readyState == 4){
            //console.log(JSON.parse(xhr.response));//请求成功
            let data = JSON.parse(xhr.response);
            renderGoods(data);
        }
    }
    xhr.send();//发送
}

//把数据进行渲染
function renderGoods(data){
    //字符串拼接    然后利用innerHTML进行渲染
    let str = "";
    data.forEach(item => {
        str += `<li>
        <div class="imgBox">
            <img src="${item.img}" alt="">
        </div>
        <h3 class="til">${item.til}</h3>
        <div class="btn">加入购物车</div>
    </li>`;
        
    });
    console.log(str);

    let ul = document.querySelector(".goodsList ul");
    ul.innerHTML = str;
}

function getData2(i){
    return new  Promise((resolve,rejects)=>{
        let xhr =  new XMLHttpRequest();
        xhr.open("get",`./data/${i+1}.json`);//用get的方式去./1.json的路径请求数据
        xhr.onreadystatechange = function(){
            //随时监听  请求的状态
            if(xhr.status == 200 && xhr.readyState == 4){
                let data = JSON.parse(xhr.response);
                resolve(data);
            }
        }
        xhr.send();//发送
    });
}

function renderGoods2(i){
    getData2(i).then((data)=>{
        renderGoods(data);
    })
}

renderGoods2(0);